import {
    createAsyncThunk,
    createSlice
} from "@reduxjs/toolkit";

import {
    getApplications,
    getApplicationById,
    reviewApplication,
    deleteApplication,
    reopenApplication
} from "../../services/applicationService";


// =========================
// Get Applications
// =========================

export const fetchApplications =
    createAsyncThunk(
        "applications/fetchApplications",

        async (_, thunkAPI) => {
            try {

                const response =
                    await getApplications();

                return response;

            } catch (error) {

                return thunkAPI.rejectWithValue(
                    error.message ||
                    "Failed to load applications"
                );
            }
        }
    );


// =========================
// Get Single Application
// =========================

export const fetchApplicationById =
    createAsyncThunk(
        "applications/fetchApplicationById",

        async (
            applicationId,
            thunkAPI
        ) => {

            try {

                const response =
                    await getApplicationById(
                        applicationId
                    );

                return response;

            } catch (error) {

                return thunkAPI.rejectWithValue(
                    error.message ||
                    "Failed to load application"
                );
            }
        }
    );


// =========================
// Review Application
// =========================

export const submitApplicationReview =
    createAsyncThunk(
        "applications/submitApplicationReview",

        async (
            {
                applicationId,
                reviewData
            },
            thunkAPI
        ) => {

            try {

                const response =
                    await reviewApplication({
                        applicationId,
                        reviewData
                    });

                return response;

            } catch (error) {

                return thunkAPI.rejectWithValue(
                    error.message ||
                    "Failed to review application"
                );
            }
        }
    );


// =========================
// Reopen Application
// =========================

export const reopenApplicationThunk =
    createAsyncThunk(
        "applications/reopenApplication",

        async (
            applicationId,
            thunkAPI
        ) => {

            try {

                const response =
                    await reopenApplication(
                        applicationId
                    );

                return response;

            } catch (error) {

                return thunkAPI.rejectWithValue(
                    error.message ||
                    "Failed to reopen application"
                );
            }
        }
    );


// =========================
// Delete Application
// =========================

export const removeApplication =
    createAsyncThunk(
        "applications/removeApplication",

        async (
            applicationId,
            thunkAPI
        ) => {

            try {

                const response =
                    await deleteApplication(
                        applicationId
                    );

                return {
                    applicationId,
                    ...response
                };

            } catch (error) {

                return thunkAPI.rejectWithValue(
                    error.message ||
                    "Failed to delete application"
                );
            }
        }
    );


// =========================
// Initial State
// =========================

const initialState = {

    applications: [],

    currentApplication: null,


    loading: false,

    currentLoading: false,

    reviewLoading: false,

    reopenLoading: false,

    deleteLoading: false,


    error: null,

    currentError: null,

    reviewError: null,

    reopenError: null,

    deleteError: null
};


// =========================
// Slice
// =========================

const applicationSlice =
    createSlice({

        name: "applications",

        initialState,


        reducers: {

            clearApplicationError: (
                state
            ) => {

                state.error = null;

                state.currentError =
                    null;

                state.reviewError =
                    null;

                state.reopenError =
                    null;

                state.deleteError =
                    null;
            },


            clearCurrentApplication: (
                state
            ) => {

                state.currentApplication =
                    null;

                state.currentError =
                    null;
            }
        },


        extraReducers: (
            builder
        ) => {

            builder


                // =====================
                // Get Applications
                // =====================

                .addCase(
                    fetchApplications.pending,
                    (state) => {

                        state.loading =
                            true;

                        state.error =
                            null;
                    }
                )


                .addCase(
                    fetchApplications.fulfilled,
                    (
                        state,
                        action
                    ) => {

                        state.loading =
                            false;

                        state.applications =
                            action.payload
                                ?.applications ||
                            action.payload ||
                            [];
                    }
                )


                .addCase(
                    fetchApplications.rejected,
                    (
                        state,
                        action
                    ) => {

                        state.loading =
                            false;

                        state.error =
                            action.payload ||
                            "Failed to load applications";
                    }
                )


                // =====================
                // Get Single Application
                // =====================

                .addCase(
                    fetchApplicationById.pending,
                    (state) => {

                        state.currentLoading =
                            true;

                        state.currentError =
                            null;
                    }
                )


                .addCase(
                    fetchApplicationById.fulfilled,
                    (
                        state,
                        action
                    ) => {

                        state.currentLoading =
                            false;

                        state.currentApplication =
                            action.payload
                                ?.application ||
                            action.payload;
                    }
                )


                .addCase(
                    fetchApplicationById.rejected,
                    (
                        state,
                        action
                    ) => {

                        state.currentLoading =
                            false;

                        state.currentError =
                            action.payload ||
                            "Failed to load application";
                    }
                )


                // =====================
                // Review Application
                // =====================

                .addCase(
                    submitApplicationReview.pending,
                    (state) => {

                        state.reviewLoading =
                            true;

                        state.reviewError =
                            null;
                    }
                )


                .addCase(
                    submitApplicationReview.fulfilled,
                    (
                        state,
                        action
                    ) => {

                        state.reviewLoading =
                            false;

                        state.reviewError =
                            null;


                        const updatedApplication =
                            action.payload
                                ?.application ||
                            action.payload;


                        state.currentApplication =
                            updatedApplication;


                        const index =
                            state.applications.findIndex(
                                (
                                    application
                                ) =>
                                    application._id ===
                                    updatedApplication._id
                            );


                        if (
                            index !==
                            -1
                        ) {

                            state.applications[
                                index
                            ] =
                                updatedApplication;
                        }
                    }
                )


                .addCase(
                    submitApplicationReview.rejected,
                    (
                        state,
                        action
                    ) => {

                        state.reviewLoading =
                            false;

                        state.reviewError =
                            action.payload ||
                            "Failed to review application";
                    }
                )


                // =====================
                // Reopen Application
                // =====================

                .addCase(
                    reopenApplicationThunk.pending,
                    (state) => {

                        state.reopenLoading =
                            true;

                        state.reopenError =
                            null;
                    }
                )


                .addCase(
                    reopenApplicationThunk.fulfilled,
                    (
                        state,
                        action
                    ) => {

                        state.reopenLoading =
                            false;

                        state.reopenError =
                            null;


                        const updatedApplication =
                            action.payload
                                ?.application ||
                            action.payload;


                        // Update current application

                        state.currentApplication =
                            updatedApplication;


                        // Update application
                        // inside the list

                        const index =
                            state.applications.findIndex(
                                (
                                    application
                                ) =>
                                    application._id ===
                                    updatedApplication._id
                            );


                        if (
                            index !==
                            -1
                        ) {

                            state.applications[
                                index
                            ] =
                                updatedApplication;
                        }
                    }
                )


                .addCase(
                    reopenApplicationThunk.rejected,
                    (
                        state,
                        action
                    ) => {

                        state.reopenLoading =
                            false;

                        state.reopenError =
                            action.payload ||
                            "Failed to reopen application";
                    }
                )


                // =====================
                // Delete Application
                // =====================

                .addCase(
                    removeApplication.pending,
                    (state) => {

                        state.deleteLoading =
                            true;

                        state.deleteError =
                            null;
                    }
                )


                .addCase(
                    removeApplication.fulfilled,
                    (
                        state,
                        action
                    ) => {

                        state.deleteLoading =
                            false;

                        state.deleteError =
                            null;


                        const applicationId =
                            action.payload
                                .applicationId;


                        state.applications =
                            state.applications.filter(
                                application =>
                                    application._id !==
                                    applicationId
                            );


                        state.currentApplication =
                            null;
                    }
                )


                .addCase(
                    removeApplication.rejected,
                    (
                        state,
                        action
                    ) => {

                        state.deleteLoading =
                            false;

                        state.deleteError =
                            action.payload ||
                            "Failed to delete application";
                    }
                );
        }
    });


export const {
    clearApplicationError,
    clearCurrentApplication
} =
    applicationSlice.actions;


export default applicationSlice.reducer;
