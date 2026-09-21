import mongoose from "mongoose";

import Conversation from "../models/conversation.js";
import Media from "../models/media.js";
import Message from "../models/message.js";

import {
    conversationSchema
} from "../utils/validators.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../middleware/asyncHandler.js";

// =========================
// Create Conversation
// =========================

export const createConversation = asyncHandler(async (req, res) => {

    const data =
        conversationSchema.parse(req.body);

    let media = null;

    // =========================
    // Find Media
    // =========================

    if (data.mediaId) {

        if (
            !mongoose.Types.ObjectId.isValid(
                data.mediaId
            )
        ) {
            throw new AppError(
                "Invalid media ID",
                400
            )
        }

        media = await Media.findOne({
            _id: data.mediaId,
            userId: req.user.id,
            deletedAt: null
        });

        if (!media) {
            throw new AppError(
                "Media not found",
                404
            )
        }
    }


    // =========================
    // Check Existing Conversation
    // =========================

    if (media) {

        const existingConversation =
            await Conversation.findOne({
                userId: req.user.id,
                mediaId: media._id
            });

        if (existingConversation) {

            return res.status(200).json({
                success: true,
                message: "Existing conversation opened",
                data: existingConversation
            });
        }
    }


    // =========================
    // Create Conversation
    // =========================

    const conversation =
        await Conversation.create({

            userId: req.user.id,

            mediaId:
                media?._id || null,

            title:
                data.title ||
                "New Conversation"
        });


    return res.status(201).json({
        success: true,
        message: "Conversation created",
        data: conversation
    });
});


// =========================
// Get Conversations
// =========================

export const getConversations = asyncHandler(async (req, res) => {

    const conversations = await Conversation.find({
        userId: req.user.id
    })
        .populate(
            "mediaId",
            "originalName url type"
        )
        .sort({
            updatedAt: -1
        });

    return res.status(200).json({
        success: true,
        data: conversations
    });

});


// =========================
// Get Single Conversation
// =========================

export const getConversation = asyncHandler(async (req, res) => {

    const conversation =
        await Conversation.findOne({
            _id: req.params.id,
            userId: req.user.id
        }).populate(
            "mediaId",
            "originalName url type mimeType size"
        );


    if (!conversation) {
        throw new AppError(
            "Conversation not found",
            404
        )
    }

    return res.status(200).json({
        success: true,
        data: conversation
    });
});


// =========================
// Rename Conversation
// =========================

export const renameConversation = asyncHandler(async (req, res) => {

    const {
        title
    } = req.body;


    // =========================
    // Validate Title
    // =========================

    if (
        !title ||
        typeof title !== "string" ||
        !title.trim()
    ) {
        throw new AppError(
            "A valid title is required",
            400
        )
    }


    // =========================
    // Find Conversation
    // =========================

    const conversation =
        await Conversation.findOne({
            _id: req.params.id,
            userId: req.user.id
        });


    if (!conversation) {
        throw new AppError(
            "Conversation not found",
            404
        )
    }


    // =========================
    // Media Conversation
    // =========================

    if (conversation.mediaId) {
        throw new AppError(
            "Media conversations use the media name",
            400
        )
    }


    // =========================
    // Rename Normal Conversation
    // =========================

    conversation.title =
        title.trim();


    await conversation.save();


    return res.status(200).json({
        success: true,
        message: "Conversation renamed",
        data: conversation
    });
});

// =========================
// Delete Conversation
// =========================

export const deleteConversation = asyncHandler(async (req, res) => {

    const conversation =
        await Conversation.findOne({
            _id: req.params.id,
            userId: req.user.id
        });


    if (!conversation) {
        throw new AppError(
            "Conversation not found",
            404
        );
    }


    // =========================
    // Delete Messages
    // =========================

    await Message.deleteMany({
        conversationId: conversation._id,
        userId: req.user.id
    });


    // =========================
    // Delete Conversation
    // =========================

    await conversation.deleteOne();


    return res.status(200).json({

        success: true,

        message:
            "Conversation and messages deleted"

    });

});