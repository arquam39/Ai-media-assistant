import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
    {
        applicant: {
            name: {
                type: String,
                required: true,
                trim: true
            },

            email: {
                type: String,
                required: true,
                trim: true,
                lowercase: true
            },

            phone: {
                type: String,
                required: true,
                trim: true
            },

            address: {
                type: String,
                required: true,
                trim: true
            }
        },

        documents: [
            {
                mediaId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Media",
                    required: true
                },

                documentType: {
                    type: String,
                    required: true,
                    enum: [
                        "cnic",
                        "salary_slip",
                        "bank_statement",
                        "employment_letter",
                        "other"
                    ]
                }
            }
        ],

        aiAnalysis: {
            extractedData: {
                type: mongoose.Schema.Types.Mixed,
                default: {}
            },

            missingFields: {
                type: [String],
                default: []
            },

            documentIssues: {
                type: [String],
                default: []
            },

            riskFlags: {
                type: [String],
                default: []
            },

            score: {
                type: Number,
                default: null
            },

            recommendation: {
                type: String,
                enum: [
                    "LIKELY_APPROVE",
                    "REVIEW",
                    "LIKELY_REJECT"
                ],
                default: null
            },

            summary: {
                type: String,
                default: ""
            }
        },

        status: {
            type: String,
            enum: [
                "SUBMITTED",
                "PROCESSING",
                "PENDING_REVIEW",
                "PENDING_DOCUMENTS",
                "APPROVED",
                "REJECTED"
            ],
            default: "SUBMITTED",
            index: true
        },

        review: {
            decision: {
                type: String,
                enum: [
                    "APPROVED",
                    "REJECTED"
                ],
                default: null
            },

            internalNote: {
                type: String,
                default: ""
            },

            applicantMessage: {
                type: String,
                default: ""
            },

            reviewedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                default: null
            },

            reviewedAt: {
                type: Date,
                default: null
            }
        },

        hubspot: {
            contactId: {
                type: String,
                default: null
            },

            contactCreated: {
                type: Boolean,
                default: false
            },

            dealId: {
                type: String,
                default: null
            },

            stageId: {
                type: String,
                default: null
            }
        }
    },
    {
        timestamps: true
    }
);

applicationSchema.index({
    status: 1,
    createdAt: -1
});

applicationSchema.index({
    "applicant.email": 1
});

const Application = mongoose.model(
    "Application",
    applicationSchema
);

export default Application;