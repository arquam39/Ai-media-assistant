import { apiClient } from "./apiClient";

const API_URL = import.meta.env.VITE_API_URL/auth;

// =========================
// Helper
// =========================

const handleResponse = async (
    response,
    defaultMessage
) => {
    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || defaultMessage
        );
    }

    return data;
};


// =========================
// Login
// =========================

export const loginUser = async (credentials) => {
    const response = await fetch(
        `${API_URL}/login`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
            },

            credentials: "include",

            body: JSON.stringify(credentials),
        }
    );

    return handleResponse(
        response,
        "Login failed"
    );
};


// =========================
// Register
// =========================

export const registerUser = async (userData) => {
    const response = await fetch(
        `${API_URL}/register`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
            },

            credentials: "include",

            body: JSON.stringify(userData),
        }
    );

    return handleResponse(
        response,
        "Registration failed"
    );
};


// =========================
// Verify Registration OTP
// =========================

export const verifyRegistrationOtp = async (
    email,
    otp
) => {
    const response = await fetch(
        `${API_URL}/verify-registration`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
            },

            credentials: "include",

            body: JSON.stringify({
                email,
                otp,
            }),
        }
    );

    return handleResponse(
        response,
        "Email verification failed"
    );
};

// =========================
// Logout
// =========================

export const logoutUser = async () => {
    const response = await fetch(
        `${API_URL}/logout`,
        {
            method: "POST",

            credentials: "include",
        }
    );

    return handleResponse(
        response,
        "Logout failed"
    );
};


// =========================
// Refresh Access Token
// =========================

export const refreshAccessToken = async () => {
    const response = await fetch(
        `${API_URL}/refresh`,
        {
            method: "POST",

            credentials: "include",
        }
    );

    return handleResponse(
        response,
        "Unable to refresh access token"
    );
};


// =========================
// Get Current User
// =========================

export const getCurrentUser = async () => {
    const response = await apiClient(
        "/auth/me",
        {
            method: "GET",
        }
    );

    return handleResponse(
        response,
        "Unable to get current user"
    );
};


// =========================
// Forgot Password
// =========================

export const forgotPassword = async (email) => {
    const response = await fetch(
        `${API_URL}/forgot-password`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
            },

            credentials: "include",

            body: JSON.stringify({
                email,
            }),
        }
    );

    return handleResponse(
        response,
        "Unable to send OTP"
    );
};


// =========================
// Verify OTP
// =========================

export const verifyOtp = async (
    email,
    otp
) => {
    const response = await fetch(
        `${API_URL}/verify-otp`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
            },

            credentials: "include",

            body: JSON.stringify({
                email,
                otp,
            }),
        }
    );

    return handleResponse(
        response,
        "OTP verification failed"
    );
};


// =========================
// Reset Password
// =========================

export const resetPassword = async (
    token,
    newPassword
) => {
    const response = await fetch(
        `${API_URL}/reset-password`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
            },

            credentials: "include",

            body: JSON.stringify({
                token,
                newPassword,
            }),
        }
    );

    return handleResponse(
        response,
        "Password reset failed"
    );
};

