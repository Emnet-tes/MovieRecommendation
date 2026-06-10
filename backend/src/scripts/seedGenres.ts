import mongoose from "mongoose";
import dotenv from "dotenv";
import Genre from "../models/Genre";

dotenv.config();

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
  await mongoose.connect(process.env.MONGODB_URI!);
  await Genre.deleteMany();
  await Genre.insertMany(genres);
  console.log("✅ Genres seeded");
  process.exit(0);
};

seedGenres();
