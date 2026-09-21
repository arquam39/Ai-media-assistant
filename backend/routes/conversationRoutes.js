import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import {
    createConversation,
    getConversations,
    getConversation,
    renameConversation,
    deleteConversation
} from "../controllers/conversationController.js";

const router = express.Router();


router.use(authMiddleware);


router.post(
    "/",
    createConversation
);


router.get(
    "/",
    getConversations
);


router.get(
    "/:id",
    getConversation
);


router.patch(
    "/:id",
    renameConversation
);


router.delete(
    "/:id",
    deleteConversation
);


export default router;