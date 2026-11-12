const { pool } = require("../config/db");

// GET ALL DEPARTMENTS
exports.getDepartments = async (req, res) => {
    try {
        const [departments] = await pool.execute(
            `SELECT id, name, description
             FROM departments
             ORDER BY name ASC`
        );

        res.status(200).json({
            success: true,
            count: departments.length,
            departments
        });

    } catch (error) {
        console.error("Department error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to retrieve departments"
        });
    }
};

// GET SINGLE DEPARTMENT
exports.getDepartmentById = async (req, res) => {
    try {
        const { id } = req.params;

        const [departments] = await pool.execute(
            `SELECT id, name, description
             FROM departments
             WHERE id = ?`,
            [id]
        );

        if (departments.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Department not found"
            });
        }

        res.status(200).json({
            success: true,
            department: departments[0]
        });

    } catch (error) {
        console.error("Department error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to retrieve department"
        });
    }
};