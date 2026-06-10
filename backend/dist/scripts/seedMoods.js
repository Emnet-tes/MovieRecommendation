"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const Mood_1 = __importDefault(require("../models/Mood"));
dotenv_1.default.config();
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
        await mongoose_1.default.connect(process.env.MONGODB_URI);
        await Mood_1.default.deleteMany({});
        await Mood_1.default.insertMany(moods);
        console.log("✅ Moods seeded!");
        process.exit(0);
    }
    catch (err) {
        console.error("❌ Error seeding moods:", err);
        process.exit(1);
    }
};
seedMoods();
