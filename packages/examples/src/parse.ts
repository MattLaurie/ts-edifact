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

let CUSDEC = '';
CUSDEC += "UNB+UNOC:3+AAA676Y::AAA676Y+AAA336C+040127:0730+200401270001++++1++1'";
CUSDEC += "UNH+1+CUSDEC:D:99B:UN'";
CUSDEC += "BGM+830:::EXD+200401270001:1+9'";
CUSDEC += "LOC+9+AUMEL::6'";
CUSDEC += "LOC+12+USLAX::6'";
CUSDEC += "LOC+28+US::6'";
CUSDEC += "LOC+18+ABC123::95'";
CUSDEC += "DTM+129:20030128:102'";
CUSDEC += "GIS+N:79:95'";
CUSDEC += "GIS+Y:107:95'";
CUSDEC += "RFF+AWH:O'";
CUSDEC += "PAC+++N:67:95'";
CUSDEC += "PAC+++OT:146:95'";
CUSDEC += "TDT+20+++11'";
CUSDEC += "NAD+CN+++DHL++MELBOURNE'";
CUSDEC += "MOA+39::AUD'";
CUSDEC += "MOA+63:5000:AUD'";
CUSDEC += "UNS+D'";
CUSDEC += "CST+1+I::95'";
CUSDEC += "FTX+AAA+++GOODS DESCRIPTION'";
CUSDEC += "LOC+27+US::5+YY-FO::6'";
CUSDEC += "MEA+ABW++KG:10'";
CUSDEC += "MEA+WT++KG:10'";
CUSDEC += "MOA+63:5000'";
CUSDEC += "RFF+HS:03026200'";
CUSDEC += "RFF+EP:PIF9999999'";
CUSDEC += "UNS+S'";
CUSDEC += "CNT+11:25'";
CUSDEC += "UNT+28+1'";
CUSDEC += "UNZ+1+200401270001'";

let CUSCAR = "";
CUSCAR += "UNB+UNOC:3+AAA676Y::AAA676Y+AAA336C+040127:0730+200401270003++++1++1'";
CUSCAR += "UNH+1+CUSCAR:D:99B:UN'";
CUSCAR += "BGM+101:::WARREL+200401270003:1+9'";
CUSCAR += "DTM+204:20040127:102'";
CUSCAR += "DTM+204:0700:401'";
CUSCAR += "LOC+4+ABC123::95'";
CUSCAR += "LOC+5+9034P::95'";
CUSCAR += "RFF+ED:AAAAAAMLN'";
CUSCAR += "CNI+1+:::I'";
CUSCAR += "RFF+HS:03026200'";
CUSCAR += "QTY+1:10:KG'";
CUSCAR += "FTX+AAA+++GOODS DESCRIPTION'";
CUSCAR += "GID+1'";
CUSCAR += "UNT+13+1'";
CUSCAR += "UNZ+1+200401270003'";

let CUSREP = "";
CUSREP += "UNB+UNOC:3+AAA676Y::AAA676Y+AAA336C+040127:0830+200401270013++++1++1'";
CUSREP += "UNH+1+CUSREP:D:99B:UN'";
CUSREP += "BGM+124:::DEPART+200401270013:1+9'";
CUSREP += "DTM+136:20040127:102'";
CUSREP += "DTM+136:0700:401'";
CUSREP += "LOC+5+9053M::95'";
CUSREP += "TDT+20+N1++11+N2::95+++N3::11'"; // <- validator broken?
CUSREP += "LOC+8+NZAKL::6'";
CUSREP += "UNT+8+1'";
CUSREP += "UNZ+1+200401270013'";

let GENRAL = "";
GENRAL += "UNB+UNOC:3+AAA676Y::AAA676Y+AAA336C+040127:1200+200401270016++++1++1'";
GENRAL += "UNH+1+GENRAL:D:99B:UN'";
GENRAL += "BGM+23:::STREQ+200401270016:1+13'";
GENRAL += "RFF+TN:AAAAAAAT4'";
GENRAL += "UNT+4+1'";
GENRAL += "UNZ+1+200401270016'";

// TDT+20+ABC123++6+DEF456::3'
// TDT+20+ABC123++11+DEF456::95+++GHI789::11'
// TDT+20++++DEF456::95'
// TDT+20+000001++11+ABC123::95+++5000201::11'

// TDT
//  20
//  000001
//
//  11
//  ABC123::95
//
//
//  5000201::11'


// TDT+20+001++11+ABC123::95+++5000201::11'
// TDT
//  8051 20
//  8022 001
//  C220
//  C228 11
//  C040 ABC123::95
//  8101
//  C401
//  C222 5000201::11
//  8281
async function parseDocument(doc: string): Promise<Edifact> {
    const specDir = path.resolve('data');

    const reader = new Reader(specDir);
    const result = reader.parse(doc);
    const separators = reader.separators;

    const builder = new InterchangeBuilder(result, separators, specDir);
    return builder.interchange;
}

const asJson = (value: any): string => {
    const getCircularReplacer = () => {
        const seen = new WeakSet();
        return (key: string, value: any) => {
            if (typeof value === "object" && value !== null) {
                if (seen.has(value)) {
                    return;
                }
                seen.add(value);
            }
            return value;
        };
    };
    return JSON.stringify(value, getCircularReplacer(), 2);
}

parseDocument(CUSREP)
    .then((doc: Edifact) => {
        console.log(`doc`, asJson(doc));
    })
    .catch((error: Error) => {
        console.log(error.stack);
        console.trace(`Caught exception while attempting to parse Edifact document. Reason: ${error.message}`);
    });
