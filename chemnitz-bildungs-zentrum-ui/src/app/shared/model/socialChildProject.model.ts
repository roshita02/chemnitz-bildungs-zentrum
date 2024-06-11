import { IFacility } from "./facility.model";

export class SocialChildProject implements IFacility {
    constructor(
        public _id: string,
        public X: number, 
        public  Y: number,
        public  OBJECTID: number,
        public  ID:  number,
        public  TRAEGER: string,
        public  BEZEICHNUNG: string,
        public  KURZBEZEICHNUNG: string,
        public  STRASSE: string,
        public  PLZ: number,
        public ORT: string,
        public TELEFON: string,
        public  FAX: string,
        public EMAIL: string,
        public ART: string,
        public STANDORTTYP: string,
        // Additional fields
        public LEISTUNGEN: string,
    ) {}
}