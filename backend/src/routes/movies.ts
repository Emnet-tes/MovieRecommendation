import { Router } from "express";
import Mood from "../Models/Mood";
import Movie from "../Models/Movie";
import Genre from "../Models/Genre";
import { mapGenresToMoodIds } from "../utils/genreToMoodMapper";

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
    Genre.modelName;
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
