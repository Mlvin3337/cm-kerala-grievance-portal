const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
    submitGrievance,
    getMyGrievances,
    trackGrievance,
    submitCitizenFeedback
} = require("../controllers/grievanceController");

// Citizen submits grievance
router.post(
    "/",
    protect,
    upload.single("attachment"),
    submitGrievance
);

// Citizen views own grievances
router.get(
    "/my",
    protect,
    getMyGrievances
);

// Track using reference number
router.get(
    "/track/:referenceNumber",
    trackGrievance
);

// Citizen submits feedback after grievance resolution
router.post(
    "/:grievanceId/feedback",
    protect,
    submitCitizenFeedback
);

module.exports = router;