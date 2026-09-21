import Media from "../models/media.js";

import {
    processMediaForAI
} from "./documentProcessingService.js";


// =========================
// Process Media in Background
// =========================

export const processMediaInBackground = async (
    mediaId
) => {

    try {

        // =========================
        // 1. Get Media
        // =========================

        const media =
            await Media
                .findById(mediaId)
                .select(
                    "+gemini_info.geminiFileName " +
                    "+gemini_info.geminiFileUri " +
                    "+gemini_info.geminiFileMimeType " +
                    "+gemini_info.geminiFileUploadedAt"
                );


        if (!media) {

            console.log(
                "Media not found:",
                mediaId
            );

            return;
        }


        // =========================
        // 2. Mark AI Processing
        // =========================

        media.aiProcessing.status =
            "processing";

        media.aiProcessing.error =
            null;

        await media.save();


        console.log(
            "AI processing started:",
            mediaId
        );


        // =========================
        // 3. Process Media
        // =========================

        await processMediaForAI(
            media
        );


        // =========================
        // 4. Mark Completed
        // =========================

        media.aiProcessing.status =
            "completed";

        media.aiProcessing.processedAt =
            new Date();

        media.aiProcessing.error =
            null;

        await media.save();


        console.log(
            "AI processing completed:",
            mediaId
        );

    } catch (error) {

        console.error(
            "Background AI processing failed:",
            error
        );


        // =========================
        // 5. Mark Failed
        // =========================

        try {

            await Media.findByIdAndUpdate(
                mediaId,
                {
                    "aiProcessing.status":
                        "failed",

                    "aiProcessing.error":
                        error.message,

                    "aiProcessing.processedAt":
                        null
                }
            );

        } catch (updateError) {

            console.error(
                "Failed to update AI status:",
                updateError
            );
        }
    }
};