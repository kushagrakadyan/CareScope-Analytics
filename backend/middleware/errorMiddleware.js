const errorMiddleware = (err, req, res, next) => {

    console.error("====================================");
    console.error("ERROR:");
    console.error(err);
    console.error("====================================");

    let statusCode = err.statusCode || 500;

    let message = err.message || "Internal Server Error";

    // ==========================================
    // Invalid MongoDB ObjectId
    // ==========================================

    if (err.name === "CastError") {

        statusCode = 400;

        message = "Invalid Resource ID";

    }

    // ==========================================
    // Duplicate Key Error
    // ==========================================

    if (err.code === 11000) {

        statusCode = 409;

        const field = Object.keys(err.keyValue)[0];

        message = `${field} already exists`;

    }

    // ==========================================
    // Mongoose Validation Error
    // ==========================================

    if (err.name === "ValidationError") {

        statusCode = 400;

        message = Object.values(err.errors)
            .map(error => error.message)
            .join(", ");

    }

    // ==========================================
    // JWT Invalid
    // ==========================================

    if (err.name === "JsonWebTokenError") {

        statusCode = 401;

        message = "Invalid Token";

    }

    // ==========================================
    // JWT Expired
    // ==========================================

    if (err.name === "TokenExpiredError") {

        statusCode = 401;

        message = "Token Expired";

    }

    // ==========================================
    // Multer File Upload Error
    // ==========================================

    if (err.name === "MulterError") {

        statusCode = 400;

        message = err.message;

    }

    // ==========================================
    // Final Response
    // ==========================================

    res.status(statusCode).json({

        success: false,

        statusCode,

        message,

        stack:
            process.env.NODE_ENV === "development"
                ? err.stack
                : undefined

    });

};

module.exports = errorMiddleware;