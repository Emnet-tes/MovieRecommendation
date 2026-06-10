"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkFavoriteStatus = exports.removeFromFavorites = exports.addToFavorites = exports.getUserFavorites = void 0;
const favorities_js_1 = __importDefault(require("../models/favorities.js"));
// Helper function to convert IFavorite to FavoriteResponse
const toFavoriteResponse = (favorite) => ({
    _id: favorite._id.toString(),
    userId: favorite.userId,
    movieId: favorite.movieId,
    movieTitle: favorite.movieTitle,
    moviePosterPath: favorite.moviePosterPath,
    createdAt: favorite.createdAt,
});
// Get all favorites for a user
const getUserFavorites = async (req, res) => {
    try {
        // Get userId from authenticated user
        const userId = req.user?.sub;
        if (!userId) {
            res.status(400).json({
                success: false,
                error: "User ID not found in token",
            });
            return;
        }
        const favorites = await favorities_js_1.default.find({ userId }).sort({ createdAt: -1 });
        const favoriteResponses = favorites.map(toFavoriteResponse);
        res.status(200).json({
            success: true,
            data: favoriteResponses,
        });
    }
    catch (error) {
        console.error("Error fetching favorites:", error);
        res.status(500).json({
            success: false,
            error: "Failed to fetch favorites",
        });
    }
};
exports.getUserFavorites = getUserFavorites;
// Add a movie to favorites
const addToFavorites = async (req, res) => {
    try {
        // Get userId from authenticated user instead of request body
        const userId = req.user?.sub;
        const { movieId, movieTitle, moviePosterPath } = req.body;
        if (!userId) {
            res.status(400).json({
                success: false,
                error: "User ID not found in token",
            });
            return;
        }
        if (!movieId || !movieTitle || !moviePosterPath) {
            res.status(400).json({
                success: false,
                error: "Missing required fields",
            });
            return;
        }
        // Check if already favorited
        const existingFavorite = await favorities_js_1.default.findOne({ userId, movieId });
        if (existingFavorite) {
            res.status(409).json({
                success: false,
                error: "Movie already in favorites",
            });
            return;
        }
        const favorite = new favorities_js_1.default({
            userId,
            movieId,
            movieTitle,
            moviePosterPath,
        });
        const savedFavorite = await favorite.save();
        res.status(201).json({
            success: true,
            message: "Added to favorites",
            data: toFavoriteResponse(savedFavorite),
        });
    }
    catch (error) {
        console.error("Error adding to favorites:", error);
        res.status(500).json({
            success: false,
            error: "Failed to add to favorites",
        });
    }
};
exports.addToFavorites = addToFavorites;
// Remove a movie from favorites
const removeFromFavorites = async (req, res) => {
    try {
        // Get userId from authenticated user
        const userId = req.user?.sub;
        const { movieId } = req.params;
        if (!userId) {
            res.status(400).json({
                success: false,
                error: "User ID not found in token",
            });
            return;
        }
        if (!movieId) {
            res.status(400).json({
                success: false,
                error: "Movie ID is required",
            });
            return;
        }
        const deletedFavorite = await favorities_js_1.default.findOneAndDelete({ userId, movieId });
        if (!deletedFavorite) {
            res.status(404).json({
                success: false,
                error: "Favorite not found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Removed from favorites",
        });
    }
    catch (error) {
        console.error("Error removing from favorites:", error);
        res.status(500).json({
            success: false,
            error: "Failed to remove from favorites",
        });
    }
};
exports.removeFromFavorites = removeFromFavorites;
// Check if a movie is favorited by user
const checkFavoriteStatus = async (req, res) => {
    try {
        // Get userId from authenticated user
        const userId = req.user?.sub;
        const { movieId } = req.params;
        if (!userId) {
            res.status(400).json({
                success: false,
                error: "User ID not found in token",
            });
            return;
        }
        if (!movieId) {
            res.status(400).json({
                success: false,
                error: "Movie ID is required",
            });
            return;
        }
        const favorite = await favorities_js_1.default.findOne({ userId, movieId });
        res.status(200).json({
            success: true,
            data: { isFavorite: !!favorite },
        });
    }
    catch (error) {
        console.error("Error checking favorite status:", error);
        res.status(500).json({
            success: false,
            error: "Failed to check favorite status",
        });
    }
};
exports.checkFavoriteStatus = checkFavoriteStatus;
