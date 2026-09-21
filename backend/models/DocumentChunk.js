import mongoose from "mongoose";

const documentChunkSchema = new mongoose.Schema(
    {
        mediaId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Media",
            required: true,
            index: true
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        chunkIndex: {
            type: Number,
            required: true
        },

        text: {
            type: String,
            required: true,
            trim: true
        },

        pageNumber: {
            type: Number,
            default: null
        },

        embedding: {
            type: [Number],
            required: true
        }
    },
    {
        timestamps: true
    }
);

documentChunkSchema.index({
    userId: 1,
    mediaId: 1
});

const DocumentChunk = mongoose.model(
    "DocumentChunk",
    documentChunkSchema
);

export default DocumentChunk;