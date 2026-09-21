const errorMiddleware = (err, req, res, next) => {

    console.error(err);

    // =========================
    // App errors
    // =========================

    if (err.isOperational) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message
        });
    }


    // =========================
    // Zod validation errors
    // =========================

    if (err.name === "ZodError") {
        return res.status(400).json({
            success: false,
            message: err.issues[0].message
        });
    }


    // =========================
    // Multer errors
    // =========================

    if (err.name === "MulterError") {
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }

    // =========================
    // JWT errors
    // =========================

    if (err.name === "TokenExpiredError") {
        return res.status(401).json({
            success: false,
            message: "Reset token has expired"
        });
    }

    if (err.name === "JsonWebTokenError") {
        return res.status(401).json({
            success: false,
            message: "Invalid reset token"
        });
    }

    // =========================
    // Unknown errors
    // =========================

    return res.status(500).json({
        success: false,
        message: "Internal server error"
    });
};

export default errorMiddleware;