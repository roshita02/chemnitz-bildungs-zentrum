import { Schema } from 'mongoose';

const facilitySchema = new Schema({
    X: { type: Number, required: true }, // Latitude
    Y: { type: Number, required: true }, // Longitude
    OBJECTID: { type: Number, required: true },
    ID: { type: Number, required: true },
    TRAEGER: { type: String },
    BEZEICHNUNG: { type: String },
    KURZBEZEICHNUNG: { type: String },
    STRASSE: { type: String },
    PLZ: { type: Number },
    ORT: { type: String },
    TELEFON: { type: String },
    FAX: { type: String },
    EMAIL: { type: String }
}, { _id: false });

facilitySchema.methods.address = function() {
    let address = [];
    if (this.STRASSE) {
        let street = this.STRASSE;
        if (this.HAUSBEZ) {
            street += ` ${this.HAUSBEZ}`;
        }
        address.push(street);
    }
   
    if (this.PLZ) {
        address.push(this.PLZ);
    }
    if (this.ORT) {
        address.push(this.ORT);
    }
    if (address.length > 0) {
        return address.reduce((acc, curr) => acc + ', ' + curr);
    }
    return '';
}

facilitySchema.methods.telephone = function() {
    let telephone = this.TELEFON;
    if (telephone) {
        telephone = telephone.replace(/\n/g, ', ');
    }
    return telephone;
}

export default facilitySchema;
