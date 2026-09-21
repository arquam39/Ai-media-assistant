import asyncHandler from "../middleware/asyncHandler.js";

import {
    createApplication,
    getApplications,
    getApplicationById,
    reviewApplication,
    deleteApplication,
    reopenApplication
} from "../services/applicationService.js";

// =========================
// Submit Application
// =========================

export const submitApplication = asyncHandler(
    async (req, res) => {

        const {
            name,
            email,
            phone,
            address
        } = req.body;


        const application =
            await createApplication({

                name,
                email,
                phone,
                address,

                files:
                    req.files || {}
            });


        return res.status(201).json({

            success: true,

            message:
                "Application submitted successfully",

            application: {

                id:
                    application._id,

                status:
                    application.status,

                documents:
                    application.documents.length
            }
        });
    }
);

// =========================
// Get Applications
// =========================

export const getAllApplications =
    asyncHandler(
        async (req, res) => {

            const applications =
                await getApplications();

            return res.status(200).json({

                success: true,

                applications
            });
        }
    );

// =========================
// Get Single Application
// =========================

export const getSingleApplication =
    asyncHandler(
        async (req, res) => {

            const {
                id
            } = req.params;


            const result =
                await getApplicationById(
                    id
                );


            return res.status(200).json({

                success: true,

                application:
                    result.application,
            });
        }
    );

// =========================
// Review Application
// =========================

export const reviewApplicationController =
    asyncHandler(
        async (req, res) => {

            const {
                id
            } = req.params;

            const {
                decision,
                internalNote,
                applicantMessage
            } = req.body;


            const application =
                await reviewApplication({

                    applicationId:
                        id,

                    decision,

                    internalNote,

                    applicantMessage,

                    reviewerId:
                        req.user._id
                });


            return res.status(200).json({

                success: true,

                message:
                    `Application ${decision.toLowerCase()} successfully`,

                application: {
                    id:
                        application._id,

                    status:
                        application.status,

                    review:
                        application.review
                }
            });
        }
    );


// =========================
// Reopen Application
// =========================

export const reopenApplicationController =
    asyncHandler(
        async (req, res) => {

            const {
                id
            } = req.params;


            const application =
                await reopenApplication({
                    applicationId:
                        id
                });


            return res.status(200).json({
                success: true,

                message:
                    "Application reopened successfully",

                application: {
                    id:
                        application._id,

                    status:
                        application.status
                }
            });
        }
    );

// =========================
// Delete Application
// =========================

export const deleteApplicationController =
    asyncHandler(
        async (req, res) => {

            const {
                id
            } = req.params;


            const result =
                await deleteApplication(
                    id
                );


            return res.status(200).json({

                success: true,

                message:
                    "Application deleted successfully",

                result
            });
        }
    );