import express from "express";

import {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    getCurrentUser,
    forgotPassword,
    verifyOtp,
    resetPassword,
    verifyRegistrationOtp
} from "../controllers/authController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import rateLimitMiddleware from "../middleware/rateLimitMiddleware.js"
const router = express.Router();

router.post("/register", registerUser);
router.post("/verify-registration", verifyRegistrationOtp);

router.post("/login", rateLimitMiddleware({
    windowMs: 15 * 60 * 1000,
    max: 10
}),
    loginUser
);
router.post("/refresh", refreshAccessToken);
router.post("/logout", logoutUser);
router.get("/me", authMiddleware, getCurrentUser);

router.post(
    "/forgot-password",
    rateLimitMiddleware({
        windowMs: 15 * 60 * 1000,
        max: 5
    }),
    forgotPassword
);

router.post(
    "/verify-otp",
    rateLimitMiddleware({
        windowMs: 15 * 60 * 1000,
        max: 5
    }),
    verifyOtp
);

router.post(
    "/reset-password",
    rateLimitMiddleware({
        windowMs: 15 * 60 * 1000,
        max: 5
    }),
    resetPassword
);

export default router;