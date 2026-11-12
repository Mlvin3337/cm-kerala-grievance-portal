require("dotenv").config();

const bcrypt = require("bcryptjs");
const { pool } = require("./config/db");

const createAdmin = async () => {
    try {
        const email = "cmo@cmkerala.test";
        const password = "Admin@123";

        const [existing] = await pool.execute(
            "SELECT id FROM users WHERE email = ?",
            [email]
        );

        if (existing.length > 0) {
            console.log("CMO administrator already exists.");
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        await pool.execute(
            `INSERT INTO users
            (name, email, mobile, password, role)
            VALUES (?, ?, ?, ?, 'CMO_ADMIN')`,
            [
                "CMO Administrator",
                email,
                "9000000000",
                hashedPassword
            ]
        );

        console.log("CMO administrator created successfully.");

    } catch (error) {
        console.error("Admin creation failed:", error);
    } finally {
        await pool.end();
    }
};

createAdmin();