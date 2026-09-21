import fs from "fs/promises";
import path from "path";
import { getData } from "pdf-parse/worker";
import { PDFParse } from "pdf-parse";

PDFParse.setWorker(getData());
import os from "os";
import { randomUUID } from "crypto";

import { GoogleGenAI } from "@google/genai";
import cloudinary from "../config/cloudinary.js";
import DocumentChunk from "../models/DocumentChunk.js";

import {
    generateEmbedding,
    generateEmbeddings
} from "./embeddingService.js";

import {
    getOrUploadGeminiFile
} from "./mediaService.js";


const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});


// =========================
// Chunk Text
// =========================

const chunkText = (
    text,
    chunkSize = 1200,
    overlap = 200
) => {

    const cleanText =
        text
            .replace(/\s+/g, " ")
            .trim();

    if (!cleanText) {
        return [];
    }

    const chunks = [];

    let start = 0;

    while (start < cleanText.length) {

        const end =
            Math.min(
                start + chunkSize,
                cleanText.length
            );

        const chunk =
            cleanText.slice(
                start,
                end
            ).trim();

        if (chunk) {
            chunks.push(chunk);
        }

        if (end === cleanText.length) {
            break;
        }

        start =
            end - overlap;
    }

    return chunks;
};


const downloadMediaToTempFile = async (media) => {

    if (!media.url) {
        throw new Error(
            "Media URL is missing"
        );
    }

    const response =
        await fetch(media.url);

    if (!response.ok) {

        const errorText =
            await response.text();

        console.log(
            "Cloudinary response:",
            errorText
        );

        throw new Error(
            `Failed to download media: ${response.status}`
        );
    }

    const arrayBuffer =
        await response.arrayBuffer();

    const buffer =
        Buffer.from(arrayBuffer);

    const extension =
        path.extname(
            media.originalName
        ) || ".pdf";

    const tempFilePath =
        path.join(
            os.tmpdir(),
            `${randomUUID()}${extension}`
        );

    await fs.writeFile(
        tempFilePath,
        buffer
    );

    return tempFilePath;
};

// =========================
// Extract PDF Text
// =========================

const extractPdfText = async (media) => {

    const tempFilePath =
        await downloadMediaToTempFile(
            media
        );

    try {

        const buffer =
            await fs.readFile(
                tempFilePath
            );

        const { PDFParse } =
            await import("pdf-parse");

        const parser =
            new PDFParse({
                data: buffer
            });

        try {

            const result =
                await parser.getText();

            return result.text;

        } finally {

            await parser.destroy();

        }

    } finally {

        await fs.unlink(
            tempFilePath
        ).catch(() => { });

    }
};


// =========================
// Generate Image Description
// =========================

const generateImageText = async (
    media
) => {

    const geminiFile =
        await getOrUploadGeminiFile(
            media
        );

    const response =
        await ai.models.generateContent({

            model: process.env.GEMINI_MODEL,

            contents: [
                {
                    role: "user",

                    parts: [
                        {
                            text: `
Analyze this image for a personal AI library.

Extract all useful visible information,
including readable text, names, dates, numbers,
labels, headings, objects, diagrams, and important
visual details.

Create a detailed but factual text description.

Do not invent information that cannot be determined
from the image.
                            `
                        },

                        {
                            fileData: {
                                fileUri:
                                    geminiFile.uri,

                                mimeType:
                                    geminiFile.mimeType
                            }
                        }
                    ]
                }
            ]
        });

    if (!response.text) {
        throw new Error(
            "Unable to analyze image"
        );
    }

    return response.text.trim();
};


// =========================
// Delete Existing Chunks
// =========================

const deleteExistingChunks = async (
    mediaId
) => {

    await DocumentChunk.deleteMany({
        mediaId
    });
};


// =========================
// Process PDF
// =========================

export const processPdf = async (
    media
) => {

    const text =
        await extractPdfText(
            media
        );

    const chunks =
        chunkText(text);

    if (!chunks.length) {
        throw new Error(
            "No readable text found in PDF"
        );
    }


    // =========================
    // Delete old chunks
    // =========================

    const embeddings =
        await generateEmbeddings(
            chunks
        );

    await deleteExistingChunks(
        media._id
    );


    // =========================
    // Create documents
    // =========================

    const documents =
        chunks.map(
            (chunk, index) => ({

                mediaId:
                    media._id,

                userId:
                    media.userId,

                chunkIndex:
                    index,

                text:
                    chunk,

                pageNumber:
                    null,

                embedding:
                    embeddings[index]
            })
        );


    // =========================
    // Save chunks
    // =========================

    await DocumentChunk.insertMany(
        documents
    );


    return {
        chunksCreated:
            documents.length
    };
};


// =========================
// Process Image
// =========================

export const processImage = async (
    media
) => {

    const text =
        await generateImageText(
            media
        );

    const embedding =
        await generateEmbedding(
            text
        );


    // Delete old chunks
    await deleteExistingChunks(
        media._id
    );


    await DocumentChunk.create({

        mediaId:
            media._id,

        userId:
            media.userId,

        chunkIndex:
            0,

        text,

        pageNumber:
            null,

        embedding
    });


    return {
        chunksCreated: 1
    };
};


// =========================
// Process Media
// =========================

export const processMediaForAI = async (
    media
) => {

    let result;

    if (
        media.mimeType ===
        "application/pdf"
    ) {

        result =
            await processPdf(
                media
            );

    } else if (
        media.mimeType.startsWith(
            "image/"
        )
    ) {

        result =
            await processImage(
                media
            );

    } else {

        throw new Error(
            "This media type is not supported yet"
        );
    }

    return result;
};