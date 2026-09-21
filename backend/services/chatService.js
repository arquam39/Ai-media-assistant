import Conversation from "../models/conversation.js";
import Message from "../models/message.js";
import {
    searchUserLibrary
} from "./vectorSearchService.js";

import { generateAIResponse } from "./aiService.js";



// =========================
// Send Message
// =========================

export const sendMessage = async ({
    conversationId,
    userId,
    content
}) => {

    // =========================
    // 1. Verify Conversation
    // =========================

    const conversation =
        await Conversation.findOne({
            _id: conversationId,
            userId
        });

    if (!conversation) {
        throw new Error(
            "Conversation not found"
        );
    }

    // =========================
    // 2. Save User Message
    // =========================

    const userMessage =
        await Message.create({

            conversationId,

            userId,

            role: "user",

            content
        });


    // =========================
    // 3. Get Conversation History
    // =========================

    const messages =
        await Message.find({
            conversationId,
            userId
        })
            .sort({
                createdAt: -1
            })
            .limit(20)
            .lean();

    messages.reverse();


    // =========================
    // 4. Search User Library
    // =========================

    const searchResults =
        await searchUserLibrary({
            userId,
            query: content,
            limit: 5
        });

    const relevantChunks =
        searchResults.filter(
            chunk => chunk.score >= 0.76
        );


    // =========================
    // 5. Generate AI Response
    // =========================

    const aiResponse =
        await generateAIResponse({

            messages,

            context:
                relevantChunks
        });


    // =========================
    // 6. Prepare Sources
    // =========================

    const sources = Array.from(
        new Map(
            relevantChunks.map((chunk) => {

                const mediaId =
                    chunk.mediaId?._id ||
                    chunk.mediaId;

                return [
                    String(mediaId),
                    {
                        mediaId,

                        fileName:
                            chunk.mediaId
                                ?.originalName ||
                            "Unknown file",

                        mimeType:
                            chunk.mediaId
                                ?.mimeType ||
                            null,

                        url:
                            chunk.mediaId
                                ?.url ||
                            null,

                        score:
                            Number(
                                chunk.score.toFixed(3)
                            )
                    }
                ];
            })
        ).values()
    );

    // =========================
    // 7. Save AI Message
    // =========================

    const assistantMessage =
        await Message.create({

            conversationId,

            userId,

            role: "assistant",

            content:
                aiResponse.content,

            sources
        });

    // =========================
    // 7. Update Conversation
    // =========================

    conversation.lastMessage = {

        text:
            aiResponse.content,

        role: "assistant",

        createdAt:
            new Date()
    };

    await conversation.save();



    // console.log(sources)
    // =========================
    // 9. Return
    // =========================

    return {

        userMessage,

        assistantMessage,

        sources
    };
};


export const getMessages = async ({
    userId,
    conversationId
}) => {

    // =========================
    // 1. Verify conversation
    // =========================

    const conversation =
        await Conversation.findOne({
            _id: conversationId,
            userId
        });

    if (!conversation) {
        throw new Error(
            "Conversation not found"
        );
    }


    // =========================
    // 2. Get messages
    // =========================

    const messages =
        await Message.find({
            conversationId,
            userId
        }).sort({
            createdAt: 1
        });

    return messages;
};