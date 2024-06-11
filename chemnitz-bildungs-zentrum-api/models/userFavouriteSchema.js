import { Schema, model } from 'mongoose';
import { FACILITY_MODELS } from '../config/constants.js';

const userFavouriteSchema = new Schema({
    facilityId: {
        type: String,
        required: true
    },
    facilityType: {
        type: String,
        required: true,
        enum: ['school', 'kindergarten', 'socialChildProject', 'socialTeenagerProject'],
    },
    name: {
        type: String
    },
}, { versionKey: false, _id: false });

userFavouriteSchema.methods.facility = async function() {
    try {
        const facilityId = this.facilityId;
        const facilityType = this.facilityType;
        const facilityModel = FACILITY_MODELS[facilityType];
            
        if (!facilityModel) {
            return '';
        }
        const facility = await facilityModel.findById(facilityId);
        if (facility) {
            return facility;
        }
        return null;
    } catch(error) {
        return null;
    }
}

// userFavouriteSchema.methods.telephone = async function() {
//     const facilityId = this.facilityId;
//     const facilityType = this.facilityType;
//     const facilityModel = FACILITY_MODELS[facilityType];
        
//     if (!facilityModel) {
//         return '';
//     }
//     const facility = await facilityModel.findById(facilityId);
//     if (facility) {
//         return facility.TELEFON;
//     }
//     return '';
// }


// userFavouriteSchema.methods.address = async function() {
//     const facilityId = this.facilityId;
//     const facilityType = this.facilityType;
//     const facilityModel = FACILITY_MODELS[facilityType];
//     if (!facilityModel) {
//         return '';
//     }
//     const facility = await facilityModel.findById(facilityId);
//     if (facility) {
//         return facility.address();
//     }
//     return '';
// }
export default userFavouriteSchema;
