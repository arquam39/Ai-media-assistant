import {
    createAsyncThunk,
    createSlice
} from "@reduxjs/toolkit";

import {
    loginUser,
    registerUser,
    logoutUser,
    refreshAccessToken,
    getCurrentUser,
    verifyRegistrationOtp,
} from "../../services/authService";


// =========================
// Login
// =========================

export const login = createAsyncThunk(
    "auth/login",

    async (credentials, { rejectWithValue }) => {
        try {
            const response =
                await loginUser(credentials);

            return response;

        } catch (error) {
            return rejectWithValue(
                error.message
            );
        }
    }
);


// =========================
// Register
// =========================

export const register = createAsyncThunk(
    "auth/register",

    async (userData, { rejectWithValue }) => {
        try {
            const response =
                await registerUser(userData);

            return response;

        } catch (error) {
            return rejectWithValue(
                error.message
            );
        }
    }
);

// =========================
// Verify Registration OTP
// =========================

export const verifyRegistration = createAsyncThunk(
    "auth/verifyRegistration",

    async (
        { email, otp },
        { rejectWithValue }
    ) => {
        try {
            const response =
                await verifyRegistrationOtp(
                    email,
                    otp
                );

            return response;

        } catch (error) {
            return rejectWithValue(
                error.message
            );
        }
    }
);

// =========================
// Logout
// =========================

export const logout = createAsyncThunk(
    "auth/logout",

    async (_, { rejectWithValue }) => {
        try {
            const response =
                await logoutUser();

            return response;

        } catch (error) {
            return rejectWithValue(
                error.message
            );
        }
    }
);


// =========================
// Refresh Access Token
// =========================

export const refreshToken = createAsyncThunk(
    "auth/refreshToken",

    async (_, { rejectWithValue }) => {
        try {
            const response =
                await refreshAccessToken();

            return response;

        } catch (error) {
            return rejectWithValue(
                error.message
            );
        }
    }
);


// =========================
// Check Authentication
// =========================

export const checkAuth = createAsyncThunk(
    "auth/checkAuth",

    async (_, { rejectWithValue }) => {
        try {
            const response =
                await getCurrentUser();

            return response;

        } catch (error) {
            return rejectWithValue(
                error.message
            );
        }
    }
);



// =========================
// Initial State
// =========================

const initialState = {
    user: null,

    loading: false,

    error: null,

    success: false,

    isAuthenticated: false,

    checkingAuth: true,

    refreshing: false,

    logoutLoading: false,

    resetToken: null
};


// =========================
// Slice
// =========================

const authSlice = createSlice({

    name: "auth",

    initialState,

    reducers: {

        // =========================
        // Clear Error
        // =========================

        clearAuthError: (state) => {
            state.error = null;
        },


        // =========================
        // Clear Success
        // =========================

        clearAuthSuccess: (state) => {
            state.success = false;
        },

        // =========================
        // Clear Auth
        // =========================

        clearAuth: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.error = null;
        }

    },


    extraReducers: (builder) => {

        builder

            // ==================================================
            // LOGIN
            // ==================================================

            .addCase(login.pending, (state) => {

                state.loading = true;
                state.error = null;
                state.success = false;

            })

            .addCase(login.fulfilled, (state, action) => {

                state.loading = false;
                state.success = true;

                state.user =
                    action.payload?.data ||
                    null;

                state.isAuthenticated = true;

                state.error = null;

            })

            .addCase(login.rejected, (state, action) => {

                state.loading = false;

                state.error =
                    action.payload ||
                    "Login failed";

                state.isAuthenticated = false;

            })


            // ==================================================
            // REGISTER
            // ==================================================

            .addCase(register.pending, (state) => {

                state.loading = true;
                state.error = null;
                state.success = false;

            })

            .addCase(register.fulfilled, (state) => {

                state.loading = false;
                state.success = true;
                state.error = null;

            })

            .addCase(register.rejected, (state, action) => {

                state.loading = false;

                state.error =
                    action.payload ||
                    "Registration failed";

            })


        // ==================================================
        // VERIFY REGISTRATION
        // ==================================================

        builder
            .addCase(
                verifyRegistration.pending,
                (state) => {

                    state.loading = true;
                    state.error = null;
                    state.success = false;

                }
            )

            .addCase(
                verifyRegistration.fulfilled,
                (state) => {

                    state.loading = false;
                    state.success = true;
                    state.error = null;

                }
            )

            .addCase(
                verifyRegistration.rejected,
                (state, action) => {

                    state.loading = false;

                    state.error =
                        action.payload ||
                        "Email verification failed";

                }
            )

            // ==================================================
            // LOGOUT
            // ==================================================

            .addCase(logout.pending, (state) => {

                state.logoutLoading = true;
                state.error = null;

            })

            .addCase(logout.fulfilled, (state) => {

                state.logoutLoading = false;

                state.user = null;

                state.isAuthenticated = false;

                state.success = false;

                state.error = null;

            })

            .addCase(logout.rejected, (state, action) => {

                state.logoutLoading = false;

                state.error =
                    action.payload ||
                    "Logout failed";

                // Even if the logout request fails,
                // remove the local authentication state.
                state.user = null;
                state.isAuthenticated = false;

            })


            // ==================================================
            // REFRESH TOKEN
            // ==================================================

            .addCase(refreshToken.pending, (state) => {

                state.refreshing = true;

            })

            .addCase(refreshToken.fulfilled, (state) => {

                state.refreshing = false;

                state.isAuthenticated = true;

            })

            .addCase(refreshToken.rejected, (state) => {

                state.refreshing = false;

                state.user = null;

                state.isAuthenticated = false;

            })


            // ==================================================
            // CHECK AUTH
            // ==================================================

            .addCase(checkAuth.pending, (state) => {

                state.checkingAuth = true;

            })

            .addCase(checkAuth.fulfilled, (state, action) => {

                state.checkingAuth = false;

                state.user =
                    action.payload?.data ||
                    null;

                state.isAuthenticated = true;

                state.error = null;

            })

            .addCase(checkAuth.rejected, (state) => {

                state.checkingAuth = false;

                state.user = null;

                state.isAuthenticated = false;

            })
    }

});


// =========================
// Actions
// =========================

export const {
    clearAuthError,
    clearAuthSuccess,
    clearAuth
} = authSlice.actions;


// =========================
// Reducer
// =========================

export default authSlice.reducer;