
const { pool } = require("../config/db");

// CMO DASHBOARD STATISTICS
exports.getDashboardStats = async (req, res) => {
    try {
        const [stats] = await pool.execute(
            `SELECT
                COUNT(*) AS total,
                SUM(status IN ('Submitted', 'Under Review', 'In Progress', 'Reopened')) AS pending,
                SUM(status = 'Resolved') AS resolved,
                SUM(
                    status != 'Resolved'
                    AND created_at < DATE_SUB(NOW(), INTERVAL 7 DAY)
                ) AS overdue
             FROM grievances`
        );

        return res.status(200).json({
            success: true,
            stats: {
                total: Number(stats[0].total || 0),
                pending: Number(stats[0].pending || 0),
                resolved: Number(stats[0].resolved || 0),
                overdue: Number(stats[0].overdue || 0)
            }
        });

    } catch (error) {
        console.error("CMO DASHBOARD STATS ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to retrieve dashboard statistics."
        });
    }
};


// GET ALL GRIEVANCES WITH FILTERS
exports.getAllGrievances = async (req, res) => {
    try {
        const { district, category, priority, status } = req.query;

        let query = `
            SELECT
                g.id,
                g.reference_number,
                g.district,
                g.category,
                g.subject,
                g.status,
                g.priority,
                g.ai_status,
                g.ai_category,
                g.ai_reviewed,
                g.created_at,
                citizen.name AS citizen_name,
                dept.name AS assigned_department,
                ai_dept.name AS ai_suggested_department
            FROM grievances g
            LEFT JOIN users citizen
                ON citizen.id = g.citizen_id
            LEFT JOIN (
                SELECT da1.*
                FROM department_assignments da1
                INNER JOIN (
                    SELECT grievance_id, MAX(id) AS latest_id
                    FROM department_assignments
                    GROUP BY grievance_id
                ) latest
                ON latest.latest_id = da1.id
            ) assignment
                ON assignment.grievance_id = g.id
            LEFT JOIN departments dept
                ON dept.id = assignment.department_id
            LEFT JOIN departments ai_dept
                ON ai_dept.id = g.ai_department_id
            WHERE 1 = 1
        `;

        const values = [];

        if (district) {
            query += " AND g.district = ?";
            values.push(district);
        }

        if (category) {
            query += " AND g.category = ?";
            values.push(category);
        }

        if (priority) {
            query += " AND g.priority = ?";
            values.push(priority);
        }

        if (status) {
            query += " AND g.status = ?";
            values.push(status);
        }

        query += " ORDER BY g.created_at DESC";

        const [grievances] = await pool.execute(query, values);

        return res.status(200).json({
            success: true,
            count: grievances.length,
            grievances
        });

    } catch (error) {
        console.error("CMO GET GRIEVANCES ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to retrieve grievances."
        });
    }
};


// GET COMPLETE GRIEVANCE DETAILS
exports.getGrievanceDetails = async (req, res) => {
    try {
        const { id } = req.params;

        const [grievances] = await pool.execute(
            `SELECT
                g.*,
                citizen.name AS citizen_name,
                citizen.email AS citizen_email,
                citizen.mobile AS citizen_mobile,
                ai_dept.name AS ai_suggested_department
             FROM grievances g
             LEFT JOIN users citizen
                ON citizen.id = g.citizen_id
             LEFT JOIN departments ai_dept
                ON ai_dept.id = g.ai_department_id
             WHERE g.id = ?`,
            [id]
        );

        if (grievances.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Grievance not found."
            });
        }

        const [assignments] = await pool.execute(
            `SELECT
                da.id,
                da.investigation_remarks,
                da.action_taken_report,
                da.resolution_details,
                da.response_submitted_at,
                da.assigned_at,
                dept.name AS department_name,
                officer.name AS officer_name,
                officer.email AS officer_email,
                assigned_by.name AS assigned_by_name
             FROM department_assignments da
             LEFT JOIN departments dept
                ON dept.id = da.department_id
             LEFT JOIN users officer
                ON officer.id = da.officer_id
             LEFT JOIN users assigned_by
                ON assigned_by.id = da.assigned_by
             WHERE da.grievance_id = ?
             ORDER BY da.assigned_at DESC`,
            [id]
        );

        const [attachments] = await pool.execute(
            `SELECT
                id,
                original_filename,
                file_type,
                uploaded_at
             FROM attachments
             WHERE grievance_id = ?
             ORDER BY uploaded_at ASC`,
            [id]
        );

        const [history] = await pool.execute(
            `SELECT
                gh.id,
                gh.previous_status,
                gh.new_status,
                gh.remarks,
                gh.changed_at,
                u.name AS changed_by_name,
                u.role AS changed_by_role
             FROM grievance_history gh
             LEFT JOIN users u
                ON u.id = gh.changed_by
             WHERE gh.grievance_id = ?
             ORDER BY gh.changed_at ASC, gh.id ASC`,
            [id]
        );

        return res.status(200).json({
            success: true,
            grievance: {
                ...grievances[0],
                assignments,
                attachments,
                history
            }
        });

    } catch (error) {
        console.error("CMO GRIEVANCE DETAILS ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to retrieve grievance details."
        });
    }
};


// GET DEPARTMENT OFFICERS
exports.getDepartmentOfficers = async (req, res) => {
    try {
        const [officers] = await pool.execute(
            `SELECT
                u.id,
                u.name,
                u.email,
                u.mobile,
                u.department_id,
                d.name AS department_name
             FROM users u
             LEFT JOIN departments d
                ON d.id = u.department_id
             WHERE u.role = 'DEPARTMENT_OFFICER'
               AND u.is_active = 1
             ORDER BY d.name, u.name`
        );

        return res.status(200).json({
            success: true,
            count: officers.length,
            officers
        });

    } catch (error) {
        console.error("CMO GET OFFICERS ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to retrieve department officers."
        });
    }
};


// ASSIGN GRIEVANCE TO DEPARTMENT OFFICER
exports.assignGrievance = async (req, res) => {
    let connection;

    try {
        const { grievance_id, officer_id, remarks } = req.body;

        if (!grievance_id || !officer_id) {
            return res.status(400).json({
                success: false,
                message: "Grievance ID and officer ID are required."
            });
        }

        const grievanceId = Number(grievance_id);
        const officerId = Number(officer_id);

        if (
            !Number.isInteger(grievanceId) ||
            grievanceId <= 0 ||
            !Number.isInteger(officerId) ||
            officerId <= 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid grievance ID or officer ID."
            });
        }

        if (
            remarks !== undefined &&
            (typeof remarks !== "string" || remarks.length > 5000)
        ) {
            return res.status(400).json({
                success: false,
                message: "Remarks must be text with a maximum of 5000 characters."
            });
        }

        connection = await pool.getConnection();
        await connection.beginTransaction();

        const [grievances] = await connection.execute(
            `SELECT id, status
             FROM grievances
             WHERE id = ?
             FOR UPDATE`,
            [grievanceId]
        );

        if (grievances.length === 0) {
            await connection.rollback();

            return res.status(404).json({
                success: false,
                message: "Grievance not found."
            });
        }

        const [officers] = await connection.execute(
            `SELECT id, name, department_id
             FROM users
             WHERE id = ?
               AND role = 'DEPARTMENT_OFFICER'
               AND is_active = 1`,
            [officerId]
        );

        if (officers.length === 0) {
            await connection.rollback();

            return res.status(404).json({
                success: false,
                message: "Active department officer not found."
            });
        }

        const officer = officers[0];
        const previousStatus = grievances[0].status;

        const [assignment] = await connection.execute(
            `INSERT INTO department_assignments (
                grievance_id,
                department_id,
                officer_id,
                assigned_by,
                investigation_remarks
            )
            VALUES (?, ?, ?, ?, ?)`,
            [
                grievanceId,
                officer.department_id,
                officer.id,
                req.user.id,
                remarks ? remarks.trim() : null
            ]
        );

        await connection.execute(
            `UPDATE grievances
             SET status = 'In Progress'
             WHERE id = ?`,
            [grievanceId]
        );

        await connection.execute(
            `INSERT INTO grievance_history (
                grievance_id,
                previous_status,
                new_status,
                remarks,
                changed_by
            )
            VALUES (?, ?, ?, ?, ?)`,
            [
                grievanceId,
                previousStatus,
                "In Progress",
                `Assigned to ${officer.name}.`,
                req.user.id
            ]
        );

        await connection.commit();

        return res.status(201).json({
            success: true,
            message: "Grievance assigned successfully.",
            assignment: {
                id: assignment.insertId,
                grievance_id: grievanceId,
                officer_id: officer.id,
                officer_name: officer.name,
                department_id: officer.department_id,
                previous_status: previousStatus,
                status: "In Progress"
            }
        });

    } catch (error) {
        if (connection) {
            await connection.rollback();
        }

        console.error("CMO ASSIGN GRIEVANCE ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to assign grievance."
        });

    } finally {
        if (connection) {
            connection.release();
        }
    }
};


// REVIEW DEPARTMENT ACTION-TAKEN REPORT
exports.reviewActionTakenReport = async (req, res) => {
    let connection;

    try {
        const grievanceId = Number(req.params.id);
        const { decision, remarks } = req.body;

        if (!Number.isInteger(grievanceId) || grievanceId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid grievance ID."
            });
        }

        if (!["RESOLVE", "RETURN_FOR_ACTION"].includes(decision)) {
            return res.status(400).json({
                success: false,
                message: "Decision must be RESOLVE or RETURN_FOR_ACTION."
            });
        }

        if (
            typeof remarks !== "string" ||
            !remarks.trim() ||
            remarks.trim().length > 5000
        ) {
            return res.status(400).json({
                success: false,
                message: "Review remarks are required and must not exceed 5000 characters."
            });
        }

        connection = await pool.getConnection();
        await connection.beginTransaction();

        const [grievances] = await connection.execute(
            `SELECT id, status
             FROM grievances
             WHERE id = ?
             FOR UPDATE`,
            [grievanceId]
        );

        if (grievances.length === 0) {
            await connection.rollback();

            return res.status(404).json({
                success: false,
                message: "Grievance not found."
            });
        }

        const grievance = grievances[0];

        if (grievance.status === "Resolved") {
            await connection.rollback();

            return res.status(400).json({
                success: false,
                message: "This grievance has already been resolved."
            });
        }

        const [assignments] = await connection.execute(
            `SELECT
                id,
                action_taken_report,
                resolution_details,
                response_submitted_at
             FROM department_assignments
             WHERE grievance_id = ?
             ORDER BY id DESC
             LIMIT 1
             FOR UPDATE`,
            [grievanceId]
        );

        if (
            assignments.length === 0 ||
            !assignments[0].response_submitted_at ||
            !assignments[0].action_taken_report ||
            !assignments[0].resolution_details
        ) {
            await connection.rollback();

            return res.status(400).json({
                success: false,
                message: "The department has not submitted a complete action-taken report."
            });
        }

        const assignmentId = assignments[0].id;
        const previousStatus = grievance.status;

        const newStatus =
            decision === "RESOLVE" ? "Resolved" : "In Progress";

        // Update grievance status
        await connection.execute(
            `UPDATE grievances
             SET status = ?
             WHERE id = ?`,
            [newStatus, grievanceId]
        );

        // Clear submission timestamp if CMO returns the report
        if (decision === "RETURN_FOR_ACTION") {
            await connection.execute(
                `UPDATE department_assignments
                 SET response_submitted_at = NULL
                 WHERE id = ?`,
                [assignmentId]
            );
        }

        const historyRemark =
            decision === "RESOLVE"
                ? `CMO approved the department report. ${remarks.trim()}`
                : `CMO returned the grievance for further departmental action. ${remarks.trim()}`;

        await connection.execute(
            `INSERT INTO grievance_history (
                grievance_id,
                previous_status,
                new_status,
                remarks,
                changed_by
            )
            VALUES (?, ?, ?, ?, ?)`,
            [
                grievanceId,
                previousStatus,
                newStatus,
                historyRemark,
                req.user.id
            ]
        );

        await connection.commit();

        return res.status(200).json({
            success: true,
            message:
                decision === "RESOLVE"
                    ? "Department report approved. Grievance resolved successfully."
                    : "Department report reviewed. Further action requested.",
            grievance_id: grievanceId,
            decision,
            previous_status: previousStatus,
            status: newStatus
        });

    } catch (error) {
        if (connection) {
            await connection.rollback();
        }

        console.error("CMO REVIEW ACTION REPORT ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to review the department action-taken report."
        });

    } finally {
        if (connection) {
            connection.release();
        }
    }
};
