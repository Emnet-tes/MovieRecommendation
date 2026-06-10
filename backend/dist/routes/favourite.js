"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const favoriteController_1 = require("../Controllers/favoriteController");
const router = (0, express_1.Router)();
// Apply authentication middleware to all routes
router.use(auth_1.authenticateToken);
// GET /api/favorites - Get all favorites for authenticated user
router.get("/", favoriteController_1.getUserFavorites);
// POST /api/favorites - Add a movie to favorites
router.post("/", favoriteController_1.addToFavorites);
// DELETE /api/favorites/:movieId - Remove from favorites
router.delete("/:movieId", favoriteController_1.removeFromFavorites);
// GET /api/favorites/:movieId - Check if favorited
router.get("/:movieId", favoriteController_1.checkFavoriteStatus);
exports.default = router;
