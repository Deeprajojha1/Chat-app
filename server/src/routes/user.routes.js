/**
 * FILE PURPOSE
 * ----------------------------
 * Defines user endpoints.
 *
 * RESPONSIBILITY
 * ----------------------------
 * Map protected user URLs to controller functions.
 *
 * USED BY
 * ----------------------------
 * app.js
 *
 * REQUEST FLOW
 * ----------------------------
 * /api/users/* -> Auth middleware -> Controller.
 *
 * INTERVIEW NOTES
 * ----------------------------
 * Authentication middleware runs before protected route controllers.
 */
import { Router } from "express";
import { getUsers, updateProfile } from "../controllers/user.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { uploadAvatar } from "../middlewares/upload.middleware.js";

const router = Router();

router.use(protect);
router.get("/", getUsers);
router.patch("/profile", uploadAvatar.single("avatar"), updateProfile);

export default router;
