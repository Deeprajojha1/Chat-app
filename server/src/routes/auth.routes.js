/**
 * FILE PURPOSE
 * ----------------------------
 * Defines authentication endpoints.
 *
 * RESPONSIBILITY
 * ----------------------------
 * Map auth URLs to controller functions and validators.
 *
 * USED BY
 * ----------------------------
 * app.js
 *
 * REQUEST FLOW
 * ----------------------------
 * /api/auth/* -> Validator/Auth middleware -> Controller.
 *
 * INTERVIEW NOTES
 * ----------------------------
 * Routes should describe HTTP mapping, not contain business logic.
 */
import { Router } from "express";
import { login, logout, me, register } from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { uploadAvatar } from "../middlewares/upload.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { loginValidator, registerValidator } from "../validators/auth.validator.js";

const router = Router();

router.post("/register", uploadAvatar.single("avatar"), registerValidator, validate, register);
router.post("/login", loginValidator, validate, login);
router.post("/logout", logout);
router.get("/me", protect, me);

export default router;
