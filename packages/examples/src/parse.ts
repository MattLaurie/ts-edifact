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

import {Reader} from "@ts-edifact/core";
import {Edifact, InterchangeBuilder} from "@ts-edifact/legacy";
import * as path from 'path';

let document = '';
document += "UNB+UNOC:3+AAA676Y::AAA676Y+AAA336C+040127:0730+200401270001++++1++1'";
document += "UNH+1+CUSDEC:D:99B:UN'";
document += "BGM+830:::EXD+200401270001:1+9'";
document += "LOC+9+AUMEL::6'";
document += "LOC+12+USLAX::6'";
document += "LOC+28+US::6'";
document += "LOC+18+ABC123::95'";
document += "DTM+129:20030128:102'";
document += "GIS+N:79:95'";
document += "GIS+Y:107:95'";
document += "RFF+AWH:O'";
document += "PAC+++N:67:95'";
document += "PAC+++OT:146:95'";
document += "TDT+20+++11'";
document += "NAD+CN+++DHL++MELBOURNE'";
document += "MOA+39::AUD'";
document += "MOA+63:5000:AUD'";
document += "UNS+D'";
document += "CST+1+I::95'";
document += "FTX+AAA+++GOODS DESCRIPTION'";
document += "LOC+27+US::5+YY-FO::6'";
document += "MEA+ABW++KG:10'";
document += "MEA+WT++KG:10'";
document += "MOA+63:5000'";
document += "RFF+HS:03026200'";
document += "RFF+EP:PIF9999999'";
document += "UNS+S'";
document += "CNT+11:25'";
document += "UNT+28+1'";
document += "UNZ+1+200401270001'";

async function parseDocument(doc: string): Promise<Edifact> {
    const specDir = path.resolve('data');

    const reader = new Reader(specDir);
    const result = reader.parse(doc);
    const separators = reader.separators;

    const builder = new InterchangeBuilder(result, separators, specDir);
    return builder.interchange;
}

parseDocument(document)
    .then((doc: Edifact) => {
        console.log(`doc`, doc);
    })
    .catch((error: Error) => {
        console.log(error.stack);
        console.trace(`Caught exception while attempting to parse Edifact document. Reason: ${error.message}`);
    });
