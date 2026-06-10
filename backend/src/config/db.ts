import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // Log whether MONGODB_URI is present (mask credentials for safety)
    const rawUri = process.env.MONGODB_URI || "";
    if (rawUri) {
      // Mask credentials: replace between '//' and '@' with '***'
      const masked = rawUri.replace(/:\/\/(.*)@/, "//***@");
      console.log(`Mongo URI loaded: ${masked}`);
    } else {
      console.log("Mongo URI not set in environment");
    }

    await mongoose.connect(rawUri!);
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("MongoDB error:", (error as Error).message);
    process.exit(1);
  }
};

export default connectDB;
