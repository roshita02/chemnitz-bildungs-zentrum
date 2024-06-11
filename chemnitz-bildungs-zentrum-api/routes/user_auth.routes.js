import { Router } from "express";
const router = Router();
import { registerUser, authenticateUser } from "../controllers/user.controller.js";

// Register route
router.post('/register', registerUser);

// Login route
router.post('/login', authenticateUser);
export default router;