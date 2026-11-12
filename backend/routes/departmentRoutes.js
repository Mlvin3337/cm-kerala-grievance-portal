
const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
    getDepartments,
    getDepartmentById
} = require("../controllers/departmentController");

const {
    getAssignedGrievances,
    getAssignedGrievanceDetails,
    updateInvestigation,
    submitActionTakenReport
} = require("../controllers/departmentOfficerController");

// Department officer routes
router.get(
    "/grievances",
    protect,
    authorizeRoles("DEPARTMENT_OFFICER"),
    getAssignedGrievances
);

router.get(
    "/grievances/:id",
    protect,
    authorizeRoles("DEPARTMENT_OFFICER"),
    getAssignedGrievanceDetails
);

router.put(
    "/grievances/:id/investigation",
    protect,
    authorizeRoles("DEPARTMENT_OFFICER"),
    updateInvestigation
);

router.post(
    "/grievances/:id/action-report",
    protect,
    authorizeRoles("DEPARTMENT_OFFICER"),
    submitActionTakenReport
);

// Public department routes
router.get("/", getDepartments);
router.get("/:id", getDepartmentById);

module.exports = router;
