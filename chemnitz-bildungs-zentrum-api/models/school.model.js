import { Schema as _Schema, model } from "mongoose";
import facilitySchema from './facilitySchema.js';
const Schema = _Schema;

const SchoolSchema = new Schema({
    ...facilitySchema.obj,
    TYP: { type: String },
    ART: { type: String },
    STANDORTTYP: { type: String },
    BEZEICHNUNGZUSATZ: { type: String },
    PROFILE: { type: String },
    SPRACHEN: { type: String },
    WWW: { type: String },
    TRAEGERTYP: { type: Number },
    BEZUGNR: { type: Number },
    GEBIETSARTNUMMER: { type: Number },
    SNUMMER: { type: Number },
    NUMMER: { type: Number },
    CreationDate: { type: String },
    Creator: { type: String },
    EditDate: { type: String },
    Editor: { type: String }
}, { versionKey: false });

SchoolSchema.methods = facilitySchema.methods;

export default model("School", SchoolSchema, "schools")