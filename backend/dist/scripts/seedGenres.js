"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const Genre_1 = __importDefault(require("../models/Genre"));
dotenv_1.default.config();
const genres = [
    { genreId: 28, name: "Action" },
    { genreId: 12, name: "Adventure" },
    { genreId: 16, name: "Animation" },
    { genreId: 35, name: "Comedy" },
    { genreId: 80, name: "Crime" },
    { genreId: 99, name: "Documentary" },
    { genreId: 18, name: "Drama" },
    { genreId: 10751, name: "Family" },
    { genreId: 14, name: "Fantasy" },
    { genreId: 36, name: "History" },
    { genreId: 27, name: "Horror" },
    { genreId: 10402, name: "Music" },
    { genreId: 9648, name: "Mystery" },
    { genreId: 10749, name: "Romance" },
    { genreId: 878, name: "Science Fiction" },
    { genreId: 10770, name: "TV Movie" },
    { genreId: 53, name: "Thriller" },
    { genreId: 10752, name: "War" },
    { genreId: 37, name: "Western" },
];
const seedGenres = async () => {
    await mongoose_1.default.connect(process.env.MONGODB_URI);
    await Genre_1.default.deleteMany();
    await Genre_1.default.insertMany(genres);
    console.log("✅ Genres seeded");
    process.exit(0);
};
seedGenres();
