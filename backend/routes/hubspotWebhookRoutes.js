import express from "express";

import {
    handleHubSpotWebhook
} from "../controllers/hubspotWebhookController.js";

const router = express.Router();


router.post(
    "/",
    handleHubSpotWebhook
);


export default router;