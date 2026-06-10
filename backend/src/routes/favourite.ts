import { Router } from "express"
import { authenticateToken } from "../middleware/auth"
import {
  getUserFavorites,
  addToFavorites,
  removeFromFavorites,
  checkFavoriteStatus,
} from "../controllers/favoriteController"

const router: Router = Router()

// Apply authentication middleware to all routes
router.use(authenticateToken)

// GET /api/favorites - Get all favorites for authenticated user
router.get("/", getUserFavorites)

// POST /api/favorites - Add a movie to favorites
router.post("/", addToFavorites)

// DELETE /api/favorites/:movieId - Remove from favorites
router.delete("/:movieId", removeFromFavorites)

// GET /api/favorites/:movieId - Check if favorited
router.get("/:movieId", checkFavoriteStatus)

export default router
