// services/hubspotService.js
import hubspot from "@hubspot/api-client";


const hubspotClient = new hubspot.Client({
    accessToken:
        process.env.HUBSPOT_ACCESS_TOKEN
});

export default hubspotClient;

// ========================================
// Find Contact By Email
// ========================================

export const findContactByEmail = async (
    email
) => {

    const response =
        await hubspotClient.crm.contacts.searchApi.doSearch({
            filterGroups: [
                {
                    filters: [
                        {
                            propertyName: "email",
                            operator: "EQ",
                            value: email
                        }
                    ]
                }
            ],
            properties: [
                "firstname",
                "lastname",
                "email",
                "phone"
            ],
            limit: 1
        });

    return response.results?.[0] || null;
};


// ========================================
// Create Contact
// ========================================

export const createContact = async ({
    name,
    email,
    phone
}) => {

    const nameParts =
        name.trim().split(/\s+/);

    const firstname =
        nameParts.shift() || "";

    const lastname =
        nameParts.join(" ") || "";

    const response =
        await hubspotClient.crm.contacts.basicApi.create({
            properties: {
                firstname,
                lastname,
                email,
                phone
            }
        });

    return response;
};


// ========================================
// Find Or Create Contact
// ========================================

export const findOrCreateContact = async ({
    name,
    email,
    phone
}) => {

    const existingContact =
        await findContactByEmail(email);

    if (existingContact) {

        return {
            contact: existingContact,
            created: false
        };
    }

    const newContact =
        await createContact({
            name,
            email,
            phone
        });

    return {
        contact: newContact,
        created: true
    };
};

// ========================================
// Get HubSpot Stage
// ========================================

export const getHubSpotStage = (status) => {

    const stages = {

        SUBMITTED:
            process.env.HUBSPOT_STAGE_SUBMITTED,

        PROCESSING:
            process.env.HUBSPOT_STAGE_PROCESSING,

        PENDING_DOCUMENTS:
            process.env.HUBSPOT_STAGE_PENDING_DOCUMENTS,

        PENDING_REVIEW:
            process.env.HUBSPOT_STAGE_PENDING_REVIEW,

        APPROVED:
            process.env.HUBSPOT_STAGE_APPROVED,

        REJECTED:
            process.env.HUBSPOT_STAGE_REJECTED
    };


    const stage =
        stages[status];


    if (!stage) {

        throw new Error(
            `No HubSpot stage configured for status: ${status}`
        );
    }


    return stage;
};


// ========================================
// Create Deal
// ========================================

export const createApplicationDeal = async ({
    application
}) => {

    const ai =
        application.aiAnalysis;


    const deal =
        await hubspotClient.crm.deals.basicApi.create({

            properties: {

                dealname:
                    `Leasing Application - ${application.applicant.name}`,

                pipeline:
                    process.env.HUBSPOT_PIPELINE_ID,

                dealstage:
                    getHubSpotStage(
                        application.status
                    ),

                application_id:
                    application._id.toString(),

                application_status:
                    application.status,

                ai_score:
                    ai.score?.toString() || "",

                ai_recommendation:
                    ai.recommendation || "",

                missing_fields:
                    ai.missingFields.join("\n"),

                document_issues:
                    ai.documentIssues.join("\n"),

                ai_summary:
                    ai.summary || "",

                applicant_message:
                    ""
            }
        });


    return deal;
};


// ========================================
// Associate Contact With Deal
// ========================================

export const associateContactWithDeal = async ({
    contactId,
    dealId
}) => {

    const response =
        await hubspotClient.apiRequest({
            method: "PUT",

            path:
                `/crm/v4/objects/contacts/${contactId}/associations/default/deals/${dealId}`
        });

    return response;
};


// ========================================
// Sync Application To HubSpot
// ========================================

export const syncApplicationToHubSpot = async ({
    application
}) => {

    // =========================
    // 1. Find/Create Contact
    // =========================

    const contactResult =
        await findOrCreateContact({
            name:
                application.applicant.name,

            email:
                application.applicant.email,

            phone:
                application.applicant.phone
        });

    const contactId =
        contactResult.contact.id;


    // =========================
    // 2. Create Deal
    // =========================

    let deal;

    if (application.hubspot?.dealId) {

        console.log(
            "HubSpot deal already exists:",
            application.hubspot.dealId
        );

        deal = {
            id:
                application.hubspot.dealId
        };

    } else {

        deal =
            await createApplicationDeal({
                application
            });
    }


    const dealId =
        deal.id;


    // =========================
    // 3. Associate Contact
    // =========================

    if (!application.hubspot?.dealId) {

        await associateContactWithDeal({
            contactId,
            dealId
        });
    }


    // =========================
    // 4. Save IDs in MongoDB
    // =========================

    application.hubspot = {
        contactId,

        contactCreated:
            contactResult.created,

        dealId,

        stageId:
            getHubSpotStage(
                application.status
            )
    };

    await application.save();


    return {
        contactId,
        dealId,
        contactCreated:
            contactResult.created
    };
};


export const updateApplicationDeal = async ({
    application
}) => {

    const dealId =
        application.hubspot?.dealId;


    if (!dealId) {

        throw new Error(
            "HubSpot deal ID is missing"
        );
    }


    const ai =
        application.aiAnalysis;

    const review =
        application.review;


    const deal =
        await hubspotClient.crm.deals.basicApi.update(
            dealId,
            {
                properties: {

                    dealstage:
                        getHubSpotStage(
                            application.status
                        ),

                    application_status:
                        application.status,

                    ai_score:
                        ai.score?.toString() || "",

                    ai_recommendation:
                        ai.recommendation || "",

                    missing_fields:
                        ai.missingFields.join("\n"),

                    document_issues:
                        ai.documentIssues.join("\n"),

                    ai_summary:
                        ai.summary || "",

                    applicant_message:
                        review?.applicantMessage || ""
                }
            }
        );


    return deal;
};


// ========================================
// Delete Deal
// ========================================

export const deleteDeal = async (
    dealId
) => {

    if (!dealId) {
        return;
    }

    await hubspotClient.crm.deals.basicApi.archive(
        dealId
    );
};


// ========================================
// Delete Contact
// ========================================

export const deleteContact = async (
    contactId
) => {

    if (!contactId) {
        return;
    }

    await hubspotClient.crm.contacts.basicApi.archive(
        contactId
    );
};

// ========================================
// Get Application Status From HubSpot Stage
// ========================================

export const getApplicationStatusFromHubSpotStage = (
    hubSpotStage
) => {

    const stages = {
        [process.env.HUBSPOT_STAGE_SUBMITTED]:
            "SUBMITTED",

        [process.env.HUBSPOT_STAGE_PROCESSING]:
            "PROCESSING",

        [process.env.HUBSPOT_STAGE_PENDING_DOCUMENTS]:
            "PENDING_DOCUMENTS",

        [process.env.HUBSPOT_STAGE_PENDING_REVIEW]:
            "PENDING_REVIEW",

        [process.env.HUBSPOT_STAGE_APPROVED]:
            "APPROVED",

        [process.env.HUBSPOT_STAGE_REJECTED]:
            "REJECTED"
    };

    return stages[hubSpotStage] || null;
};