/**
 * @author Roman Vottner
 * @copyright 2020 Roman Vottner
 * @license Apache-2.0
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Parser } from "./parser";
import { Validator, Dictionary, SegmentEntry, ElementEntry, ValidatorImpl } from "./validator";

import { SegmentTableBuilder } from "./segments";
import { ElementTableBuilder} from "./elements";
import { Separators } from "./edi/separators";
import { isDefined } from "./util";
import { Cache } from "./cache";
import { Configuration } from "./configuration";

export type ResultType = {
    name: string;
    elements: string[][];
};

class DefinitionTables {
    segmentTable: Dictionary<SegmentEntry>;
    elementTable: Dictionary<ElementEntry>;

    constructor(segmentTable: Dictionary<SegmentEntry>, elementTable: Dictionary<ElementEntry>) {
        this.segmentTable = segmentTable;
        this.elementTable = elementTable;
    }
}

/**
 * The `Reader` class is included for backwards compatibility. It translates an
 * UN/EDIFACT document to an array of segments. Each segment has a `name` and
 * `elements` property where `elements` is an array consisting of component
 * arrays. The class exposes a `parse()` method which accepts the document as a
 * string.
 */
export class Reader {

    private result: ResultType[];
    private elements: string[][];
    private components: string[];

    private validator: Validator;
    private parser: Parser;

    private defined: boolean = false;
    private validationTables: (Dictionary<SegmentEntry> | Dictionary<ElementEntry>)[] = [];

    private definitionCache: Cache<DefinitionTables> = new Cache(15);
    private unbCharsetDefined = false;

    separators: Separators;

    constructor(messageSpecDir?: string) {
        const config: Configuration = new Configuration({ validator: new ValidatorImpl() });
        this.parser = new Parser(config);
        this.validator = config.validator;

        this.result = [];
        const result: ResultType[] = this.result;

        this.elements = [];
        let elements: string[][] = this.elements;

        this.components = [];
        let components: string[] = this.components;

        let activeSegment: string | null;

        this.parser.onOpenSegment = (segment: string): void => {
            elements = [];
            result.push({ name: segment, elements:  elements });
            activeSegment = segment;
        };
        this.parser.onElement = (): void => {
            components = [];
            elements.push(components);
        };
        this.parser.onComponent = (value: string): void => {
            if (activeSegment === "UNB" && !this.unbCharsetDefined) {
                this.parser.updateCharset(value);
                this.unbCharsetDefined = true;
            }
            components.push(value);
        };
        this.parser.onCloseSegment = (): void => {
            if (isDefined(activeSegment)) {
                // Update the respective segment and element definitions once we know the exact version
                // of the document
                if (activeSegment === "UNH") {
                    const messageType: string = elements[1][0];
                    const messageVersion: string = elements[1][1];
                    const messageRelease: string = elements[1][2];

                    const key: string = messageVersion + messageRelease + "_" + messageType;
                    if (this.definitionCache.contains(key)) {
                        const tables: DefinitionTables = this.definitionCache.get(key);
                        this.validator.define(tables.segmentTable);
                        this.validator.define(tables.elementTable);
                    } else {
                        let segmentTableBuilder: SegmentTableBuilder = new SegmentTableBuilder(messageType);
                        let elementTableBuilder: ElementTableBuilder = new ElementTableBuilder(messageType);

                        const version: string = (messageVersion + messageRelease).toUpperCase();
                        segmentTableBuilder = segmentTableBuilder.forVersion(version) as SegmentTableBuilder;
                        elementTableBuilder = elementTableBuilder.forVersion(version) as ElementTableBuilder;

                        if (messageSpecDir) {
                            segmentTableBuilder = segmentTableBuilder.specLocation(messageSpecDir);
                            elementTableBuilder = elementTableBuilder.specLocation(messageSpecDir);
                        } else {
                            segmentTableBuilder = segmentTableBuilder.specLocation("./");
                            elementTableBuilder = elementTableBuilder.specLocation("./");
                        }

                        const tables: DefinitionTables = new DefinitionTables(segmentTableBuilder.build(), elementTableBuilder.build());
                        this.validator.define(tables.segmentTable);
                        this.validator.define(tables.elementTable);

                        this.definitionCache.insert(key, tables);
                    }
                }
                activeSegment = null;
            }
        };

        // will initialize default separators
        this.separators = this.parser.separators();
    }

    /**
     * Provide the underlying `Validator` with segment or element definitions.
     *
     * @summary Define segment and element structures.
     * @param definitions An object containing the definitions.
     */
    define(definitions: (Dictionary<SegmentEntry> | Dictionary<ElementEntry>)): void {
        this.validator.define(definitions);
    }

    private initializeIfNeeded(): void {
        if (!this.defined) {
            if (this.validationTables.length > 0) {
                for (const table of this.validationTables) {
                    this.validator.define(table);
                }
            } else {
                // basic Edifact envelop validation, i.e. UNB, UNH, UNS and UNZ
                this.validator.define(SegmentTableBuilder.enrichWithDefaultSegments(new Dictionary<SegmentEntry>()));
                this.validator.define(ElementTableBuilder.enrichWithDefaultElements(new Dictionary<ElementEntry>()));
            }
            this.defined = true;
        }
    }

    parse(document: string): ResultType[] {
        this.initializeIfNeeded();

        this.parser.write(document);
        this.parser.end();
        // update separators in case the document contained a UNA header
        // with custom separators
        this.separators = this.parser.separators();

        return this.result;
    }
}
