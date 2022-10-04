import {ResultType} from "./reader";
import * as APERAK from "./messageSpec/APERAK.struct.json";
import * as AUTHOR from "./messageSpec/AUTHOR.struct.json";
import * as BALANC from "./messageSpec/BALANC.struct.json";
import * as DESADV from "./messageSpec/DESADV.struct.json";
import * as GENRAL from "./messageSpec/GENRAL.struct.json";
import * as IFTMIN from "./messageSpec/IFTMIN.struct.json";
import * as INVOIC from "./messageSpec/INVOIC.struct.json";
import * as INVRPT from "./messageSpec/INVRPT.struct.json";
import * as ORDERS from "./messageSpec/ORDERS.struct.json";
import * as OSTENQ from "./messageSpec/OSTENQ.struct.json";
import * as OSTRPT from "./messageSpec/OSTRPT.struct.json";
import * as PARTIN from "./messageSpec/PARTIN.struct.json";
import * as TAXCON from "./messageSpec/TAXCON.struct.json";
import * as VATDEC from "./messageSpec/VATDEC.struct.json";
import {MessageType} from "./tracker";

export function findDefaultMessageSpec(messageType: string): MessageType[] {
    switch (messageType) {
        // default back to D01B messages
        case "APERAK":
            return APERAK;
        case "AUTHOR":
            return AUTHOR;
        case "BALANC":
            return BALANC;
        case "DESADV":
            return DESADV;
        case "GENRAL":
            return GENRAL;
        case "IFTMIN":
            return IFTMIN;
        case "INVOIC":
            return INVOIC;
        case "INVRPT":
            return INVRPT;
        case "ORDERS":
            return ORDERS;
        case "OSTENQ":
            return OSTENQ;
        case "OSTRPT":
            return OSTRPT;
        case "PARTIN":
            return PARTIN;
        case "TAXCON":
            return TAXCON;
        case "VATDEC":
            return VATDEC;
        default:
            throw new Error(`Could not find default message definiiton for message type '${messageType}''`);
    }
}
