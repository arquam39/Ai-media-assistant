import Application from "../models/application.js";
import Media from "../models/media.js";

import {
    uploadMediaToCloudinary,
    deleteMediaFromCloudinary
} from "./cloudinaryService.js";

import {
    getMediaType
} from "./mediaService.js";

import AppError from "../utils/AppError.js";

import {
    updateApplicationDeal,
    deleteDeal,
    deleteContact
} from "./hubspotService.js";

import {
    processApplicationWithAI
} from "./applicationAIService.js";

// =========================
// Create Application
// =========================

export const createApplication = async ({
    name,
    email,
    phone,
    address,
    files
}) => {

    // =========================
    // Create Application
    // =========================

    const application =
        await Application.create({

            applicant: {
                name,
                email,
                phone,
                address
            },

            status:
                "SUBMITTED"
        });

    try {

        // =========================
        // Prepare Documents
        // =========================

        const documentFiles = [];

        if (files?.cnic?.[0]) {

            documentFiles.push({
                file:
                    files.cnic[0],

                documentType:
                    "cnic"
            });
        }

        if (files?.salarySlip?.[0]) {

            documentFiles.push({
                file:
                    files.salarySlip[0],

                documentType:
                    "salary_slip"
            });
        }

        if (files?.bankStatement?.[0]) {

            documentFiles.push({
                file:
                    files.bankStatement[0],

                documentType:
                    "bank_statement"
            });
        }

        if (files?.employmentLetter?.[0]) {

            documentFiles.push({
                file:
                    files.employmentLetter[0],

                documentType:
                    "employment_letter"
            });
        }


        // =========================
        // Validate Documents
        // =========================

        if (!documentFiles.length) {

            throw new AppError(
                "Please upload at least one document",
                400
            );
        }


        // =========================
        // Upload Documents
        // =========================

        const documents = [];

        for (
            const document
            of documentFiles
        ) {

            const {
                file,
                documentType
            } = document;


            // =========================
            // Upload To Cloudinary
            // =========================

            const cloudinaryResult =
                await uploadMediaToCloudinary({

                    buffer:
                        file.buffer,

                    originalName:
                        file.originalname,

                    mimeType:
                        file.mimetype,

                    applicationId:
                        application._id
                });


            // =========================
            // Create Media Record
            // =========================

            const media =
                await Media.create({

                    userId:
                        null,

                    applicationId:
                        application._id,

                    originalName:
                        file.originalname,

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
                            file.mimetype
                        ),

                    mimeType:
                        file.mimetype,

                    size:
                        file.size,

                    status:
                        "completed",

                    aiProcessing: {

                        status:
                            "pending"
                    }
                });


            // =========================
            // Add Application Document
            // =========================

            documents.push({

                mediaId:
                    media._id,

                documentType
            });
        }


        // =========================
        // Attach Documents
        // =========================

        application.documents =
            documents;


        application.status =
            "PROCESSING";


        await application.save();


        // =========================
        // Start AI Processing
        // =========================

        processApplicationWithAI(
            application._id
        ).catch(error => {

            console.error(
                "Background application AI error:",
                error
            );

        });


        return application;

    } catch (error) {

        // =========================
        // Cleanup Application
        // =========================

        await Application.deleteOne({
            _id:
                application._id
        });

        throw error;
    }
};

// =========================
// Get Applications
// =========================

export const getApplications = async () => {

    const applications =
        await Application.find()
            .sort({
                createdAt: -1
            })
            .select(
                "applicant aiAnalysis.score aiAnalysis.recommendation status createdAt"
            );

    return applications;
};

// =========================
// Get Single Application
// =========================

export const getApplicationById = async (
    applicationId
) => {

    const application =
        await Application.findById(
            applicationId
        ).populate({
            path: "documents.mediaId",
            model: "Media",
            select:
                "originalName url type mimeType size createdAt"
        });


    if (!application) {

        throw new AppError(
            "Application not found",
            404
        );
    }


    return {
        application
    };
};

// =========================
// Review Application
// =========================

export const reviewApplication = async ({
    applicationId,
    decision,
    internalNote,
    applicantMessage,
    reviewerId
}) => {

    // =========================
    // Find Application
    // =========================

    const application =
        await Application.findById(
            applicationId
        );

    if (!application) {

        throw new AppError(
            "Application not found",
            404
        );
    }


    // =========================
    // Validate Decision
    // =========================

    const validDecisions = [
        "APPROVED",
        "REJECTED"
    ];

    if (
        !validDecisions.includes(
            decision
        )
    ) {

        throw new AppError(
            "Invalid review decision",
            400
        );
    }


    // =========================
    // Validate Reviewable State
    // =========================

    const reviewableStatuses = [
        "SUBMITTED",
        "PENDING_DOCUMENTS",
        "PENDING_REVIEW"
    ];

    if (
        !reviewableStatuses.includes(
            application.status
        )
    ) {

        throw new AppError(
            `This application cannot be reviewed while it is ${application.status
                .toLowerCase()
                .replace("_", " ")}`
            ,
            400
        );
    }


    // =========================
    // Validate Rejection Message
    // =========================

    if (
        decision === "REJECTED" &&
        !applicantMessage?.trim()
    ) {

        throw new AppError(
            "Applicant message is required when rejecting an application",
            400
        );
    }


    // =========================
    // Update Application
    // =========================

    application.status =
        decision;

    application.review = {

        decision,

        internalNote:
            internalNote?.trim() || "",

        applicantMessage:
            applicantMessage?.trim() || "",

        reviewedBy:
            reviewerId,

        reviewedAt:
            new Date()
    };


    await application.save();


    // =========================
    // Update HubSpot
    // =========================

    try {

        await updateApplicationDeal({
            application
        });

        console.log(
            "HubSpot deal updated:",
            application.hubspot.dealId
        );

    } catch (hubspotError) {

        console.error(
            "HubSpot deal update failed:",
            hubspotError
        );
    }


    return application;
};

// =========================
// Reopen Application
// =========================

export const reopenApplication = async ({
    applicationId
}) => {

    // =========================
    // Find Application
    // =========================

    const application =
        await Application.findById(
            applicationId
        );

    if (!application) {

        throw new AppError(
            "Application not found",
            404
        );
    }


    // =========================
    // Validate Final State
    // =========================

    const finalStatuses = [
        "APPROVED",
        "REJECTED"
    ];

    if (
        !finalStatuses.includes(
            application.status
        )
    ) {

        throw new AppError(
            "Only approved or rejected applications can be reopened",
            400
        );
    }


    // =========================
    // Move Back To Review
    // =========================

    application.status =
        "PENDING_REVIEW";


    await application.save();


    // =========================
    // Update HubSpot
    // =========================

    try {

        await updateApplicationDeal({
            application
        });

        console.log(
            "HubSpot deal reopened:",
            application.hubspot.dealId
        );

    } catch (hubspotError) {

        console.error(
            "HubSpot deal update failed:",
            hubspotError
        );
    }


    return application;
};



// ========================================
// Delete Application
// ========================================

export const deleteApplication = async (
    applicationId
) => {

    // =========================
    // 1. Find Application
    // =========================

    const application =
        await Application.findById(
            applicationId
        );

    if (!application) {

        throw new AppError(
            "Application not found",
            404
        );
    }


    // =========================
    // 2. Get Application Media
    // =========================

    const mediaFiles =
        await Media.find({
            applicationId:
                application._id
        });


    // =========================
    // 3. Delete HubSpot Deal
    // =========================

    if (application.hubspot?.dealId) {

        await deleteDeal(
            application.hubspot.dealId
        );
    }


    // =========================
    // 4. Delete HubSpot Contact
    // =========================

    if (
        application.hubspot?.contactId &&
        application.hubspot?.contactCreated
    ) {

        await deleteContact(
            application.hubspot.contactId
        );
    }


    // =========================
    // 5. Delete Cloudinary Files
    // =========================

    for (const media of mediaFiles) {

        await deleteMediaFromCloudinary({
            publicId:
                media.cloudinary.publicId,

            resourceType:
                media.cloudinary.resourceType
        });
    }


    // =========================
    // 6. Delete Media From MongoDB
    // =========================

    await Media.deleteMany({
        applicationId:
            application._id
    });


    // =========================
    // 7. Delete Application
    // =========================

    await Application.findByIdAndDelete(
        application._id
    );


    return {
        applicationId:
            application._id,

        deletedMedia:
            mediaFiles.length,

        hubspotDealDeleted:
            Boolean(
                application.hubspot?.dealId
            ),

        hubspotContactDeleted:
            Boolean(
                application.hubspot?.contactId &&
                application.hubspot?.contactCreated
            )
    };
};