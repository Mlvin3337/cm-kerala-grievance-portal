
const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const getSSLConfig = () => {
    if (process.env.DB_SSL !== "true") {
        return undefined;
    }

    const ca = process.env.DB_SSL_CA
        ? process.env.DB_SSL_CA.replace(/\\n/g, "\n")
        : fs.readFileSync(
            path.resolve(__dirname, "../../isrgrootx1.pem"),
            "utf8"
        );

    return {
        ca,
        rejectUnauthorized: true
    };
};

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT) || 3306,

    ssl: getSSLConfig(),

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const testConnection = async () => {
    try {
        const connection = await pool.getConnection();

        console.log("MySQL database connected successfully!");

        connection.release();
    } catch (error) {
        console.error("MySQL connection failed:", error.message);
        throw error;
    }
};

module.exports = { pool, testConnection };
