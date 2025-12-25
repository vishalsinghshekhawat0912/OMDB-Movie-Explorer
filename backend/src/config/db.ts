import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config({ quiet: true, path: "../.env" });

const dbHost = process.env.DB_HOST;
const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;
const dbPort = process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306;

if (!dbHost || !dbName || !dbUser || !dbPass) {
    throw new Error("Database environment variables are not defined.");
}

// Create MySQL connection pool
const dbConnection = mysql.createPool({
    host: dbHost,
    user: dbUser,
    password: dbPass,
    database: dbName,
    port: dbPort,
    waitForConnections: true,
    connectionLimit: 10,   // same as Sequelize pool max
    queueLimit: 0
});

// Test the database connection
export const connectToDatabase = async () => {
    try {
        const connection = await dbConnection.getConnection();
        await connection.ping();
        connection.release();
    } catch (error) {
        console.error("MySQL connection failed:", error);
        throw error;
    }
};

export default dbConnection;