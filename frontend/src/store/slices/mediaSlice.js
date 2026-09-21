import {
    createAsyncThunk,
    createSlice,
} from "@reduxjs/toolkit";

import {
    getMedia,
    uploadMedia as uploadMediaRequest,
    renameMedia as renameMediaRequest,
    toggleFavorite as toggleFavoriteRequest,
    moveToTrash as moveToTrashRequest,
    getSingleMedia,
    getTrash,
    restoreMedia as restoreMediaRequest,
    permanentlyDeleteMedia as permanentlyDeleteMediaRequest,
} from "../../services/mediaService";


// ==================================================
// Fetch Media
// ==================================================

export const fetchMedia = createAsyncThunk(
    "media/fetchMedia",

    async (_, { rejectWithValue }) => {

        try {

            const data = await getMedia();

            return data.data;

        } catch (error) {

            return rejectWithValue(
                error.message
            );
        }
    }
);

// ==================================================
// Fetch Trash
// ==================================================

export const fetchTrash = createAsyncThunk(
    "media/fetchTrash",

    async (_, { rejectWithValue }) => {
        try {
            const data = await getTrash();

            return data.data;

        } catch (error) {
            return rejectWithValue(
                error.message
            );
        }
    }
);

// ==================================================
// Upload Media
// ==================================================

export const uploadMedia = createAsyncThunk(
    "media/uploadMedia",

    async (
        file,
        { dispatch, rejectWithValue }
    ) => {

        try {

            const data =
                await uploadMediaRequest(file);

            const media =
                data.data;

            // Start monitoring AI processing
            dispatch(
                pollMediaProcessing(
                    media._id
                )
            );

            return media;

        } catch (error) {

            return rejectWithValue(
                error.message
            );
        }
    }
);


// ==================================================
// Rename Media
// ==================================================

export const renameMedia = createAsyncThunk(
    "media/renameMedia",

    async (
        { mediaId, originalName },
        { rejectWithValue }
    ) => {
        try {
            const data = await renameMediaRequest(
                mediaId,
                originalName
            );

            return data.data;

        } catch (error) {
            return rejectWithValue(
                error.message
            );
        }
    }
);


// ==================================================
// Toggle Favorite
// ==================================================

export const toggleFavorite = createAsyncThunk(
    "media/toggleFavorite",

    async (
        mediaId,
        { rejectWithValue }
    ) => {

        try {

            const data =
                await toggleFavoriteRequest(
                    mediaId
                );

            return data.data;

        } catch (error) {

            return rejectWithValue(
                error.message
            );
        }
    }
);


// ==================================================
// Move To Trash
// ==================================================

export const moveToTrash = createAsyncThunk(
    "media/moveToTrash",

    async (
        mediaId,
        { rejectWithValue }
    ) => {

        try {

            const data =
                await moveToTrashRequest(
                    mediaId
                );

            return data.data;

        } catch (error) {

            return rejectWithValue(
                error.message
            );
        }
    }
);

export const fetchSingleMedia = createAsyncThunk(
    "media/fetchSingleMedia",
    async (mediaId, { rejectWithValue }) => {
        try {
            const data = await getSingleMedia(mediaId);

            return data.data;
        } catch (error) {
            return rejectWithValue(
                error.message
            );
        }
    }
);

// ==================================================
// Restore Media
// ==================================================

export const restoreMedia = createAsyncThunk(
    "media/restoreMedia",

    async (
        mediaId,
        { rejectWithValue }
    ) => {
        try {

            const data =
                await restoreMediaRequest(
                    mediaId
                );

            return data.data;

        } catch (error) {

            return rejectWithValue(
                error.message
            );
        }
    }
);


// ==================================================
// Permanently Delete Media
// ==================================================

export const permanentlyDeleteMedia = createAsyncThunk(
    "media/permanentlyDeleteMedia",

    async (
        mediaId,
        { rejectWithValue }
    ) => {
        try {

            const data =
                await permanentlyDeleteMediaRequest(
                    mediaId
                );

            return data.data;

        } catch (error) {

            return rejectWithValue(
                error.message
            );
        }
    }
);

// ==================================================
// Poll AI Processing Status
// ==================================================

export const pollMediaProcessing = createAsyncThunk(
    "media/pollMediaProcessing",

    async (
        mediaId,
        { dispatch, rejectWithValue }
    ) => {

        try {

            const maxAttempts = 40;
            let attempts = 0;

            const checkStatus = async () => {

                attempts++;

                const data =
                    await getSingleMedia(mediaId);

                const media =
                    data.data;

                // Update the media in Redux
                dispatch(
                    updateMediaItem(media)
                );

                const status =
                    media.aiProcessing?.status;

                // Stop polling when finished
                if (
                    status === "completed" ||
                    status === "failed"
                ) {
                    return;
                }

                // Stop after max attempts
                if (
                    attempts >= maxAttempts
                ) {
                    return;
                }

                // Wait 3 seconds
                await new Promise(
                    (resolve) =>
                        setTimeout(
                            resolve,
                            3000
                        )
                );

                return checkStatus();
            };

            await checkStatus();

        } catch (error) {

            return rejectWithValue(
                error.message
            );
        }
    }
);

// ==================================================
// Initial State
// ==================================================

const initialState = {

    // Normal media
    items: [],

    // Single media
    currentMedia: null,

    // Trash
    trashItems: [],
    trashLoading: false,
    trashError: null,

    // General loading
    loading: false,

    // Upload
    uploading: false,

    // Actions
    actionLoading: false,

    // Errors
    error: null,
    uploadError: null,
    actionError: null,
};


// ==================================================
// Media Slice
// ==================================================

const mediaSlice = createSlice({

    name: "media",

    initialState,

    reducers: {

        clearMediaError: (state) => {

            state.error = null;

        },

        clearUploadError: (state) => {

            state.uploadError = null;

        },

        clearActionError: (state) => {

            state.actionError = null;

        },
        updateMediaItem: (state, action) => {

            const updatedMedia =
                action.payload;

            const index =
                state.items.findIndex(
                    (item) =>
                        item._id ===
                        updatedMedia._id
                );

            if (index !== -1) {

                state.items[index] =
                    updatedMedia;
            }

            if (
                state.currentMedia?._id ===
                updatedMedia._id
            ) {

                state.currentMedia =
                    updatedMedia;
            }
        },

    },


    extraReducers: (builder) => {


        // ==================================================
        // FETCH TRASH
        // ==================================================

        builder

            .addCase(
                fetchTrash.pending,
                (state) => {

                    state.trashLoading = true;

                    state.trashError = null;

                }
            )

            .addCase(
                fetchTrash.fulfilled,
                (state, action) => {

                    state.trashLoading = false;

                    state.trashItems =
                        action.payload;

                }
            )

            .addCase(
                fetchTrash.rejected,
                (state, action) => {

                    state.trashLoading = false;

                    state.trashError =
                        action.payload;

                }
            );

        // ==================================================
        // FETCH
        // ==================================================

        builder

            .addCase(
                fetchMedia.pending,
                (state) => {

                    state.loading = true;

                    state.error = null;

                }
            )

            .addCase(
                fetchMedia.fulfilled,
                (state, action) => {

                    state.loading = false;

                    state.items =
                        action.payload;

                }
            )

            .addCase(
                fetchMedia.rejected,
                (state, action) => {

                    state.loading = false;

                    state.error =
                        action.payload;

                }
            );


        // ==================================================
        // UPLOAD
        // ==================================================

        builder

            .addCase(
                uploadMedia.pending,
                (state) => {

                    state.uploading = true;

                    state.uploadError = null;

                }
            )

            .addCase(
                uploadMedia.fulfilled,
                (state, action) => {

                    state.uploading = false;

                    state.uploadError = null;

                    state.items.unshift(
                        action.payload
                    );

                }
            )

            .addCase(
                uploadMedia.rejected,
                (state, action) => {

                    state.uploading = false;

                    state.uploadError =
                        action.payload;

                }
            );


        // ==================================================
        // RENAME
        // ==================================================
        builder
            .addCase(renameMedia.fulfilled, (state, action) => {
                state.actionLoading = false;
                state.actionError = null;

                const updatedMedia = action.payload;

                const index = state.items.findIndex(
                    (item) => item._id === updatedMedia._id
                );

                if (index !== -1) {
                    state.items[index] = updatedMedia;
                }

                const trashIndex = state.trashItems.findIndex(
                    (item) => item._id === updatedMedia._id
                );

                if (trashIndex !== -1) {
                    state.trashItems[trashIndex] = updatedMedia;
                }
            })

            .addCase(renameMedia.pending, (state) => {
                state.actionLoading = true;
                state.actionError = null;
            })

            .addCase(renameMedia.rejected, (state, action) => {
                state.actionLoading = false;
                state.actionError = action.payload;
            });
        // ==================================================
        // FAVORITE
        // ==================================================

        builder

            .addCase(
                toggleFavorite.pending,
                (state) => {

                    state.actionLoading = true;

                    state.actionError = null;

                }
            )

            .addCase(
                toggleFavorite.fulfilled,
                (state, action) => {

                    state.actionLoading = false;

                    const updatedMedia =
                        action.payload;

                    const index =
                        state.items.findIndex(
                            (item) =>
                                item._id ===
                                updatedMedia._id
                        );

                    if (index !== -1) {

                        state.items[index] =
                            updatedMedia;

                    }

                }
            )

            .addCase(
                toggleFavorite.rejected,
                (state, action) => {

                    state.actionLoading = false;

                    state.actionError =
                        action.payload;

                }
            );

        builder
            .addCase(fetchSingleMedia.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchSingleMedia.fulfilled, (state, action) => {
                state.loading = false;
                state.currentMedia = action.payload;
            })

            .addCase(fetchSingleMedia.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.payload ||
                    "Failed to fetch media";
            })


        builder

            .addCase(
                permanentlyDeleteMedia.pending,
                (state) => {

                    state.actionLoading = true;

                    state.actionError = null;
                }
            )

            .addCase(
                permanentlyDeleteMedia.fulfilled,
                (state, action) => {

                    state.actionLoading = false;

                    const deletedId =
                        action.meta.arg;

                    state.trashItems =
                        state.trashItems.filter(
                            (item) =>
                                item._id !== deletedId
                        );
                }
            )

            .addCase(
                permanentlyDeleteMedia.rejected,
                (state, action) => {

                    state.actionLoading = false;

                    state.actionError =
                        action.payload;
                }
            );

        builder

            .addCase(
                restoreMedia.fulfilled,
                (state, action) => {

                    const restoredMedia =
                        action.payload;

                    state.trashItems =
                        state.trashItems.filter(
                            (item) =>
                                item._id !==
                                restoredMedia._id
                        );

                    state.items.unshift(
                        restoredMedia
                    );
                }
            )
        // ==================================================
        // TRASH
        // ==================================================

        builder

            .addCase(
                moveToTrash.pending,
                (state) => {

                    state.actionLoading = true;

                    state.actionError = null;

                }
            )

            .addCase(
                moveToTrash.fulfilled,
                (state, action) => {

                    state.actionLoading = false;

                    const deletedMedia =
                        action.payload;

                    state.items =
                        state.items.filter(
                            (item) =>
                                item._id !==
                                deletedMedia._id
                        );

                    state.trashItems.unshift(
                        deletedMedia
                    );
                }
            )

            .addCase(
                moveToTrash.rejected,
                (state, action) => {

                    state.actionLoading = false;

                    state.actionError =
                        action.payload;

                }
            );

    },
});


export const {
    clearMediaError,
    clearUploadError,
    clearActionError,
    updateMediaItem
} = mediaSlice.actions;


export default mediaSlice.reducer;