import { IFacility } from "./facility.model";

export class School implements IFacility {
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
        public TYP: string,
        public BEZEICHNUNGZUSATZ: string,
        public PROFILE: string,
        public SPRACHEN: string,
        public WWW: string,
        public TRAEGERTYP: number,
        public BEZUGNR: number,
        public GEBIETSARTNUMMER: number,
        public SNUMMER: number,
        public NUMMER: number,
        public CreationDate: string,
        public Creator: string,
        public EditDate: string,
        public Editor: string
    ) {}
}