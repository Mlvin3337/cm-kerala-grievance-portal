
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
const grievanceRoutes = require("./routes/grievanceRoutes");
const cmoRoutes = require("./routes/cmoRoutes");

const { testConnection } = require("./config/db");

const app = express();

app.use(helmet());

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// REQUEST AND RESPONSE DIAGNOSTICS (DEVELOPMENT ONLY)
if (process.env.NODE_ENV !== "production") {
    app.use((req, res, next) => {
        console.log(`REQUEST: ${req.method} ${req.originalUrl}`);

        res.on("finish", () => {
            console.log(
                `RESPONSE: ${req.method} ${req.originalUrl} | ${res.statusCode}`
            );
        });

        next();
    });
}

// API ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/grievances", grievanceRoutes);
app.use("/api/cmo", cmoRoutes);

// HEALTH CHECK
app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "CM Kerala Grievance Portal API is running",
        timestamp: new Date()
    });
});

// START SERVER
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await testConnection();

        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error("Server startup failed:", error);
        process.exit(1);
    }
};

startServer();
