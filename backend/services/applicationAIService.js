import { GoogleGenAI } from "@google/genai";

import Application from "../models/application.js";
import Media from "../models/media.js";

import {
    getOrUploadGeminiFile
} from "./mediaService.js";

import {
    syncApplicationToHubSpot
} from "./hubspotService.js";

const ai = new GoogleGenAI({
    apiKey:
        process.env.GEMINI_API_KEY
});

const analyzeApplicationDocuments = async (
    application,
    mediaFiles
) => {

    const documentParts = [];

    for (const media of mediaFiles) {

        const applicationDocument =
            application.documents.find(
                document =>
                    document.mediaId.toString() ===
                    media._id.toString()
            );

        const documentType =
            applicationDocument?.documentType ||
            "other";

        const geminiFile =
            await getOrUploadGeminiFile(
                media
            );

        documentParts.push({
            text: `
Document name: ${media.originalName}
Document type: ${documentType}
MIME type: ${media.mimeType}
`
        });

        documentParts.push({
            fileData: {
                fileUri:
                    geminiFile.uri,

                mimeType:
                    geminiFile.mimeType
            }
        });
    }


    // =========================
    // Prepare Documents
    // =========================

    for (const media of mediaFiles) {

        const geminiFile =
            await getOrUploadGeminiFile(
                media
            );


        documentParts.push({

            text: `
Document name:
${media.originalName}

Document MIME type:
${media.mimeType}
`
        });


        documentParts.push({

            fileData: {

                fileUri:
                    geminiFile.uri,

                mimeType:
                    geminiFile.mimeType
            }
        });
    }


    // =========================
    // Prompt
    // =========================

    const prompt = `
You are reviewing a leasing application.

The application is being reviewed for a rental/leasing decision.

Applicant information:

Name: ${application.applicant.name}
Email: ${application.applicant.email}
Phone: ${application.applicant.phone}
Address: ${application.applicant.address}

You have been given documents belonging to this applicant.

Each document includes a document type such as:

- cnic
- salary_slip
- bank_statement
- employment_letter

Analyze the documents carefully.

Your tasks:

1. Extract relevant information from the documents.
2. Check whether the extracted information is consistent with the applicant information.
3. Identify missing information.
4. Identify document quality or validity issues.
5. Identify potential risk flags.
6. Give a preliminary score from 0 to 100.
7. Give a preliminary recommendation.

IMPORTANT:

The recommendation is only a preliminary AI recommendation.
A human reviewer must make the final approval or rejection decision.

Do not invent information.

If information cannot be found, use null.

Return ONLY valid JSON.

Use exactly this structure:

{
    "extractedData": {
        "fullName": null,
        "cnic": null,
        "dateOfBirth": null,
        "employmentStatus": null,
        "employer": null,
        "monthlyIncome": null,
        "bankBalance": null,
        "address": null
    },

    "missingFields": [],

    "documentIssues": [],

    "riskFlags": [],

    "score": 0,

    "recommendation": "REVIEW",

    "summary": ""
}

The recommendation must be exactly one of:

LIKELY_APPROVE
REVIEW
LIKELY_REJECT
`;

    // =========================
    // Gemini
    // =========================

    const response =
        await ai.models.generateContent({

            model:
                process.env.GEMINI_MODEL,

            contents: [

                {
                    role:
                        "user",

                    parts: [

                        {
                            text:
                                prompt
                        },

                        ...documentParts
                    ]
                }
            ]
        });


    if (!response.text) {

        throw new Error(
            "Gemini did not return an analysis"
        );
    }


    return response.text.trim();
};


// =========================
// Parse Gemini JSON
// =========================

const parseGeminiJson = (text) => {

    try {

        const cleanedText =
            text
                .replace(
                    /^```json\s*/i,
                    ""
                )
                .replace(
                    /^```\s*/i,
                    ""
                )
                .replace(
                    /\s*```$/i,
                    ""
                )
                .trim();


        return JSON.parse(
            cleanedText
        );

    } catch (error) {

        console.error(
            "Gemini JSON:",
            text
        );

        throw new Error(
            "Gemini returned invalid JSON"
        );
    }
};

// =========================
// Validate AI Analysis
// =========================

const validateAIAnalysis = (
    analysis
) => {

    if (
        !analysis ||
        typeof analysis !== "object"
    ) {
        throw new Error(
            "Invalid AI analysis"
        );
    }


    if (
        typeof analysis.extractedData !==
        "object"
    ) {
        throw new Error(
            "Invalid extracted data"
        );
    }


    if (
        !Array.isArray(
            analysis.missingFields
        )
    ) {
        throw new Error(
            "Invalid missing fields"
        );
    }


    if (
        !Array.isArray(
            analysis.documentIssues
        )
    ) {
        throw new Error(
            "Invalid document issues"
        );
    }


    if (
        !Array.isArray(
            analysis.riskFlags
        )
    ) {
        throw new Error(
            "Invalid risk flags"
        );
    }


    if (
        typeof analysis.score !==
        "number"
    ) {
        throw new Error(
            "Invalid AI score"
        );
    }


    const validRecommendations = [
        "LIKELY_APPROVE",
        "REVIEW",
        "LIKELY_REJECT"
    ];


    if (
        !validRecommendations.includes(
            analysis.recommendation
        )
    ) {
        throw new Error(
            "Invalid AI recommendation"
        );
    }


    return true;
};

// =========================
// Process Application With AI
// =========================

export const processApplicationWithAI = async (
    applicationId
) => {

    const application =
        await Application.findById(
            applicationId
        );


    if (!application) {

        throw new Error(
            "Application not found"
        );
    }


    try {

        // =========================
        // Get Application Documents
        // =========================

        const mediaIds =
            application.documents.map(
                document =>
                    document.mediaId
            );


        const mediaFiles =
            await Media.find({

                _id: {
                    $in:
                        mediaIds
                },

                applicationId:
                    application._id
            });


        if (!mediaFiles.length) {

            throw new Error(
                "No application documents found"
            );
        }


        // =========================
        // Mark Documents Processing
        // =========================

        await Media.updateMany(

            {
                _id: {
                    $in:
                        mediaIds
                }
            },

            {
                $set: {
                    "aiProcessing.status":
                        "processing"
                }
            }
        );


        // =========================
        // Send Documents to Gemini
        // =========================

        const rawAnalysis =
            await analyzeApplicationDocuments(
                application,
                mediaFiles
            );


        // =========================
        // Parse Gemini JSON
        // =========================

        const analysis =
            parseGeminiJson(
                rawAnalysis
            );


        // =========================
        // Validate AI Result
        // =========================

        validateAIAnalysis(
            analysis
        );


        // =========================
        // Save AI Analysis
        // =========================

        application.aiAnalysis =
            analysis;


        // =========================
        // Determine Application Status
        // =========================

        const hasMissingInformation =
            analysis.missingFields?.length > 0 ||
            analysis.documentIssues?.length > 0;


        if (hasMissingInformation) {

            application.status =
                "PENDING_DOCUMENTS";

        } else {

            application.status =
                "PENDING_REVIEW";
        }


        await application.save();


        // =========================
        // Mark Documents Complete
        // =========================

        await Media.updateMany(

            {
                _id: {
                    $in:
                        mediaIds
                }
            },

            {
                $set: {

                    "aiProcessing.status":
                        "completed",

                    "aiProcessing.processedAt":
                        new Date()
                }
            }
        );


        // =========================
        // Sync With HubSpot
        // =========================

        try {

            await syncApplicationToHubSpot({
                application
            });


            console.log(
                "Application synced with HubSpot:",
                applicationId
            );

        } catch (hubspotError) {

            console.error(
                "HubSpot sync failed:",
                hubspotError
            );

        }


        // =========================
        // Complete
        // =========================

        console.log(
            "Application AI processing completed:",
            applicationId
        );


        return application;


    } catch (error) {

        console.error(
            "Application AI processing failed:",
            error
        );


        // =========================
        // Mark AI Processing Failed
        // =========================

        await Media.updateMany(

            {
                applicationId:
                    application._id
            },

            {
                $set: {

                    "aiProcessing.status":
                        "failed",

                    "aiProcessing.error":
                        error.message
                }
            }
        );


        // =========================
        // Keep Application Reviewable
        // =========================

        application.status =
            "PENDING_REVIEW";

        application.aiAnalysis.summary =
            "AI analysis could not be completed automatically.";


        await application.save();


        throw error;
    }
};