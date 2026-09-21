import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import {
    getProfile,
    updateProfile,
    changePassword,
    updateSettings
} from "../controllers/userController.js";

const router = express.Router();


router.use(authMiddleware);


router.get(
    "/profile",
    getProfile
);


router.patch(
    "/profile",
    updateProfile
);


router.patch(
    "/password",
    changePassword
);


router.patch(
    "/settings",
    updateSettings
);


export default router;