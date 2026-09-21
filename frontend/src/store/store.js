import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/authSlice";
import mediaReducer from "./slices/mediaSlice";
import conversationReducer from "./slices/conversationSlice";
import messageReducer from "./slices/messageSlice";
import applicationReducer
    from "../store/slices/applicationSlice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        media: mediaReducer,
        conversations: conversationReducer,
        messages: messageReducer,
        applications:applicationReducer
    },
});

export default store;