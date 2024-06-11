import { Schema } from 'mongoose';

const addressSchema = new Schema({
    street: {
        type: String,
    },
    lat: {
        type: Number,
        required: true,
    },
    lon: {
        type: Number,
        required: true,
    }
}, { versionKey: false, _id: false });

export default addressSchema;
