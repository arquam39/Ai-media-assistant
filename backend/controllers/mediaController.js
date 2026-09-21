import fs from "fs";
import path from "path";

import Media from "../models/media.js";
import cloudinary from "../config/cloudinary.js";
import {
    getMediaType
} from "../services/mediaService.js";
import {
    processMediaInBackground
} from "../services/aiProcessingService.js";
import {
    processMediaForAI
} from "../services/documentProcessingService.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../middleware/asyncHandler.js";
import DocumentChunk from "../models/DocumentChunk.js";
import {
    uploadMediaToCloudinary
} from "../services/cloudinaryService.js";


// =========================
// Upload
// =========================

export const uploadMedia = asyncHandler(async (req, res) => {

    if (!req.file) {
        throw new AppError(
            "Please select a file",
            400
        );
    }


    // =========================
    // Validate File
    // =========================

    const isPdf =
        req.file.mimetype ===
        "application/pdf";

    const isImage =
        req.file.mimetype.startsWith(
            "image/"
        );


    if (!isPdf && !isImage) {
        throw new AppError(
            "Only PDF and image files are supported",
            400
        );
    }


    // =========================
    // 1. Upload to Cloudinary
    // =========================

    const cloudinaryResult =
        await uploadMediaToCloudinary({
            buffer: req.file.buffer,
            originalName:
                req.file.originalname,
            mimeType:
                req.file.mimetype,
            userId:
                req.user.id
        });


    // =========================
    // 2. Create Media
    // =========================

    const media =
        await Media.create({

            userId:
                req.user.id,

            originalName:
                req.file.originalname,

            url:
                cloudinaryResult.secure_url,

            cloudinary: {

                publicId:
                    cloudinaryResult.public_id,

                resourceType:
                    cloudinaryResult.resource_type
            },

            type:
                getMediaType(
                    req.file.mimetype
                ),

            mimeType:
                req.file.mimetype,

            size:
                req.file.size,

            // File upload completed
            status:
                "completed",

            // AI hasn't started yet
            aiProcessing: {
                status:
                    "pending"
            }
        });


    console.log(
        "Media created:",
        media._id
    );


    // =========================
    // 3. Start AI Processing
    // =========================

    processMediaInBackground(
        media._id
    );


    // =========================
    // 4. Return Immediately
    // =========================

    return res.status(201).json({

        success: true,

        message:
            "File uploaded successfully. AI processing started.",

        data: media
    });

});

// =========================
// Get Media
// =========================

export const getMedia = asyncHandler(async (req, res) => {

    const {
        search,
        type,
        favorite,
        trash,
        sort = "newest",
        page = 1,
        limit = 20
    } = req.query;


    const filter = {
        userId: req.user.id
    };


    // Trash filter

    if (trash === "true") {
        filter.deletedAt = {
            $ne: null
        };
    } else {
        filter.deletedAt = null;
    }


    // Type filter

    if (
        type &&
        type !== "all"
    ) {
        filter.type = type;
    }


    // Favorite filter

    if (favorite === "true") {
        filter.isFavorite = true;
    }


    // Search

    if (search) {
        filter.originalName = {
            $regex: search,
            $options: "i"
        };
    }


    const pageNumber = Math.max(
        Number(page),
        1
    );

    const limitNumber = Math.min(
        Math.max(Number(limit), 1),
        100
    );


    let sortOption = {
        createdAt: -1
    };


    if (sort === "oldest") {
        sortOption = {
            createdAt: 1
        };
    }


    if (sort === "largest") {
        sortOption = {
            size: -1
        };
    }


    if (sort === "name") {
        sortOption = {
            originalName: 1
        };
    }


    const skip =
        (pageNumber - 1) * limitNumber;


    const [media, total] =
        await Promise.all([

            Media.find(filter)
                .sort(sortOption)
                .skip(skip)
                .limit(limitNumber),

            Media.countDocuments(filter)
        ]);


    return res.status(200).json({
        success: true,

        data: media,

        pagination: {
            page: pageNumber,
            limit: limitNumber,
            total,
            pages: Math.ceil(
                total / limitNumber
            )
        }
    });
});

// =========================
// Get Trash
// =========================

export const getTrash = asyncHandler(async (req, res) => {

    const media = await Media.find({
        userId: req.user.id,
        deletedAt: { $ne: null }
    }).sort({
        deletedAt: -1
    });

    return res.status(200).json({
        success: true,
        data: media
    });

});

// =========================
// Get Single Media
// =========================

export const getSingleMedia = asyncHandler(async (req, res) => {

    const media = await Media.findOne({
        _id: req.params.id,
        userId: req.user.id,
        deletedAt: null
    });


    if (!media) {
        throw new AppError(
            "Media not found",
            404
        )
    }


    media.lastViewedAt = new Date();

    await media.save();


    return res.status(200).json({
        success: true,
        data: media
    });
});


// =========================
// Rename
// =========================

export const renameMedia = asyncHandler(async (req, res) => {

    const {
        name
    } = req.body;


    if (
        !name ||
        typeof name !== "string"
    ) {
        throw new AppError(
            "A valid file n,ame is required",
            400
        )
    }


    const media = await Media.findOne({
        _id: req.params.id,
        userId: req.user.id,
        deletedAt: null
    });


    if (!media) {
        throw new AppError(
            "Media not found",
            404
        )
    }


    media.originalName = name.trim();

    await media.save();


    return res.status(200).json({
        success: true,
        message: "Media renamed successfully",
        data: media
    });

});


// =========================
// Favorite
// =========================

export const toggleFavorite = asyncHandler(async (req, res) => {

    const media = await Media.findOne({
        _id: req.params.id,
        userId: req.user.id,
        deletedAt: null
    });


    if (!media) {
        throw new AppError(
            "Media not found",
            404
        )
    }


    media.isFavorite = !media.isFavorite;

    await media.save();


    return res.status(200).json({
        success: true,
        message: media.isFavorite
            ? "Added to favorites"
            : "Removed from favorites",
        data: media
    });
});


// =========================
// Trash
// =========================

export const moveToTrash = asyncHandler(async (req, res) => {

    const media = await Media.findOne({
        _id: req.params.id,
        userId: req.user.id,
        deletedAt: null
    });


    if (!media) {
        throw new AppError(
            "Media not found",
            404
        )
    }


    media.deletedAt = new Date();

    media.status = "deleted";

    await media.save();


    return res.status(200).json({
        success: true,
        message: "Media moved to trash",
        data: media
    });

});


// =========================
// Restore
// =========================

export const restoreMedia = asyncHandler(async (req, res) => {

    const media = await Media.findOne({
        _id: req.params.id,
        userId: req.user.id
    });


    if (!media) {
        throw new AppError(
            "Media not found",
            404
        )
    }


    media.deletedAt = null;

    media.status = "completed";

    await media.save();


    return res.status(200).json({
        success: true,
        message: "Media restored successfully",
        data: media
    });
});

// =========================
// Permanent Delete
// =========================

export const permanentlyDeleteMedia = asyncHandler(async (req, res) => {

    const media = await Media.findOne({
        _id: req.params.id,
        userId: req.user.id,
        deletedAt: { $ne: null }
    });


    if (!media) {
        throw new AppError(
            "Media not found",
            404
        )
    }


    // =========================
    // 1. Destroy media file
    // =========================

    await cloudinary.uploader.destroy(
        media.cloudinary.publicId,
        {
            resource_type:
                media.cloudinary.resourceType
        }
    );


    // =========================
    // 2. Delete AI chunks
    // =========================

    await DocumentChunk.deleteMany({
        mediaId: media._id,
        userId: req.user.id
    });


    // =========================
    // 3. Delete Media document
    // =========================

    await Media.deleteOne({
        _id: media._id
    });


    return res.status(200).json({
        success: true,
        message: "Media permanently deleted"
    });

});