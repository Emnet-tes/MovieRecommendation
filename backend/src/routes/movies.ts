import { Router } from "express";
import mongoose, { Schema } from "mongoose";
import { mapGenresToMoodIds } from "../utils/genreToMoodMapper";

const MoodSchema = new Schema({
  name: { type: String, required: true },
  genreIds: [Number],
});

const GenreSchema = new Schema({
  genreId: { type: Number, required: true },
  name: { type: String, required: true },
});

const MovieSchema = new Schema({
  movieId: { type: Number, unique: true },
  title: String,
  originalTitle: String,
  overview: String,
  posterPath: String,
  backdropPath: String,
  releaseDate: String,
  runtime: Number,
  popularity: Number,
  voteAverage: Number,
  voteCount: Number,
  trailerKey: String,
  genres: [{ type: Schema.Types.ObjectId, ref: "Genre" }],
  moods: [{ type: Schema.Types.ObjectId, ref: "Mood" }],
});

const Mood = mongoose.models.Mood || mongoose.model("Mood", MoodSchema);
const Genre = mongoose.models.Genre || mongoose.model("Genre", GenreSchema);
const Movie = mongoose.models.Movie || mongoose.model("Movie", MovieSchema);

const router = Router();

const saveMovie = async (req: any, res: any) => {
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

const getMoviesByMood = async (req: any, res: any) => {
  try {
    const moodQuery = req.query.mood as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;
    const filter: Record<string, unknown> = {};

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

const getMovieById = async (req: any, res: any) => {
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

router.post("/", saveMovie);
router.get("/", getMoviesByMood);
router.get("/:id", getMovieById);

export default router;
