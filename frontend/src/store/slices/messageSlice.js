import {
    createAsyncThunk,
    createSlice,
} from "@reduxjs/toolkit";

import {
    getMessages,
    sendMessage as sendMessageRequest,
} from "../../services/messageService";

const initialState = {
    items: [],
    loading: false,
    sending: false,
    error: null,
};


// =========================
// Fetch Messages
// =========================

export const fetchMessages = createAsyncThunk(
    "messages/fetch",
    async (
        conversationId,
        { rejectWithValue }
    ) => {
        try {
            const data =
                await getMessages(
                    conversationId
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
// Send Message
// =========================

export const sendMessage = createAsyncThunk(
    "messages/send",
    async (
        {
            conversationId,
            content,
        },
        { rejectWithValue }
    ) => {
        try {
            const data =
                await sendMessageRequest(
                    conversationId,
                    content
                );

            return data.data;
        } catch (error) {
            return rejectWithValue(
                error.message
            );
        }
    }
);


const messageSlice = createSlice({
    name: "messages",

    initialState,

    reducers: {

        // =========================
        // Add Optimistic Message
        // =========================

        addMessage: (
            state,
            action
        ) => {
            state.items.push(
                action.payload
            );
        },


        // =========================
        // Clear Messages
        // =========================

        clearMessages: (state) => {
            state.items = [];
            state.error = null;
        },


        // =========================
        // Remove Optimistic Message
        // =========================

        removeMessage: (
            state,
            action
        ) => {
            state.items =
                state.items.filter(
                    (message) =>
                        message._id !==
                        action.payload
                );
        },
    },


    extraReducers: (builder) => {

        builder

            // =========================
            // Fetch Messages
            // =========================

            .addCase(
                fetchMessages.pending,
                (state) => {
                    state.loading = true;
                    state.error = null;

                    // Prevent old conversation
                    // messages from flashing
                    state.items = [];
                }
            )

            .addCase(
                fetchMessages.fulfilled,
                (
                    state,
                    action
                ) => {
                    state.loading = false;
                    state.items =
                        action.payload;
                }
            )

            .addCase(
                fetchMessages.rejected,
                (
                    state,
                    action
                ) => {
                    state.loading = false;
                    state.error =
                        action.payload;
                }
            )


            // =========================
            // Send Message
            // =========================

            .addCase(
                sendMessage.pending,
                (state) => {
                    state.sending = true;
                    state.error = null;
                }
            )

            .addCase(
                sendMessage.fulfilled,
                (
                    state,
                    action
                ) => {
                    state.sending = false;

                    const {
                        assistantMessage,
                        sources,
                    } = action.payload;

                    // User message was already
                    // added optimistically.
                    if (assistantMessage) {
                        state.items.push({
                            ...assistantMessage,
                            sources: sources || [],
                        });
                    }
                }
            )
            .addCase(
                sendMessage.rejected,
                (
                    state,
                    action
                ) => {
                    state.sending = false;
                    state.error =
                        action.payload;
                }
            );
    },
});


export const {
    addMessage,
    clearMessages,
    removeMessage,
} = messageSlice.actions;


export default messageSlice.reducer;



