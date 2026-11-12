
require("dotenv").config();

const bcrypt = require("bcryptjs");
const { pool } = require("./config/db");

const createOfficer = async () => {
    try {
        const name = "PWD Department Officer";
        const email = "officer.pwd@cmkerala.test";
        const password = "Officer@123";
        const mobile = "9000000001";
        const departmentId = 1;

        const [existing] = await pool.execute(
            "SELECT id FROM users WHERE email = ?",
            [email]
        );

        if (existing.length > 0) {
            console.log("Department officer already exists.");
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        await pool.execute(
            `INSERT INTO users
            (name, email, mobile, password, role, department_id)
            VALUES (?, ?, ?, ?, 'DEPARTMENT_OFFICER', ?)`,
            [
                name,
                email,
                mobile,
                hashedPassword,
                departmentId
            ]
        );

        console.log("Department officer created successfully.");

    } catch (error) {
        console.error("Officer creation failed:", error);
    } finally {
        await pool.end();
    }
};

createOfficer();
