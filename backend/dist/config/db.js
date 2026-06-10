"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    try {
        // Log whether MONGODB_URI is present (mask credentials for safety)
        const rawUri = process.env.MONGODB_URI || "";
        if (rawUri) {
            // Mask credentials: replace between '//' and '@' with '***'
            const masked = rawUri.replace(/:\/\/(.*)@/, "//***@");
            console.log(`Mongo URI loaded: ${masked}`);
        }
        else {
            console.log("Mongo URI not set in environment");
        }
        await mongoose_1.default.connect(rawUri);
        console.log("✅ MongoDB Connected");
    }
    catch (error) {
        console.error("MongoDB error:", error.message);
        process.exit(1);
    }
};
exports.default = connectDB;
