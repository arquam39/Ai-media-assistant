import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
            index: true
        },

        applicationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Application",
            default: null,
            index: true
        },

        cloudinary: {
            publicId: {
                type: String,
                required: true
            },

            resourceType: {
                type: String,
                required: true
            }
        },

        originalName: {
            type: String,
            required: true
        },

        url: {
            type: String,
            required: true
        },

        type: {
            type: String,
            enum: [
                "image",
                "video",
                "document",
                "audio",
                "other"
            ],
            default: "other"
        },

        mimeType: {
            type: String,
            required: true
        },

        size: {
            type: Number,
            required: true
        },

        status: {
            type: String,
            enum: [
                "uploading",
                "processing",
                "completed",
                "failed",
                "deleted"
            ],
            default: "completed"
        },

        aiProcessing: {
            status: {
                type: String,
                enum: [
                    "pending",
                    "processing",
                    "completed",
                    "failed"
                ],
                default: "pending"
            },

            error: {
                type: String,
                default: null
            },

            processedAt: {
                type: Date,
                default: null
            }
        },

        isFavorite: {
            type: Boolean,
            default: false
        },

        deletedAt: {
            type: Date,
            default: null
        },

        lastViewedAt: {
            type: Date,
            default: null
        },

        gemini_info: {

            geminiFileName: {
                type: String,
                default: null,
                select: false
            },

            geminiFileUri: {
                type: String,
                default: null,
                select: false
            },

            geminiFileMimeType: {
                type: String,
                default: null,
                select: false
            },

            geminiFileUploadedAt: {
                type: Date,
                default: null,
                select: false
            }
        }
    },
    {
        timestamps: true
    }
);

mediaSchema.index({
    userId: 1,
    createdAt: -1
});

const Media = mongoose.model("Media", mediaSchema);

export default Media;