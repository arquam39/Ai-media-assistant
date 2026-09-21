import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";
import User from "../models/user.js";
import EmailVerification from "../models/emailVerification.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../middleware/asyncHandler.js";

import {
    generateAccessToken,
    generateRefreshToken
} from "../utils/generateToken.js";

import {
    registerSchema,
    loginSchema
} from "../utils/validators.js";
import { appendFile } from "fs";


const setAuthCookies = (res, userId) => {

    const accessToken = generateAccessToken(userId);

    const refreshToken = generateRefreshToken(userId);


    res.cookie("token", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 15 * 60 * 1000
    });


    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });
};


// =========================
// Register
// =========================


export const registerUser = asyncHandler(async (req, res) => {
    const data = registerSchema.parse(req.body);

    const {
        name,
        email,
        password
    } = data;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new AppError(
            "An account with this email already exists",
            409
        );
    }

    const hashedPassword = await bcrypt.hash(
        password,
        12
    );

    // Generate 6-digit OTP
    const otp = crypto
        .randomInt(100000, 1000000)
        .toString();

    // Hash OTP before storing it
    const hashedOtp = await bcrypt.hash(otp, 10);

    // Remove previous pending verification
    await EmailVerification.deleteOne({
        email
    });

    // Store temporary registration
    await EmailVerification.create({
        name,
        email,
        password: hashedPassword,
        otp: hashedOtp,
        expiresAt: new Date(
            Date.now() + 10 * 60 * 1000
        )
    });

    // Send OTP
    const transporter =
        nodemailer.createTransport({
            service: "gmail",

            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

    // Send OTP email
    await transporter.sendMail({
        from: process.env.EMAIL_USER,

        to: email,

        subject: "Email Verification OTP",

        text: `
Your Email Verification OTP is: ${otp}.This OTP will expire in 10 minutes.
If you did not request a Email verification, you can safely ignore this email.
            `
    });

    return res.status(200).json({
        success: true,
        message: "Verification code sent to your email"
    });

});

// =========================
// Verify new User
// =========================

export const verifyRegistrationOtp = asyncHandler(async (req, res) => {

    const { email, otp } = req.body;

    const verification =
        await EmailVerification.findOne({ email });

    if (!verification) {
        throw new AppError(
            "Verification request not found",
            404
        );
    }

    // Check expiration
    if (verification.expiresAt < new Date()) {

        await EmailVerification.deleteOne({
            _id: verification._id
        });

        throw new AppError(
            "Verification code has expired",
            400
        );
    }

    // Compare OTP
    const isValid = await bcrypt.compare(
        otp,
        verification.otp
    );

    if (!isValid) {
        throw new AppError(
            "Invalid verification code",
            400
        )
    }

    // Create actual user
    const user = await User.create({
        name: verification.name,
        email: verification.email,
        password: verification.password,
        isVerified: true
    });

    // Remove temporary verification data
    await EmailVerification.deleteOne({
        _id: verification._id
    });

    return res.status(201).json({
        success: true,
        message: "Email verified and account created successfully",
        data: {
            id: user._id,
            name: user.name,
            email: user.email
        }
    });

});

// =========================
// Login
// =========================

export const loginUser = asyncHandler(async (req, res) => {

    const data = loginSchema.parse(req.body);

    const {
        email,
        password
    } = data;


    const user = await User
        .findOne({ email })
        .select("+password");


    if (!user) {
        throw new AppError(
            "Invalid email or password",
            401
        );
    }


    const passwordMatch = await bcrypt.compare(
        password,
        user.password
    );


    if (!passwordMatch) {
        throw new AppError(
            "Invalid email or password",
            401
        );
    }


    setAuthCookies(
        res,
        user._id.toString()
    );


    return res.status(200).json({
        success: true,
        message: "Login successful",
        data: {
            id: user._id,
            name: user.name,
            email: user.email
        }
    });

});


// =========================
// Refresh Token
// =========================

export const refreshAccessToken = asyncHandler(async (req, res) => {

    const refreshToken =
        req.cookies.refreshToken;


    if (!refreshToken) {
        throw new AppError(
            "Refresh token required",
            401
        )
    }

    const decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET
    );


    const user = await User.findById(
        decoded.id
    );


    if (!user) {
        throw new AppError(
            "User no longer exists",
            401
        )
    }

    const accessToken = generateAccessToken(
        user._id.toString()
    );


    res.cookie("token", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 15 * 60 * 1000
    });


    return res.status(200).json({
        success: true,
        message: "Access token refreshed"
    });
});


// =========================
// Current User
// =========================

export const getCurrentUser = asyncHandler(async (req, res) => {

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
// Logout
// =========================

export const logoutUser = asyncHandler(async (req, res) => {

    res.clearCookie("token");

    res.clearCookie("refreshToken");


    return res.status(200).json({
        success: true,
        message: "Logged out successfully"
    });
});

// =========================
// forgotPassword
// =========================

export const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        throw new AppError(
            "Email is required",
            400
        )
    }

    const user = await User.findOne({
        email: email.toLowerCase().trim()
    });

    // Don't reveal whether the email exists
    if (!user) {
        throw new AppError(
            "If an account exists with this email, an OTP has been sent.",
            200
        )
    }

    // Generate 6-digit OTP
    const otp = crypto
        .randomInt(100000, 1000000)
        .toString();

    // console.log("TEST OTP:", otp);

    // Hash OTP before storing
    const otpHash = await bcrypt.hash(
        otp,
        10
    );

    // Save OTP hash and expiry
    user.resetOtpHash = otpHash;

    user.resetOtpExpiry =
        new Date(
            Date.now() + 10 * 60 * 1000
        );

    await user.save();

    // Create email transporter
    const transporter =
        nodemailer.createTransport({
            service: "gmail",

            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

    // Send OTP email
    await transporter.sendMail({
        from: process.env.EMAIL_USER,

        to: user.email,

        subject: "Password Reset OTP",

        text: `
Your password reset OTP is: ${otp}. This OTP will expire in 10 minutes.
If you did not request a password reset, you can safely ignore this email.`
    });

    return res.status(200).json({
        success: true,
        message:
            "If an account exists with this email, an OTP has been sent."
    });
});

// =========================
// verifyOtp
// =========================

export const verifyOtp = asyncHandler(async (req, res) => {

    const { email, otp } = req.body;

    if (!email || !otp) {
        throw new AppError(
            "Email and OTP are required",
            400
        )
    }

    // Validate OTP format
    if (!/^\d{6}$/.test(otp)) {
        throw new AppError(
            "OTP must be exactly 6 digits",
            400
        )
    }

    const user = await User
        .findOne({
            email: email.toLowerCase().trim()
        })
        .select(
            "+resetOtpHash +resetOtpExpiry"
        );

    if (!user) {
        throw new AppError(
            "Invalid OTP",
            400
        )
    }

    // Check whether OTP exists
    if (
        !user.resetOtpHash ||
        !user.resetOtpExpiry
    ) {
        throw new AppError(
            "No OTP request found",
            400
        )
    }

    // Check expiry
    if (
        user.resetOtpExpiry.getTime() <
        Date.now()
    ) {
        throw new AppError(
            "OTP has expired",
            400
        )
    }

    // Compare entered OTP with hash
    const isValidOtp =
        await bcrypt.compare(
            otp,
            user.resetOtpHash
        );

    if (!isValidOtp) {
        throw new AppError(
            "Invalid OTP",
            400
        )
    }

    // OTP is correct
    const resetToken = jwt.sign(
        {
            userId:
                user._id.toString(),

            purpose:
                "password-reset"
        },

        process.env.JWT_SECRET,

        {
            expiresIn: "10m"
        }
    );

    // Clear OTP so it cannot be reused
    user.resetOtpHash = null;
    user.resetOtpExpiry = null;

    await user.save();

    return res.status(200).json({
        success: true,
        message:
            "OTP verified successfully",

        resetToken
    });
});

// =========================
// resetPassword
// =========================


export const resetPassword = asyncHandler(async (req, res) => {
    const {
        token,
        newPassword
    } = req.body;

    // Check required fields
    if (!token || !newPassword) {
        throw new AppError(
            "Reset token and new password are required",
            400
        )
    }

    // Basic password validation
    if (newPassword.length < 8) {
        throw new AppError(
            "Password must be at least 8 characters",
            400
        )
    }

    // Verify temporary reset JWT
    const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
    );

    // Make sure this token is for password reset
    if (
        decoded.purpose !==
        "password-reset"
    ) {
        throw new AppError(
            "Invalid reset token",
            401
        )
    }

    // Find user
    const user = await User.findById(
        decoded.userId
    );

    if (!user) {
        throw new AppError(
           "User not found",
            404
        )
    }

    // Hash new password
    const hashedPassword =
        await bcrypt.hash(
            newPassword,
            12
        );

    // Update password
    user.password = hashedPassword;

    // Clear OTP/reset data
    user.resetOtpHash = null;
    user.resetOtpExpiry = null;

    await user.save();

    return res.status(200).json({
        success: true,
        message:
            "Password reset successfully"
    });
});