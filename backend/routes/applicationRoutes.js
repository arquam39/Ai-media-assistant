import express from "express";

import applicationUpload from "../middleware/applicationUpload.js";
import {
    submitApplication,
    getAllApplications,
    getSingleApplication,
    reviewApplicationController,
    deleteApplicationController,
    reopenApplicationController
} from "../controllers/applicationController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router =
    express.Router();


// =========================
// Public Application
// =========================

router.post(
    "/",
    applicationUpload.fields([
        {
            name: "cnic",
            maxCount: 1
        },
        {
            name: "salarySlip",
            maxCount: 1
        },
        {
            name: "bankStatement",
            maxCount: 1
        },
        {
            name: "employmentLetter",
            maxCount: 1
        }
    ]),
    submitApplication
);


// Get all
router.get("/",authMiddleware,getAllApplications);

// Get one
router.get("/:id",authMiddleware,getSingleApplication)

router.patch("/:id/review",authMiddleware,reviewApplicationController);

router.patch( "/:id/reopen", authMiddleware, reopenApplicationController);

router.delete("/:id",authMiddleware, deleteApplicationController);

export default router;