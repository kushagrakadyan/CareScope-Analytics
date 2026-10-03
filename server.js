
const path = require("path");
const fs = require("fs");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, "backend", ".env") });

const connectDB = require("./backend/config/db");
const errorMiddleware = require("./backend/middleware/errorMiddleware");

const authRoutes = require("./backend/routes/authRoutes");
const patientRoutes = require("./backend/routes/patientRoutes");
const appointmentRoutes = require("./backend/routes/appointmentRoutes");
const reportRoutes = require("./backend/routes/reportRoutes");
const analyticsRoutes = require("./backend/routes/analyticsRoutes");

const app = express();
const PORT = Number(process.env.PORT) || 5000;

app.disable("x-powered-by");

app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false
}));

app.use(cors({
    origin: true,
    credentials: true
}));

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

const uploadsDir = path.join(__dirname, "backend", "uploads");
fs.mkdirSync(uploadsDir, { recursive: true });
app.use("/uploads", express.static(uploadsDir));

app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "CareScope API is running",
        environment: process.env.NODE_ENV || "development",
        timestamp: new Date().toISOString()
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/analytics", analyticsRoutes);

const frontendRoot = __dirname;
app.use(express.static(frontendRoot, {
    index: false,
    extensions: ["html"]
}));

app.get("/", (req, res) => {
    res.sendFile(path.join(frontendRoot, "index.html"));
});

app.use((req, res, next) => {
    if (req.path.startsWith("/api/")) {
        return res.status(404).json({
            success: false,
            message: "API route not found"
        });
    }

    res.sendFile(path.join(frontendRoot, "index.html"), (error) => {
        if (error) next(error);
    });
});

app.use(errorMiddleware);

const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`CareScope running at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Server startup aborted. Check MongoDB/Atlas and MONGO_URI.");
        process.exit(1);
    }
};

if (require.main === module) {
    startServer();
}

module.exports = { app, startServer };
