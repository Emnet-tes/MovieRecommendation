"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMovieById = exports.getMoviesByMood = exports.saveMovie = void 0;
const genreToMoodMapper_1 = require("../utils/genreToMoodMapper");
const Movie_1 = __importDefault(require("../models/Movie"));
const Genre_1 = __importDefault(require("../models/Genre"));
const Mood_1 = __importDefault(require("../models/Mood"));
const saveMovie = async (req, res) => {
    try {
        const { movieId, title, originalTitle, overview, posterPath, backdropPath, releaseDate, runtime, popularity, voteAverage, voteCount, trailerKey, genres, } = req.body;
        const exists = await Movie_1.default.findOne({ movieId });
        if (exists)
            return res.status(200).json({ message: "Already exists" });
        // ✅ Map to mood ObjectIds
        const genreIds = req.body.tmdbGenreIds;
        const moodIds = await (0, genreToMoodMapper_1.mapGenresToMoodIds)(genreIds);
        const newMovie = new Movie_1.default({
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
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.saveMovie = saveMovie;
const getMoviesByMood = async (req, res) => {
    try {
        Genre_1.default.modelName;
        const moodQuery = req.query.mood;
        const page = parseInt(req.query.page) || 1;
        const limit = 20;
        const skip = (page - 1) * limit;
        let filter = {};
        if (moodQuery) {
            const mood = await Mood_1.default.findOne({ name: moodQuery.toLowerCase() });
            if (!mood)
                return res.status(404).json({ message: "Mood not found" });
            filter.moods = mood._id;
        }
        const totalMovies = await Movie_1.default.countDocuments(filter);
        const totalPages = Math.ceil(totalMovies / limit);
        const movies = await Movie_1.default.find(filter)
            .populate("genres moods")
            .skip(skip)
            .limit(limit);
        res.json({
            page,
            totalPages,
            totalResults: totalMovies,
            results: movies,
        });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.getMoviesByMood = getMoviesByMood;
const getMovieById = async (req, res) => {
    try {
        const { id } = req.params;
        const movie = await Movie_1.default.findById(id).populate("genres moods");
        if (!movie) {
            return res.status(404).json({ message: "Movie not found" });
        }
        res.json(movie);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.getMovieById = getMovieById;
