import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        conversationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Conversation",
            required: true,
            index: true
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        role: {
            type: String,
            enum: ["user", "assistant"],
            required: true
        },

        content: {
            type: String,
            required: true,
            trim: true
        },

        // =========================
        // AI Sources
        // =========================

        sources: [
            {
                mediaId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Media"
                },

                fileName: {
                    type: String
                },

                mimeType: {
                    type: String
                },

                url: {
                    type: String
                },

                score: {
                    type: Number
                }
            }
        ]
    },
    {
        timestamps: true
    }
);

messageSchema.index({
    conversationId: 1,
    userId: 1,
    createdAt: 1
});

const Message = mongoose.model(
    "Message",
    messageSchema
);

export default Message;