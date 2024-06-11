import { Router } from "express";
const router = Router();
import { updateUser, updateUserAddress, archiveUser, listUsers, listUserById, logout, changePassword, deleteUser } from "../controllers/user.controller.js";

// Update user address
router.patch('/update', updateUser);

// Update user address
router.patch('/updateAddress', updateUserAddress);

// Route to list all users with optional isArchived filter
router.get('/all', listUsers);

// Route to list one user by ID
router.get('/:userId', listUserById);

router.patch('/changePassword/', changePassword);
router.post('/logout/', logout);

router.delete('/delete', deleteUser);

export default router;
