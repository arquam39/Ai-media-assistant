import { messageSchema } from "../utils/validators.js";
import {
    sendMessage,
    getMessages
} from "../services/chatService.js";

import AppError from "../utils/AppError.js";
import asyncHandler from "../middleware/asyncHandler.js";

export const createMessage = asyncHandler(async (req, res) => {

    const data = messageSchema.parse(req.body);

    const result = await sendMessage({
        userId: req.user.id,
        conversationId: data.conversationId,
        content: data.content
    });

    return res.status(201).json({
        success: true,
        data: result
    });
});


export const fetchMessages = asyncHandler(async (req, res) => {

    const messages = await getMessages({
        userId: req.user.id,
        conversationId: req.params.conversationId
    });

    return res.status(200).json({
        success: true,
        data: messages
    });

});