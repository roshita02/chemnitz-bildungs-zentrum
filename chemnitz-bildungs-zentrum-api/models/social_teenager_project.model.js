import { Schema as _Schema, model } from "mongoose";
import facilitySchema from './facilitySchema.js';
const Schema = _Schema;

const SocialTeenagerProjectSchema = new Schema({
    ...facilitySchema.obj,
    LEISTUNGEN: { type: String }
}, { versionKey: false });

SocialTeenagerProjectSchema.methods = facilitySchema.methods;
export default model("SocialTeenagerProject", SocialTeenagerProjectSchema, "social_teenager_projects")