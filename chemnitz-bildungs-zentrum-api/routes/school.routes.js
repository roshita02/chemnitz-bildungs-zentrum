import { Router } from "express";
const router = Router();
import { all_schools, get_by_id } from "../controllers/school.controller.js";
router.get("/all", all_schools);
router.get("/:id", get_by_id);
export default router;
