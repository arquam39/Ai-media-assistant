import mongoose from "mongoose";
import DocumentChunk from "../models/DocumentChunk.js";

import {
    generateEmbedding
} from "./embeddingService.js";


// =========================
// Search User Library
// =========================

export const searchUserLibrary = async ({
    userId,
    query,
    limit = 5
}) => {

    // =========================
    // Generate Query Embedding
    // =========================

    const queryEmbedding =
        await generateEmbedding(
            query
        );


    // =========================
    // MongoDB Vector Search
    // =========================
    console.log(
        "SEARCH USER ID:",
        userId
    );

    const chunkCount =
        await DocumentChunk.countDocuments({
            userId
        });

    console.log(
        "USER CHUNK COUNT:",
        chunkCount
    );

    const results =
        await DocumentChunk.aggregate([

            {
                $vectorSearch: {

                    index: "vector_index",

                    path: "embedding",

                    queryVector:
                        queryEmbedding,

                    numCandidates: 100,

                    limit: limit,

                    filter: {
                        userId: new mongoose.Types.ObjectId(userId)
                    }
                }
            },


            // =========================
            // Get Similarity Score
            // =========================

            {
                $set: {
                    score: {
                        $meta:
                            "vectorSearchScore"
                    }
                }
            },


            // =========================
            // Get Media Information
            // =========================

            {
                $lookup: {
                    from: "media",

                    localField: "mediaId",

                    foreignField: "_id",

                    as: "media"
                }
            },


            {
                $unwind: {
                    path: "$media",

                    preserveNullAndEmptyArrays: true
                }
            },


            // =========================
            // Return Required Fields
            // =========================

            {
                $project: {

                    _id: 1,

                    mediaId: {
                        _id: "$media._id",

                        originalName:
                            "$media.originalName",

                        mimeType:
                            "$media.mimeType",

                        url:
                            "$media.url"
                    },

                    chunkIndex: 1,

                    text: 1,

                    pageNumber: 1,

                    score: 1
                }
            }
        ]);


    // =========================
    // Debug Results
    // =========================

    console.log(
        results.map((chunk) => ({

            file:
                chunk.mediaId?.originalName,

            score:
                Number(
                    chunk.score.toFixed(3)
                )
        }))
    );


    return results;
};