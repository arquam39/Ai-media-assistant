import bcrypt from "bcryptjs";

import User from "../models/user.js";

import {
    profileSchema,
    passwordSchema,
    settingsSchema
} from "../utils/validators.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../middleware/asyncHandler.js";


// =========================
// Get Profile
// =========================

export const getProfile = asyncHandler(async (req, res) => {

    const user = await User.findById(
        req.user.id
    ).select("-password");


    if (!user) {
        throw new AppError(
            "User not found",
            404
        )
    }


    return res.status(200).json({
        success: true,
        data: user
    });

});


// =========================
// Update Profile
// =========================

export const updateProfile = asyncHandler(async (req, res) => {

    const data = profileSchema.parse(req.body);


    const user = await User.findById(
        req.user.id
    );


    if (!user) {
        throw new AppError(
            "User not found",
            404
        )
    }


    if (data.name !== undefined) {
        user.name = data.name;
    }


    if (data.bio !== undefined) {
        user.profile.bio = data.bio;
    }


    await user.save();


    return res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: user
    });

});


// =========================
// Change Password
// =========================

export const changePassword = asyncHandler(async (req, res) => {

    const data = passwordSchema.parse(req.body);


    const user = await User
        .findById(req.user.id)
        .select("+password");


    if (!user) {
        throw new AppError(
            "User not found",
            404
        )
    }


    const correctPassword =
        await bcrypt.compare(
            data.currentPassword,
            user.password
        );


    if (!correctPassword) {
        throw new AppError(
            "Current password is incorrect",
            400
        )
    }


    user.password = await bcrypt.hash(
        data.newPassword,
        12
    );


    await user.save();


    return res.status(200).json({
        success: true,
        message: "Password changed successfully"
    });
});


// =========================
// Update Settings
// =========================

export const updateSettings = asyncHandler(async (req, res) => {

    const data = settingsSchema.parse(req.body);


    const user = await User.findById(
        req.user.id
    );


    if (!user) {
        throw new AppError(
            "User not found",
            404
        )
    }


    if (data.theme !== undefined) {
        user.settings.theme = data.theme;
    }


    if (data.notifications !== undefined) {
        user.settings.notifications =
            data.notifications;
    }


    await user.save();


    return res.status(200).json({
        success: true,
        message: "Settings updated successfully",
        data: user.settings
    });
});