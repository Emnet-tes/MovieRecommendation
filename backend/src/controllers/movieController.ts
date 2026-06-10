import { Request, Response } from "express";
import { mapGenresToMoodIds } from "../utils/genreToMoodMapper";
import Movie from "../models/Movie";
import Genre from "../models/Genre";
import Mood from "../models/Mood";

export const saveMovie = async (req: Request, res: Response) => {
  try {
    const {
      movieId,
      title,
      originalTitle,
      overview,
      posterPath,
      backdropPath,
      releaseDate,
      runtime,
      popularity,
      voteAverage,
      voteCount,
      trailerKey,
      genres,
    } = req.body;

    const exists = await Movie.findOne({ movieId });
    if (exists) return res.status(200).json({ message: "Already exists" });

    // ✅ Map to mood ObjectIds
    const genreIds = req.body.tmdbGenreIds as number[];
    const moodIds = await mapGenresToMoodIds(genreIds);

    const newMovie = new Movie({
      movieId,
      title,
      originalTitle,
      overview,
      posterPath,
      backdropPath,
      releaseDate,
      runtime,
      popularity,
      voteAverage,
      voteCount,
      trailerKey,
      genres,
      moods: moodIds,
    });

    await newMovie.save();
    res.status(201).json({ message: "Movie saved to database." });
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

export const getMoviesByMood = async (req: Request, res: Response) => {
try {
Genre.modelName;
const moodQuery = req.query.mood as string;
const page = parseInt(req.query.page as string) || 1;
const limit = 20;
const skip = (page - 1) * limit;
let filter: Record<string, unknown> = {};

if (moodQuery) {
  const mood = await Mood.findOne({ name: moodQuery.toLowerCase() });
  if (!mood) return res.status(404).json({ message: "Mood not found" });
  filter.moods = mood._id;
}

const totalMovies = await Movie.countDocuments(filter);
const totalPages = Math.ceil(totalMovies / limit);

const movies = await Movie.find(filter)
  .populate("genres moods")
  .skip(skip)
  .limit(limit);

res.json({
  page,
  totalPages,
  totalResults: totalMovies,
  results: movies,
});
} catch (err) {
res.status(500).json({ message: (err as Error).message });
}
};

export const getMovieById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const movie = await Movie.findById(id).populate("genres moods");

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.json(movie);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};
