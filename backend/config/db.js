
const mongoose = require("mongoose");

const connectDB = async () => {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
        throw new Error("MONGO_URI is not configured.");
    }

    try {
        const conn = await mongoose.connect(mongoUri);
        console.log(`MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
        return conn;
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        throw error;
    }
};

module.exports = connectDB;
