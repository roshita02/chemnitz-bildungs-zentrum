import { Schema as _Schema, model } from "mongoose";
import facilitySchema from './facilitySchema.js';
const Schema = _Schema;

const SocialChildProjectSchema = new Schema({
    ...facilitySchema.obj,
    LEISTUNGEN: { type: String }
}, { versionKey: false });

SocialChildProjectSchema.methods = facilitySchema.methods;
export default model("SocialChildProject", SocialChildProjectSchema, "social_child_projects")