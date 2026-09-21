import Application from "../models/application.js";

import {
    getApplicationStatusFromHubSpotStage
} from "../services/hubspotService.js";


export const handleHubSpotWebhook = async (
    req,
    res
) => {

    try {

        console.log("========== HUBSPOT WEBHOOK ==========");

        const events = req.body;

        console.log("Events:", events);


        for (const event of events) {

            if (
                event.subscriptionType !==
                    "deal.propertyChange" ||
                event.propertyName !==
                    "dealstage"
            ) {
                console.log(
                    "Ignoring event:",
                    event.subscriptionType,
                    event.propertyName
                );

                continue;
            }


            const dealId =
                event.objectId.toString();

            const hubSpotStage =
                event.propertyValue;


            console.log(
                "Deal ID:",
                dealId
            );

            console.log(
                "HubSpot Stage:",
                hubSpotStage
            );


            // Find application
            const application =
                await Application.findOne({
                    "hubspot.dealId":
                        dealId
                });


            console.log(
                "Application found:",
                application
                    ? application._id
                    : "NO APPLICATION"
            );


            if (!application) {

                console.log(
                    "No application found for deal:",
                    dealId
                );

                continue;
            }


            console.log(
                "Current MongoDB status:",
                application.status
            );


            // Convert HubSpot stage to MongoDB status
            const newStatus =
                getApplicationStatusFromHubSpotStage(
                    hubSpotStage
                );


            console.log(
                "Converted status:",
                newStatus
            );


            if (!newStatus) {

                console.log(
                    "Unknown HubSpot stage:",
                    hubSpotStage
                );

                continue;
            }


            if (
                application.status ===
                newStatus
            ) {

                console.log(
                    "Status already synchronized"
                );

                continue;
            }


            // Update MongoDB
            application.status =
                newStatus;

            application.hubspot.stageId =
                hubSpotStage;


            await application.save();


            console.log(
                "MongoDB UPDATED SUCCESSFULLY"
            );

            console.log(
                "New status:",
                application.status
            );
        }


        return res.status(200).json({
            success: true
        });

    } catch (error) {

        console.error(
            "HubSpot webhook error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Webhook processing failed"
        });
    }
};