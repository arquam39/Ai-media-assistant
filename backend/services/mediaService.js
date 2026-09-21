import { GoogleGenAI } from "@google/genai";
import path from "path";

import fs from "fs/promises";
import os from "os";
import { randomUUID } from "crypto";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});


// =========================
// Get Media Type
// =========================

export const getMediaType = (mimeType) => {

    if (
        mimeType.startsWith("image/")
    ) {
        return "image";
    }

    if (
        mimeType === "application/pdf"
    ) {
        return "document";
    }

    return "other";
};

// =========================
// Get or Upload Gemini File
// =========================

export const getOrUploadGeminiFile = async (media) => {

    if (!media) {
        return null;
    }


    // =========================
    // 1. Check cached Gemini file
    // =========================

    if (
        media.gemini_info?.geminiFileName &&
        media.gemini_info?.geminiFileUri &&
        media.gemini_info?.geminiFileMimeType
    ) {

        console.log(
            "Gemini file already exists:",
            media.gemini_info.geminiFileName
        );

        try {

            const existingFile =
                await ai.files.get({
                    name: media.gemini_info.geminiFileName
                });

            console.log(
                "Using existing Gemini file:",
                existingFile.name
            );

            return existingFile;

        } catch (error) {

            console.log(
                "Cached Gemini file is unavailable."
            );

            console.log(
                "Uploading media again..."
            );
        }
    }


    // =========================
    // 2. Download from Cloudinary
    // =========================

    console.log(
        "Downloading media from Cloudinary:"
    );

    console.log(media.url);


    const response =
        await fetch(media.url);


    if (!response.ok) {

        throw new Error(
            `Failed to download media from Cloudinary: ${response.status}`
        );
    }


    const arrayBuffer =
        await response.arrayBuffer();


    const buffer =
        Buffer.from(arrayBuffer);


    // =========================
    // 3. Create temporary file
    // =========================

    const extension =
        path.extname(media.originalName) || "";


    const tempFilePath =
        path.join(
            os.tmpdir(),
            `${randomUUID()}${extension}`
        );


    await fs.writeFile(
        tempFilePath,
        buffer
    );


    console.log(
        "Temporary file created:",
        tempFilePath
    );


    try {

        // =========================
        // 4. Upload to Gemini
        // =========================

        const geminiFile =
            await ai.files.upload({

                file: tempFilePath,

                config: {
                    mimeType: media.mimeType
                }

            });


        // =========================
        // 5. Save Gemini reference
        // =========================

        media.gemini_info.geminiFileName =
            geminiFile.name;

        media.gemini_info.geminiFileUri =
            geminiFile.uri;

        media.gemini_info.geminiFileMimeType =
            geminiFile.mimeType;

        media.gemini_info.geminiFileUploadedAt =
            new Date();


        await media.save();


        console.log(
            "Gemini file uploaded:",
            geminiFile.name
        );


        return geminiFile;

    } finally {

        // =========================
        // 6. Delete temporary file
        // =========================

        await fs.unlink(
            tempFilePath
        ).catch(() => {});

    }
};