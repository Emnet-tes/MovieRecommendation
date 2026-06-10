import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Routes
import movieRoutes from "./routes/movies";
import moodRoutes from "./routes/moods";
import favouriteRoutes from "./routes/favourite"
import authRoutes from "./routes/auth";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/movies", movieRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/moods", moodRoutes);
app.use("/api/favourite", favouriteRoutes);

export default app;
