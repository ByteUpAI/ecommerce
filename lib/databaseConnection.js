import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGODB_URI;

if (!MONGODB_URL) {
    throw new Error("Missing MONGODB_URI environment variable");
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = {
        conn: null,
        promise: null,
    };
}

export const connectDB = async () => {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        cached.promise = mongoose
            .connect(MONGODB_URL, {
                dbName: "YT-NEXTJS-ECOMMERCE",
                bufferCommands: false,
            })
            .then((conn) => {
                console.info("✅ MongoDB connected successfully");
                return conn;
            })
            .catch((error) => {
                cached.promise = null;
                console.error("❌ MongoDB connection error:", error);
                throw new Error("Failed to connect to MongoDB");
            });
    }

    cached.conn = await cached.promise;
    return cached.conn;
};