import dotenv from "dotenv";
import mongoose from "mongoose";
import Mood from "../models/Mood";

dotenv.config();

const moods = [
  { name: "happy", genreIds: [35, 10751, 10402] }, // Comedy, Family, Music
  { name: "sad", genreIds: [18, 10752] }, // Drama, War
  { name: "excited", genreIds: [28, 12, 878, 14] }, // Action, Adventure, Sci-Fi, Fantasy
  { name: "scared", genreIds: [27, 80, 53, 9648] }, // Horror, Crime, Thriller, Mystery
  { name: "relaxed", genreIds: [99, 10770] }, // Documentary, TV Movie
  { name: "nostalgic", genreIds: [16, 36, 37] }, // Animation, History, Western
];

const seedMoods = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    await Mood.deleteMany({});
    await Mood.insertMany(moods);
    console.log("✅ Moods seeded!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding moods:", err);
    process.exit(1);
  }
};

seedMoods();
