
const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
    getDashboardStats,
    getAllGrievances,
    getGrievanceDetails,
    getDepartmentOfficers,
    assignGrievance,
    reviewActionTakenReport
} = require("../controllers/cmoController");

// Protect all CMO routes
router.use(protect);
router.use(authorizeRoles("CMO_ADMIN"));

// Dashboard
router.get("/stats", getDashboardStats);

// Grievances
router.get("/grievances", getAllGrievances);
router.get("/grievances/:id", getGrievanceDetails);

// Department officers
router.get("/officers", getDepartmentOfficers);

// Assignment
router.post("/assign", assignGrievance);

// Review department action-taken report
router.post(
    "/grievances/:id/review",
    reviewActionTakenReport
);

module.exports = router;
