import { z } from "zod";


// =========================
// Constants
// =========================

const MAX_FILE_SIZE =
    10 * 1024 * 1024; // 10MB

const ALLOWED_FILE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/pdf"
];


// =========================
// File Validation
// =========================

const applicationFileSchema =
    z
        .instanceof(File, {
            message:
                "Please select a file"
        })
        .refine(
            (file) =>
                file.size <=
                MAX_FILE_SIZE,
            {
                message:
                    "File size cannot exceed 10MB"
            }
        )
        .refine(
            (file) =>
                ALLOWED_FILE_TYPES.includes(
                    file.type
                ),
            {
                message:
                    "Only JPG, PNG, WEBP and PDF files are allowed"
            }
        );


// =========================
// Application Schema
// =========================

export const applicationSchema =
    z.object({

        name: z
            .string()
            .trim()
            .min(
                2,
                "Name must be at least 2 characters"
            )
            .max(
                100,
                "Name cannot exceed 100 characters"
            ),

        email: z
            .string()
            .trim()
            .email(
                "Please enter a valid email address"
            ),

        phone: z
            .string()
            .trim()
            .min(
                7,
                "Please enter a valid phone number"
            )
            .max(
                20,
                "Phone number cannot exceed 20 characters"
            ),

        address: z
            .string()
            .trim()
            .min(
                5,
                "Address must be at least 5 characters"
            )
            .max(
                300,
                "Address cannot exceed 300 characters"
            ),

        cnic:
            applicationFileSchema,

        salarySlip:
            applicationFileSchema,

        bankStatement:
            applicationFileSchema,

        employmentLetter:
            applicationFileSchema
    });


// =========================
// Constants Export
// =========================

export const MAX_APPLICATION_FILE_SIZE =
    MAX_FILE_SIZE;

export const APPLICATION_ALLOWED_FILE_TYPES =
    ALLOWED_FILE_TYPES;



export const reviewSchema =
    z
        .object({

            decision: z
                .enum(
                    [
                        "APPROVED",
                        "REJECTED"
                    ],
                    {
                        message:
                            "Please select a decision"
                    }
                ),

            internalNote: z
                .string()
                .trim()
                .max(
                    1000,
                    "Internal note cannot exceed 1000 characters"
                ),

            applicantMessage: z
                .string()
                .trim()
                .max(
                    1000,
                    "Applicant message cannot exceed 1000 characters"
                )
        })
        .superRefine(
            (
                data,
                context
            ) => {

                if (
                    data.decision ===
                        "REJECTED" &&
                    !data.applicantMessage
                ) {

                    context.addIssue({
                        code: "custom",
                        path: [
                            "applicantMessage"
                        ],
                        message:
                            "Applicant message is required when rejecting an application"
                    });
                }
            }
        );