import School from '../models/school.model.js';
import Kindergarden from '../models/kindergarden.model.js';
import SocialChildProject from '../models/social_child_project.model.js';
import SocialTeenagerProject from '../models/social_teenager_project.model.js';
import User from '../models/user.model.js';

import axios from 'axios';

const facilityModels = {
    'school': School,
    'kindergarten': Kindergarden,
    'socialChildProject': SocialChildProject,
    'socialTeenagerProject': SocialTeenagerProject
}

export async function get_sub_types(req,res) {
    try {
        const {facilityType} = req.query;
        const FacilityModel = facilityModels[facilityType];
        if (!FacilityModel) {
            return res.status(400).json({success: false, message: 'Invalid facility type'});
        }

        const schoolTypes = await FacilityModel.distinct('ART');
        if (schoolTypes.length > 0 ) {
            res.status(200).json({success: true, data: schoolTypes});
        } else {
            res.status(200).json({success: true, data: []});
        }
    } catch(error) {
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

// Route to list and filter facilities
export async function retrieve_facilities(req,res){
    try {
        const { school, kindergarten, socialChildProject, socialTeenagerProject, subType } = req.query;
        let facilities = [];

        if (school) {
            let schoolResults = {};
            if (subType) {
                schoolResults = await School.find({ART: subType});
            } else {
                schoolResults = await School.find();
            }
            facilities = facilities.concat(schoolResults.map(school => ({ _id: school._id, X: school.X, Y: school.Y, facilityType: 'School' })));
        }

        if (kindergarten) {
            const kindergartenResults = await Kindergarden.find();
            facilities = facilities.concat(kindergartenResults.map(kindergarten => ({ _id: kindergarten._id, X: kindergarten.X, Y: kindergarten.Y, facilityType: 'Kindergarten' })));
        }

        if (socialChildProject) {
            const socialChildProjectResults = await SocialChildProject.find();
            facilities = facilities.concat(socialChildProjectResults.map(project => ({ _id: project._id, X: project.X, Y: project.Y, facilityType: 'SocialChildProject' })));
        }

        if (socialTeenagerProject) {
            const socialTeenagerProjectResults = await SocialTeenagerProject.find();
            facilities = facilities.concat(socialTeenagerProjectResults.map(project => ({ _id: project._id, X: project.X, Y: project.Y, facilityType: 'SocialTeenagerProject' })));
        }

        if (!school && !kindergarten && !socialChildProject && !socialTeenagerProject) {
            const schoolResults = await School.find();
            const kindergardenResults = await Kindergarden.find();
            const socialChildProjectResults = await SocialChildProject.find();
            const socialTeenagerProjectResults = await SocialTeenagerProject.find();

            facilities = facilities.concat(schoolResults.map(school => ({ _id: school._id, X: school.X, Y: school.Y, facilityType: 'School' })));
            facilities = facilities.concat(kindergardenResults.map(kindergarden => ({ _id: kindergarten._id, X: kindergarten.X, Y: kindergarten.Y, facilityType: 'Kindergarten' })));
            facilities = facilities.concat(socialChildProjectResults.map(project => ({ _id: project._id, X: project.X, Y: project.Y, facilityType: 'SocialChildProject' })));
            facilities = facilities.concat(socialTeenagerProjectResults.map(project => ({ _id: project._id, X: project.X, Y: project.Y, facilityType: 'SocialTeenagerProject' })));
        }

        res.status(200).json({success: true, data: facilities});
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

export async function get_facility(req,res) {
    try {
        const {facilityType} = req.query;
        const userId = req.user.id;
        const facilityId = req.params.facilityId;
        if (!facilityType || !facilityId) {
            return res.status(400).json({message: 'Facility type/id is required'});
        }
        const FacilityModel = facilityModels[facilityType];
        if (!FacilityModel) {
            return res.status(400).json({success: false, message: 'Invalid facility type'});
        }
      
        const facility = await FacilityModel.findById(facilityId);
        facility.facilityType = facilityType;
        let newFacility = {name: get_facility_name(facility)};
        
        if (!facility || !facility.id) {
            res.status(404).json({success: false, message: 'Facility not found'});
        }

        if (facilityType == 'school' && facility.ART) {
            newFacility.type = facility.ART;
        }


        let facilityInfo = await get_additional_facility_information(facility);
        if (facilityInfo) {
            newFacility = {
                name: facilityInfo.name,
                display_name: facilityInfo.display_name,
                lat: facilityInfo.lat,
                lon: facilityInfo.lon,
            }
            if (facilityInfo.extratags) {
                newFacility.openingHours = facilityInfo.extratags.opening_hours;
                newFacility.wheelchair = facilityInfo.extratags.wheelchair;
                newFacility.website = facilityInfo.extratags["contact:website"];
                newFacility.operator = facilityInfo.extratags.operator;
                newFacility.operatorType = facilityInfo.extratags["operator:type"];
            }
        }

        const user = await User.findById(userId).populate('favouriteFacility');
        if (user.favouriteFacility && user.favouriteFacility.facilityId == facilityId) {
            newFacility.isFavourite = true;
        } else {
            newFacility.isFavourite = false;
        }

       
        newFacility.lat = facility.Y;
        newFacility.lon = facility.X;
        newFacility.facilityId = facilityId;
        newFacility.facilityType = facilityType;
        newFacility.traeger = facility.TRAEGER;
        newFacility.telephone = facility.telephone();
        newFacility.email = facility.EMAIL;
        newFacility.fax = facility.FAX;
        newFacility.address = facility.address();
        newFacility.barrierFree = facility.BARRIEREFREI;
        newFacility.integrative = facility.INTEGRATIV;

        if (newFacility.name === null || newFacility.name === undefined || newFacility.name === 'NaN') {
            newFacility.name = get_facility_name(facility);
        }
        res.status(200).json({success: true, data: newFacility});
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

async function get_additional_facility_information(facility) {
    let lat = facility.Y;
    let lon = facility.X;
    const url = `https://nominatim.openstreetmap.org/reverse`;
    const params = {
      format: 'json',
      lat: lat,
      lon: lon,
      zoom: 18,
      addressdetails: 1,
      extratags: 1,
      namedetails: 1
    };
  
    try {
      const res = await axios.get(url, { params });
      if (res.data) {
        console.log(res.data);
        const resName = res.data['namedetails']['name'];
        const facilityName = get_facility_name(facility);
        console.log(facilityName);
        if ((res.lat == lat && res.lon == lon) || (resName == facilityName || facilityName.includes(resName) || resName.includes(facilityName) )) {
            res.data.name = resName;
            return res.data;
        }
        return null;
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
}


function get_facility_name(facility) {
    if (facility.facilityType == 'school' || facility.facilityType == 'kindergarten') {
        return facility.BEZEICHNUNG;
    }
    if (facility.TRAEGER) {
        return facility.TRAEGER;
    }
    return get_address_name(facility);
}

function get_address_name(facility) {
    if (facility.STRASSE && facility.PLZ && facility.ORT) {
        return facility.STRASSE + facility.PLZ + facility.ORT
    }
    return '';
}
