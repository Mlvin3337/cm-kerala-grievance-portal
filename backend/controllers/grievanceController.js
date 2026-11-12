
const { pool } = require("../config/db");
const analyzeGrievance = require("../services/ai/grievanceAI");
const crypto = require("crypto");

// Generate unique reference number
const generateReferenceNumber = () => {
    const year = new Date().getFullYear();

    const uniqueCode = crypto
        .randomBytes(5)
        .toString("hex")
        .toUpperCase();

    return `CMK-${year}-${uniqueCode}`;
};


// BACKGROUND AI ANALYSIS
const processGrievanceAI = async ({
    grievanceId,
    district,
    subject,
    description
}) => {
    try {
        console.log(
            `BACKGROUND AI: Starting analysis for grievance ${grievanceId}`
        );

        // Retrieve available departments
        const [departments] = await pool.execute(
            "SELECT id, name FROM departments"
        );

        // Analyze grievance using Gemini
        const aiAnalysis = await analyzeGrievance({
            district,
            subject,
            description,
            departments
        });

        // Update existing grievance with AI results
        await pool.execute(
            `UPDATE grievances
             SET
                priority = ?,
                ai_department_id = ?,
                ai_category = ?,
                ai_summary = ?,
                ai_suggestion = ?,
                ai_status = ?
             WHERE id = ?`,
            [
                aiAnalysis.priority,
                aiAnalysis.department_id,
                aiAnalysis.category,
                aiAnalysis.summary,
                JSON.stringify(aiAnalysis),
                "COMPLETED",
                grievanceId
            ]
        );

        console.log(
            `BACKGROUND AI: Analysis completed for grievance ${grievanceId}`
        );

    } catch (error) {
        console.error(
            `BACKGROUND AI: Analysis failed for grievance ${grievanceId}:`,
            error.message
        );

        try {
            await pool.execute(
                `UPDATE grievances
                 SET ai_status = ?
                 WHERE id = ?`,
                ["FAILED", grievanceId]
            );
        } catch (updateError) {
            console.error(
                "BACKGROUND AI: Unable to update AI status:",
                updateError.message
            );
        }
    }
};


// SUBMIT GRIEVANCE
exports.submitGrievance = async (req, res) => {

    let connection;

    try {
        console.log("STEP 1: Grievance submission request received.");

        const {
            district,
            category,
            subject,
            description
        } = req.body;

        // Validate required fields
        if (!district || !category || !subject || !description) {
            return res.status(400).json({
                success: false,
                message: "District, category, subject and description are required."
            });
        }

        if (
            typeof district !== "string" ||
            typeof category !== "string" ||
            typeof subject !== "string" ||
            typeof description !== "string" ||
            district.trim().length > 100 ||
            category.trim().length > 100 ||
            subject.trim().length > 255 ||
            description.trim().length < 10 ||
            description.trim().length > 10000
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide valid grievance details."
            });
        }

        console.log("STEP 2: Grievance details validated.");

        // Connect to database
        connection = await pool.getConnection();

        await connection.beginTransaction();

        const referenceNumber = generateReferenceNumber();

        // Insert grievance first. AI analysis is pending.
        const [result] = await connection.execute(
            `INSERT INTO grievances (
                reference_number,
                citizen_id,
                district,
                category,
                subject,
                description,
                status,
                priority,
                ai_department_id,
                ai_category,
                ai_summary,
                ai_suggestion,
                ai_reviewed,
                ai_status
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                referenceNumber,
                req.user.id,
                district.trim(),
                category.trim(),
                subject.trim(),
                description.trim(),
                "Submitted",
                "Medium",
                null,
                null,
                null,
                null,
                false,
                "PENDING"
            ]
        );

        const grievanceId = result.insertId;

        console.log("STEP 3: Grievance inserted. ID:", grievanceId);

        // Insert initial history
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
                null,
                "Submitted",
                "Grievance submitted by citizen.",
                req.user.id
            ]
        );

        console.log("STEP 4: Grievance history inserted.");

        // Save attachment details if uploaded
        if (req.file) {
            await connection.execute(
                `INSERT INTO attachments (
                    grievance_id,
                    uploaded_by,
                    original_filename,
                    stored_filename,
                    file_path,
                    file_type
                )
                VALUES (?, ?, ?, ?, ?, ?)`,
                [
                    grievanceId,
                    req.user.id,
                    req.file.originalname,
                    req.file.filename,
                    req.file.path,
                    req.file.mimetype
                ]
            );

            console.log("STEP 5: Attachment details inserted.");
        }

        // Commit grievance transaction
        await connection.commit();

        console.log("SUCCESS: Grievance saved in MySQL.");

        // Send success response immediately
        res.status(201).json({
            success: true,
            message: "Grievance submitted successfully. AI analysis is pending.",
            grievance: {
                id: grievanceId,
                reference_number: referenceNumber,
                status: "Submitted",
                priority: "Medium",
                ai_status: "PENDING",
                ai_analysis: null
            }
        });

        console.log("SUCCESS: Response sent to frontend.");

        // Start AI analysis after responding to the citizen
        setImmediate(() => {
            processGrievanceAI({
                grievanceId,
                district: district.trim(),
                subject: subject.trim(),
                description: description.trim()
            });
        });

    } catch (error) {

        if (connection) {
            await connection.rollback();
        }

        if (req.file) {
            const fs = require("fs");

            fs.unlink(req.file.path, () => { });
        }

        console.error("GRIEVANCE SUBMISSION ERROR:", error);

        if (!res.headersSent) {
            return res.status(500).json({
                success: false,
                message: "Unable to submit grievance."
            });
        }

    } finally {
        if (connection) {
            connection.release();
        }
    }
};



// GET CITIZEN'S GRIEVANCES
exports.getMyGrievances = async (req, res) => {
    try {
        const [grievances] = await pool.execute(
            `SELECT
                g.id,
                g.reference_number,
                g.district,
                g.category,
                g.subject,
                g.description,
                g.status,
                g.priority,
                g.ai_status,
                g.ai_category,
                g.ai_summary,
                g.created_at,
                d.name AS assigned_department,
                ai_dept.name AS ai_suggested_department
             FROM grievances g
             LEFT JOIN department_assignments da
                ON da.grievance_id = g.id
                AND da.id = (
                    SELECT MAX(da2.id)
                    FROM department_assignments da2
                    WHERE da2.grievance_id = g.id
                )
             LEFT JOIN departments d
                ON d.id = da.department_id
             LEFT JOIN departments ai_dept
                ON ai_dept.id = g.ai_department_id
             WHERE g.citizen_id = ?
             ORDER BY g.created_at DESC`,
            [req.user.id]
        );

        return res.status(200).json({
            success: true,
            count: grievances.length,
            grievances
        });

    } catch (error) {
        console.error("GET GRIEVANCES ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to retrieve grievances."
        });
    }
};



// TRACK GRIEVANCE
exports.trackGrievance = async (req, res) => {
    try {
        const { referenceNumber } = req.params;

        const [grievances] = await pool.execute(
            `SELECT
                g.id,
                g.reference_number,
                g.district,
                g.category,
                g.subject,
                g.status,
                g.priority,
                g.created_at,
                d.name AS assigned_department
             FROM grievances g
             LEFT JOIN department_assignments da
                ON da.grievance_id = g.id
             LEFT JOIN departments d
                ON d.id = da.department_id
             WHERE g.reference_number = ?
             ORDER BY da.assigned_at DESC
             LIMIT 1`,
            [referenceNumber]
        );

        if (grievances.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Grievance not found."
            });
        }

        const grievance = grievances[0];

        const [history] = await pool.execute(
            `SELECT
                new_status,
                remarks,
                changed_at
             FROM grievance_history
             WHERE grievance_id = ?
             ORDER BY changed_at ASC, id ASC`,
            [grievance.id]
        );

        return res.status(200).json({
            success: true,
            grievance: {
                ...grievance,
                history
            }
        });

    } catch (error) {
        console.error("TRACK GRIEVANCE ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to track grievance."
        });
    }
};


// SUBMIT CITIZEN FEEDBACK
exports.submitCitizenFeedback = async (req, res) => {
    try {
        const { grievanceId } = req.params;
        const { rating, comments } = req.body;

        // Only citizens can submit feedback
        if (req.user.role !== "CITIZEN") {
            return res.status(403).json({
                success: false,
                message: "Only citizens can submit feedback."
            });
        }

        // Validate rating
        if (
            !Number.isInteger(rating) ||
            rating < 1 ||
            rating > 5
        ) {
            return res.status(400).json({
                success: false,
                message: "Rating must be an integer between 1 and 5."
            });
        }

        // Validate optional comments
        if (
            comments !== undefined &&
            comments !== null &&
            (
                typeof comments !== "string" ||
                comments.trim().length > 2000
            )
        ) {
            return res.status(400).json({
                success: false,
                message: "Comments must be text and cannot exceed 2000 characters."
            });
        }

        // Verify grievance ownership and resolution
        const [grievances] = await pool.execute(
            `SELECT id, status
             FROM grievances
             WHERE id = ? AND citizen_id = ?`,
            [grievanceId, req.user.id]
        );

        if (grievances.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Grievance not found."
            });
        }

        if (grievances[0].status !== "Resolved") {
            return res.status(400).json({
                success: false,
                message: "Feedback can only be submitted for resolved grievances."
            });
        }

        // Save feedback
        await pool.execute(
            `INSERT INTO citizen_feedback
                (grievance_id, citizen_id, rating, comments)
             VALUES (?, ?, ?, ?)`,
            [
                grievanceId,
                req.user.id,
                rating,
                comments ? comments.trim() : null
            ]
        );

        return res.status(201).json({
            success: true,
            message: "Feedback submitted successfully."
        });

    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                success: false,
                message: "Feedback has already been submitted for this grievance."
            });
        }

        console.error("SUBMIT CITIZEN FEEDBACK ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to submit feedback."
        });
    }
};

