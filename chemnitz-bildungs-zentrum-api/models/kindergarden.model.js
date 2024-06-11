import { Schema as _Schema, model } from "mongoose";
import facilitySchema from './facilitySchema.js';
const Schema = _Schema;

const KindergardenSchema = new Schema({
    ...facilitySchema.obj,
    STRSCHL: { type: String },
    HAUSBEZ: { type: String },
    HORT: { type: Boolean },
    KITA: { type: Boolean },
    URL: { type: String },
    BARRIEREFREI: { type: Boolean },
    INTEGRATIV: { type: Boolean }
}, { versionKey: false });

KindergardenSchema.methods = facilitySchema.methods;

export default model("Kindergarden", KindergardenSchema, "kindergartens")