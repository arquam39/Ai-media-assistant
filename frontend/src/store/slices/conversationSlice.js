import {
    createAsyncThunk,
    createSlice,
} from "@reduxjs/toolkit";

import {
    getConversations,
    getConversation as getConversationRequest,
    createConversation as createConversationRequest,
    deleteConversation as deleteConversationRequest,
} from "../../services/conversationservice.js";

const initialState = {
    items: [],
    activeConversation: null,
    loading: false,
    creating: false,
    deleting: false,
    error: null,
};


// =========================
// Fetch All Conversations
// =========================

export const fetchConversations =
    createAsyncThunk(
        "conversations/fetch",
        async (_, { rejectWithValue }) => {
            try {
                const data =
                    await getConversations();

                return data.data;

            } catch (error) {
                return rejectWithValue(
                    error.message
                );
            }
        }
    );


// =========================
// Get Single Conversation
// =========================

export const fetchConversation =
    createAsyncThunk(
        "conversations/fetchOne",
        async (id, { rejectWithValue }) => {
            try {
                const data =
                    await getConversationRequest(id);

                return data.data;

            } catch (error) {
                return rejectWithValue(
                    error.message
                );
            }
        }
    );


// =========================
// Create Conversation
// =========================

export const createConversation =
    createAsyncThunk(
        "conversations/create",
        async (
            conversation,
            { rejectWithValue }
        ) => {
            try {
                const data =
                    await createConversationRequest(
                        conversation
                    );

                return data.data;

            } catch (error) {
                return rejectWithValue(
                    error.message
                );
            }
        }
    );


// =========================
// Delete Conversation
// =========================

export const deleteConversation =
    createAsyncThunk(
        "conversations/delete",
        async (
            id,
            { rejectWithValue }
        ) => {
            try {
                await deleteConversationRequest(
                    id
                );

                return id;

            } catch (error) {
                return rejectWithValue(
                    error.message
                );
            }
        }
    );


const conversationSlice =
    createSlice({
        name: "conversations",

        initialState,

        reducers: {
            setActiveConversation: (
                state,
                action
            ) => {
                state.activeConversation =
                    action.payload;
            },

            clearActiveConversation: (
                state
            ) => {
                state.activeConversation =
                    null;
            },
        },

        extraReducers: (builder) => {
            builder

                // =========================
                // Fetch Conversations
                // =========================

                .addCase(
                    fetchConversations.pending,
                    (state) => {
                        state.loading = true;
                        state.error = null;
                    }
                )

                .addCase(
                    fetchConversations.fulfilled,
                    (state, action) => {
                        state.loading = false;

                        state.items =
                            action.payload;
                    }
                )

                .addCase(
                    fetchConversations.rejected,
                    (state, action) => {
                        state.loading = false;

                        state.error =
                            action.payload;
                    }
                )


                // =========================
                // Fetch Single Conversation
                // =========================

                .addCase(
                    fetchConversation.pending,
                    (state) => {
                        state.loading = true;
                        state.error = null;
                    }
                )

                .addCase(
                    fetchConversation.fulfilled,
                    (state, action) => {
                        state.loading = false;

                        state.activeConversation =
                            action.payload;
                    }
                )

                .addCase(
                    fetchConversation.rejected,
                    (state, action) => {
                        state.loading = false;

                        state.error =
                            action.payload;
                    }
                )


                // =========================
                // Create Conversation
                // =========================

                .addCase(
                    createConversation.pending,
                    (state) => {
                        state.creating = true;
                        state.error = null;
                    }
                )

                .addCase(
                    createConversation.fulfilled,
                    (state, action) => {
                        state.creating = false;

                        state.items.unshift(
                            action.payload
                        );

                        state.activeConversation =
                            action.payload;
                    }
                )

                .addCase(
                    createConversation.rejected,
                    (state, action) => {
                        state.creating = false;

                        state.error =
                            action.payload;
                    }
                )


                // =========================
                // Delete Conversation
                // =========================

                .addCase(
                    deleteConversation.fulfilled,
                    (state, action) => {
                        state.items =
                            state.items.filter(
                                (item) =>
                                    item._id !==
                                    action.payload
                            );

                        if (
                            state.activeConversation
                                ?._id ===
                            action.payload
                        ) {
                            state.activeConversation =
                                null;
                        }
                    }
                );
        },
    });


export const {
    setActiveConversation,
    clearActiveConversation,
} = conversationSlice.actions;


export default conversationSlice.reducer;