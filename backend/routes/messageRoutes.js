import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import {
    createMessage,
    fetchMessages
} from "../controllers/messageController.js";


const router = express.Router();


router.use(authMiddleware);


router.post("/", createMessage);
router.get("/:conversationId", fetchMessages);


export default router;