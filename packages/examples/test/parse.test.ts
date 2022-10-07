import {Edifact, InterchangeBuilder} from "@ts-edifact/legacy/src";
import path from "path";
import {Reader} from "@ts-edifact/core/src";

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


describe('parse', () => {
    it('should parse a CUSREP', async () => {
        // let CUSREP = "";
        // CUSREP += "UNA:+,? '";
        // CUSREP += "UNB+UNOC:3+AAA676Y::AAA676Y+AAA336C+040127:0830+200401270013++++1++1'";
        // CUSREP += "UNH+1+CUSREP:D:99B:UN'";
        // CUSREP += "BGM+124:::DEPART+200401270013:1+9'";
        // CUSREP += "DTM+136:20040127:102'";
        // CUSREP += "DTM+136:0700:401'";
        // CUSREP += "LOC+5+9053M::95'";
        // CUSREP += "TDT+20+N1++11+N2::95+++N3::11'"; // <- validator broken?
        // CUSREP += "LOC+8+NZAKL::6'";
        // CUSREP += "UNT+8+1'";
        // CUSREP += "UNZ+1+200401270013'";

        let CUSREP = "";
        CUSREP += "UNB+UNOC:3+AAA676Y::AAA676Y+AAA336C+040127:0830+200401270013++++1++1'";
        CUSREP += "UNH+1+CUSREP:D:99B:UN'";
        CUSREP += "BGM+124:::DEPART+200401270013:1+9'";
        CUSREP += "TDT+20+N1++11+N2::95+++N3::11'"; // <- validator broken?
        // CUSREP += "TDT+20+N1++11+N2::95++X:Y+N3::11'"; // <- thinks it's mandatory

        const specDir = path.resolve('data');

        const reader = new Reader(specDir);
        const result = reader.parse(CUSREP);
        const separators = reader.separators;

        const doc = new InterchangeBuilder(result, separators, specDir);
        console.log(`doc`, asJson(doc));
    })
})
