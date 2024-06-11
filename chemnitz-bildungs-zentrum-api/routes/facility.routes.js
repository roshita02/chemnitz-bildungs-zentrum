import { Router } from "express";
import { get_facility, get_sub_types, retrieve_facilities } from '../controllers/facility.controller.js';

const router = Router();
router.get('/subTypes', get_sub_types);
router.get('/', retrieve_facilities);
router.get('/:facilityId', get_facility);
export default router;
