import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        mediaId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Media",
            default: null
        },

        title: {
            type: String,
            trim: true,
            maxlength: 100,
            default: "New Conversation"
        },

        lastMessage: {
            text: {
                type: String,
                default: ""
            },

            role: {
                type: String,
                enum: ["user", "assistant"],
                default: "user"
            },

            createdAt: {
                type: Date,
                default: null
            }
        }
    },
    {
        timestamps: true
    }
);


// =========================
// Indexes
// =========================

// Conversation list sorting
conversationSchema.index({
    userId: 1,
    updatedAt: -1
});


// One media can have only one conversation
// per user.
//
// This is a partial index because mediaId
// can be null for normal conversations.
conversationSchema.index(
    {
        userId: 1,
        mediaId: 1
    },
    {
        unique: true,
        partialFilterExpression: {
            mediaId: {
                $type: "objectId"
            }
        }
    }
);


const Conversation = mongoose.model(
    "Conversation",
    conversationSchema
);

export default Conversation;