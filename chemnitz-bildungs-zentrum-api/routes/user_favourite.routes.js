import { Router } from "express";
const router = Router();
import { addToFavourites, removeFromFavourites } from "../controllers/user_favourite.controller.js";

// Add to user favourite
router.patch('/', addToFavourites);

// Remove user favourite facility
router.delete('/', removeFromFavourites);

export default router;
