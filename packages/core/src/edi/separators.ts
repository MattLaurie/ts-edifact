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

interface Builder {
    build(): Separators;
}

export class Separators {

    componentSeparator: string;
    elementSeparator: string;
    decimalSeparator: string;
    releaseIndicator: string | undefined;
    blankSpace: string | undefined;
    segmentTerminator: string;
    segmentTagDelimiter: string | undefined;
    repetitionElementSeparator: string | undefined;

    constructor(
        componentSeparator: string,
        elementSeparator: string,
        decimalSeparator: string | undefined,
        segmentTerminator: string,
        releaseIndicator: string | undefined,
        blankSapce: string | undefined,
        segmentTagDelimiter: string | undefined,
        repetitionElementSeparator: string | undefined) {

        this.componentSeparator = componentSeparator;
        this.elementSeparator = elementSeparator;
        if (decimalSeparator) {
            this.decimalSeparator = decimalSeparator;
        } else {
            this.decimalSeparator = ".";
        }
        this.segmentTerminator = segmentTerminator;
        if (releaseIndicator) {
            this.releaseIndicator = releaseIndicator;
        }
        if (blankSapce) {
            this.blankSpace = blankSapce;
        }
        if (segmentTagDelimiter) {
            this.segmentTagDelimiter = segmentTagDelimiter;
        }
        if (repetitionElementSeparator) {
            this.repetitionElementSeparator = repetitionElementSeparator;
        }
    }

    public static escapeIfNeeded(separator: string): string {
        let sep: string = separator;
        if (separator === "+" || separator === "*" || separator === "\\" || separator === "~" || separator === "$"
            || separator === "(" || separator === ")" || separator === "^" || separator === "?" || separator === "."
            || separator === "|" || separator === "{" || separator === "}" || separator === "[" || separator === "]") {
            sep = "\\" + sep;
        }

        return sep;
    }
}

export class EdifactSeparatorsBuilder implements Builder {

    private _componentSeparator = ":";
    private _elementSeparator = "+";
    private _decimalSeparator = ".";
    private _releaseIndicator = "?";
    private _blankSpace = " ";
    private _segmentTerminator = "'";

    public componentSeparator(componentSeparator: string): EdifactSeparatorsBuilder {
        this._componentSeparator = componentSeparator;
        return this;
    }

    public elementSeparator(elementSeparator: string): EdifactSeparatorsBuilder {
        this._elementSeparator = elementSeparator;
        return this;
    }

    public decimalSeparator(decimalSeparator: string): EdifactSeparatorsBuilder {
        this._decimalSeparator = decimalSeparator;
        return this;
    }

    public releaseIndicator(releaseIndicator: string): EdifactSeparatorsBuilder {
        this._releaseIndicator = releaseIndicator;
        return this;
    }

    public blankSpace(blankSpace: string): EdifactSeparatorsBuilder {
        this._blankSpace = blankSpace;
        return this;
    }

    public segmentTerminator(segmentTerminator: string): EdifactSeparatorsBuilder {
        this._segmentTerminator = segmentTerminator;
        return this;
    }

    public build(): Separators {
        const separators: Separators = new Separators(
            this._componentSeparator,
            this._elementSeparator,
            this._decimalSeparator,
            this._segmentTerminator,
            this._releaseIndicator,
            this._blankSpace,
            undefined,
            undefined);

        return separators;
    }
}

export class TradacomsSeparatorsBuilder implements Builder {
    private _componentSeparator = ":";
    private _elementSeparator = "+";
    private _decimalSeparator = ".";
    private _segmentTagDelimiter = "=";
    private _segmentTerminator = "'";

    public componentSeparator(componentSeparator: string): TradacomsSeparatorsBuilder {
        this._componentSeparator = componentSeparator;
        return this;
    }

    public elementSeparator(elementSeparator: string): TradacomsSeparatorsBuilder {
        this._elementSeparator = elementSeparator;
        return this;
    }

    public decimalSeparator(decimalSeparator: string): TradacomsSeparatorsBuilder {
        this._decimalSeparator = decimalSeparator;
        return this;
    }

    public segmentTagDelimiter(segmentTagDelimiter: string): TradacomsSeparatorsBuilder {
        this._segmentTagDelimiter = segmentTagDelimiter;
        return this;
    }

    public segmentTerminator(segmentTerminator: string): TradacomsSeparatorsBuilder {
        this._segmentTerminator = segmentTerminator;
        return this;
    }

    public build(): Separators {
        const separators: Separators = new Separators(
            this._componentSeparator,
            this._elementSeparator,
            this._decimalSeparator,
            this._segmentTerminator,
            undefined,
            undefined,
            this._segmentTagDelimiter,
            undefined);

        return separators;
    }
}

export class AnsiX12SeparatorsBuilder implements Builder {
    private _componentSeparator = ":";
    private _elementSeparator = "*";
    private _repetitionElementSeparator = "^";
    private _segmentTerminator = "'";

    public componentSeparator(componentSeparator: string): AnsiX12SeparatorsBuilder {
        this._componentSeparator = componentSeparator;
        return this;
    }

    public elementSeparator(elementSeparator: string): AnsiX12SeparatorsBuilder {
        this._elementSeparator = elementSeparator;
        return this;
    }

    public repetitionElementSeparator(repetitionElementSeparator: string): AnsiX12SeparatorsBuilder {
        this._repetitionElementSeparator = repetitionElementSeparator;
        return this;
    }

    public segmentTerminator(segmentTerminator: string): AnsiX12SeparatorsBuilder {
        this._segmentTerminator = segmentTerminator;
        return this;
    }

    public build(): Separators {
        const separators: Separators = new Separators(
            this._componentSeparator,
            this._elementSeparator,
            undefined,
            this._segmentTerminator,
            undefined,
            undefined,
            undefined,
            this._repetitionElementSeparator);

        return separators;
    }
}
