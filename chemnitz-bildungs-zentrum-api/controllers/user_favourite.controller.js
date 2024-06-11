// import FACILITY_MODELS from '../config/constants.js';
import User from '../models/user.model.js';
import {FACILITY_MODELS} from '../config/constants.js';


export async function addToFavourites(req, res) {
    try {
        const userId = req.user.id;
        const { facilityId, facilityType } = req.query;
        const { name } = req.body;
        if (!facilityId || !facilityType) {
            res.status(400).json({sucess: false, message: 'Invalid params'})
        }
        const facilityModel = FACILITY_MODELS[facilityType];
        
        if (!facilityModel) {
            res.status(400).json({sucess: false, message: 'Invalid facility type'})
        }

        const facility = await facilityModel.findById(facilityId);
        const user = await User.findById(userId);
        if (!facility || !user) {
            res.status(401).json({sucess: false, message: 'Data not found'});
        }
        var userFavouriteFacility = user.favouriteFacility;
        if (userFavouriteFacility) {
            userFavouriteFacility.name = name;
            userFavouriteFacility.facilityId = facilityId;
            userFavouriteFacility.facilityType = facilityType;
            await user.save();
        } else {
            const favouriteFacility = {
                userId,
                facilityId,
                facilityType,
                name,
            }
            user.favouriteFacility = favouriteFacility;
            await user.save();
        }
        const response = {
            ...user.favouriteFacility.toObject(),
            address: facility?.address(),
            telephone: facility?.TELEFON,
            email: facility?.EMAIL,
        };
        res.status(200).json({ success: true, message: 'User Favorite updated successfully', data: response });
    } catch(error) {
        if (error.code === 11000) {
            // Handle unique key violation error
            const field = Object.keys(error.keyPattern)[0];
            res.status(409).json({ success: false, message: `A user with that ${field} already exists.` });
        } else {
            res.status(500).json({ success: false, message: "Internal server error"});
        }
    }
}

export async function removeFromFavourites(req, res) {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);
        if (!user || !user.favouriteFacility) {
            res.status(404).json({success: false, message: 'User does not have any favorite facility'});
        }
        user.favouriteFacility = null;
        await user.save();

        res.status(200).json({success: true, message: 'Facility removed from favourite'});
    } catch(error) {
        res.status(500).json({success: false, message: "Internal server error"});
    }
}