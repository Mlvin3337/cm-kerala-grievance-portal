
const { pool } = require("../config/db");

// GET ALL GRIEVANCES ASSIGNED TO THE LOGGED-IN OFFICER
exports.getAssignedGrievances = async (req, res) => {
    try {
        const officerId = req.user.id;

        const [grievances] = await pool.execute(
            `SELECT
                g.id,
                g.reference_number,
                g.subject,
                g.description,
                g.district,
                g.category,
                g.priority,
                g.status,
                g.created_at,
                d.name AS department_name,
                u.name AS citizen_name,
                da.assigned_at,
                da.response_submitted_at
             FROM department_assignments da
             INNER JOIN grievances g
                ON da.grievance_id = g.id
             INNER JOIN departments d
                ON da.department_id = d.id
             INNER JOIN users u
                ON g.citizen_id = u.id
             WHERE da.officer_id = ?
             AND da.id = (
                SELECT MAX(da2.id)
                FROM department_assignments da2
                WHERE da2.grievance_id = da.grievance_id
             )
             ORDER BY da.assigned_at DESC`,
            [officerId]
        );

        return res.status(200).json({
            success: true,
            count: grievances.length,
            grievances
        });

    } catch (error) {
        console.error("Assigned grievances error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to retrieve assigned grievances."
        });
    }
};


// GET DETAILS OF A SPECIFIC ASSIGNED GRIEVANCE
exports.getAssignedGrievanceDetails = async (req, res) => {
    try {
        const officerId = req.user.id;
        const grievanceId = Number(req.params.id);

        if (!Number.isInteger(grievanceId) || grievanceId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid grievance ID."
            });
        }

        const [grievances] = await pool.execute(
            `SELECT
                g.*,
                u.name AS citizen_name,
                u.email AS citizen_email,
                u.mobile AS citizen_mobile,
                d.name AS department_name,
                da.id AS assignment_id,
                da.assigned_at,
                da.investigation_remarks,
                da.action_taken_report,
                da.resolution_details,
                da.response_submitted_at
             FROM department_assignments da
             INNER JOIN grievances g
                ON da.grievance_id = g.id
             INNER JOIN users u
                ON g.citizen_id = u.id
             INNER JOIN departments d
                ON da.department_id = d.id
             WHERE da.grievance_id = ?
             AND da.officer_id = ?
             AND da.id = (
                SELECT MAX(da2.id)
                FROM department_assignments da2
                WHERE da2.grievance_id = da.grievance_id
             )
             LIMIT 1`,
            [grievanceId, officerId]
        );

        if (grievances.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Assigned grievance not found."
            });
        }

        const [attachments] = await pool.execute(
            `SELECT
                id,
                original_filename,
                file_type,
                uploaded_at
             FROM attachments
             WHERE grievance_id = ?
             ORDER BY uploaded_at DESC`,
            [grievanceId]
        );

        const [history] = await pool.execute(
            `SELECT
                gh.id,
                gh.previous_status,
                gh.new_status,
                gh.remarks,
                gh.changed_at,
                u.name AS changed_by_name
             FROM grievance_history gh
             LEFT JOIN users u
                ON gh.changed_by = u.id
             WHERE gh.grievance_id = ?
             ORDER BY gh.changed_at DESC, gh.id DESC`,
            [grievanceId]
        );

        return res.status(200).json({
            success: true,
            grievance: {
                ...grievances[0],
                attachments,
                history
            }
        });

    } catch (error) {
        console.error("Assigned grievance details error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to retrieve grievance details."
        });
    }
};


// UPDATE INVESTIGATION REMARKS AND GRIEVANCE STATUS
exports.updateInvestigation = async (req, res) => {
    let connection;

    try {
        const officerId = req.user.id;
        const grievanceId = Number(req.params.id);

        const { investigation_remarks, status } = req.body;

        const allowedStatuses = ["In Progress", "Reopened"];

        if (!Number.isInteger(grievanceId) || grievanceId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid grievance ID."
            });
        }

        if (
            typeof investigation_remarks !== "string" ||
            !investigation_remarks.trim() ||
            investigation_remarks.length > 5000
        ) {
            return res.status(400).json({
                success: false,
                message: "Valid investigation remarks are required (maximum 5000 characters)."
            });
        }

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid grievance status."
            });
        }

        connection = await pool.getConnection();
        await connection.beginTransaction();

        const [assignments] = await connection.execute(
            `SELECT da.id, g.status
             FROM department_assignments da
             INNER JOIN grievances g
                ON da.grievance_id = g.id
             WHERE da.grievance_id = ?
             AND da.officer_id = ?
             AND da.id = (
                 SELECT MAX(da2.id)
                 FROM department_assignments da2
                 WHERE da2.grievance_id = da.grievance_id
             )
             FOR UPDATE`,
            [grievanceId, officerId]
        );

        if (assignments.length === 0) {
            await connection.rollback();

            return res.status(404).json({
                success: false,
                message: "Assigned grievance not found."
            });
        }

        const assignmentId = assignments[0].id;
        const previousStatus = assignments[0].status;

        // Prevent modification of resolved grievances
        if (previousStatus === "Resolved") {
            await connection.rollback();

            return res.status(400).json({
                success: false,
                message: "A resolved grievance cannot be modified."
            });
        }

        await connection.execute(
            `UPDATE department_assignments
             SET investigation_remarks = ?
             WHERE id = ?`,
            [investigation_remarks.trim(), assignmentId]
        );

        if (previousStatus !== status) {
            await connection.execute(
                `UPDATE grievances
                 SET status = ?
                 WHERE id = ?`,
                [status, grievanceId]
            );

            await connection.execute(
                `INSERT INTO grievance_history
                 (grievance_id, previous_status, new_status, remarks, changed_by)
                 VALUES (?, ?, ?, ?, ?)`,
                [
                    grievanceId,
                    previousStatus,
                    status,
                    investigation_remarks.trim(),
                    officerId
                ]
            );
        }

        await connection.commit();

        return res.status(200).json({
            success: true,
            message: "Investigation updated successfully.",
            status
        });

    } catch (error) {
        if (connection) await connection.rollback();

        console.error("Investigation update error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to update investigation."
        });

    } finally {
        if (connection) connection.release();
    }
};


// SUBMIT ACTION-TAKEN REPORT TO CMO
exports.submitActionTakenReport = async (req, res) => {
    let connection;

    try {
        const officerId = req.user.id;
        const grievanceId = Number(req.params.id);

        const {
            action_taken_report,
            resolution_details
        } = req.body;

        if (!Number.isInteger(grievanceId) || grievanceId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid grievance ID."
            });
        }

        if (
            typeof action_taken_report !== "string" ||
            !action_taken_report.trim() ||
            action_taken_report.length > 10000
        ) {
            return res.status(400).json({
                success: false,
                message: "A valid action-taken report is required."
            });
        }

        if (
            typeof resolution_details !== "string" ||
            !resolution_details.trim() ||
            resolution_details.length > 5000
        ) {
            return res.status(400).json({
                success: false,
                message: "Valid resolution details are required."
            });
        }

        connection = await pool.getConnection();
        await connection.beginTransaction();

        const [assignments] = await connection.execute(
            `SELECT da.id, g.status
             FROM department_assignments da
             INNER JOIN grievances g
                ON da.grievance_id = g.id
             WHERE da.grievance_id = ?
             AND da.officer_id = ?
             AND da.id = (
                 SELECT MAX(da2.id)
                 FROM department_assignments da2
                 WHERE da2.grievance_id = da.grievance_id
             )
             FOR UPDATE`,
            [grievanceId, officerId]
        );

        if (assignments.length === 0) {
            await connection.rollback();

            return res.status(404).json({
                success: false,
                message: "Assigned grievance not found."
            });
        }

        const assignmentId = assignments[0].id;
        const currentStatus = assignments[0].status;

        if (currentStatus === "Resolved") {
            await connection.rollback();

            return res.status(400).json({
                success: false,
                message: "This grievance has already been resolved."
            });
        }

        await connection.execute(
            `UPDATE department_assignments
             SET action_taken_report = ?,
                 resolution_details = ?,
                 response_submitted_at = CURRENT_TIMESTAMP
             WHERE id = ?`,
            [
                action_taken_report.trim(),
                resolution_details.trim(),
                assignmentId
            ]
        );

        await connection.commit();

        return res.status(200).json({
            success: true,
            message: "Action-taken report submitted to CMO successfully.",
            grievance_id: grievanceId,
            status: currentStatus,
            review_status: "Pending CMO Review"
        });

    } catch (error) {
        if (connection) await connection.rollback();

        console.error("Action-taken report error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to submit action-taken report."
        });

    } finally {
        if (connection) connection.release();
    }
};
