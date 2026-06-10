"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mongoose_1 = __importStar(require("mongoose"));
const genreToMoodMapper_1 = require("../utils/genreToMoodMapper");
const MoodSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    genreIds: [Number],
});
const GenreSchema = new mongoose_1.Schema({
    genreId: { type: Number, required: true },
    name: { type: String, required: true },
});
const MovieSchema = new mongoose_1.Schema({
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
    genres: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Genre" }],
    moods: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Mood" }],
});
const Mood = mongoose_1.default.models.Mood || mongoose_1.default.model("Mood", MoodSchema);
const Genre = mongoose_1.default.models.Genre || mongoose_1.default.model("Genre", GenreSchema);
const Movie = mongoose_1.default.models.Movie || mongoose_1.default.model("Movie", MovieSchema);
const router = (0, express_1.Router)();
const saveMovie = async (req, res) => {
    try {
        const { movieId, title, originalTitle, overview, posterPath, backdropPath, releaseDate, runtime, popularity, voteAverage, voteCount, trailerKey, genres, } = req.body;
        const exists = await Movie.findOne({ movieId });
        if (exists)
            return res.status(200).json({ message: "Already exists" });
        const genreIds = req.body.tmdbGenreIds;
        const moodIds = await (0, genreToMoodMapper_1.mapGenresToMoodIds)(genreIds);
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
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
const getMoviesByMood = async (req, res) => {
    try {
        const moodQuery = req.query.mood;
        const page = parseInt(req.query.page) || 1;
        const limit = 20;
        const skip = (page - 1) * limit;
        const filter = {};
        if (moodQuery) {
            const mood = await Mood.findOne({ name: moodQuery.toLowerCase() });
            if (!mood)
                return res.status(404).json({ message: "Mood not found" });
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
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
const getMovieById = async (req, res) => {
    try {
        const { id } = req.params;
        const movie = await Movie.findById(id).populate("genres moods");
        if (!movie) {
            return res.status(404).json({ message: "Movie not found" });
        }
        res.json(movie);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
router.post("/", saveMovie);
router.get("/", getMoviesByMood);
router.get("/:id", getMovieById);
exports.default = router;
