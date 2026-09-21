import "dotenv/config";

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import mediaRoutes from "./routes/mediaRoutes.js";
import conversationRoutes from "./routes/conversationRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import hubspotWebhookRoutes from "./routes/hubspotWebhookRoutes.js";

import errorMiddleware from "./middleware/errorMiddleware.js";
import rateLimitMiddleware from "./middleware/rateLimitMiddleware.js";
import AppError from "./utils/AppError.js";

const app = express();


// =========================
// Global Middleware
// =========================

app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true
    })
);


app.use(
    express.json({
        limit: "10mb"
    })
);


app.use(
    express.urlencoded({
        extended: true
    })
);


app.use(cookieParser());


// =========================
// Rate Limiting
// =========================

app.use(
    rateLimitMiddleware({
        windowMs: 15 * 60 * 1000,
        max: 200
    })
);


// =========================
// Routes
// =========================

app.use(
    "/api/auth",
    authRoutes
);

app.use(
    "/api/users",
    userRoutes
);

app.use(
    "/api/media",
    mediaRoutes
);

app.use(
    "/api/conversations",
    conversationRoutes
);

app.use(
    "/api/messages",
    messageRoutes
);

app.use(
    "/api/applications",
    applicationRoutes
);

app.use(
    "/api/webhooks/hubspot",
    hubspotWebhookRoutes
);


// =========================
// Health Check
// =========================

app.get("/", (req, res) => {

    res.json({
        success: true,
        message:
            "AI Media Assistant API is running"
    });

});


// =========================
// 404
// =========================

app.use((req, res, next) => {

    next(
        new AppError(
            `Route not found: ${req.method} ${req.originalUrl}`,
            404
        )
    );

});


// =========================
// Error Handler
// =========================

app.use(errorMiddleware);


export default app;