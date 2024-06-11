import School from '../models/school.model.js';
import Kindergarten from '../models/kindergarden.model.js';
import SocialChildProject from '../models/social_child_project.model.js';
import SocialTeenagerProject from '../models/social_teenager_project.model.js';

export const FACILITY_MODELS = {
    'school': School,
    'kindergarten': Kindergarten,
    'socialChildProject': SocialChildProject,
    'socialTeenagerProject': SocialTeenagerProject
};