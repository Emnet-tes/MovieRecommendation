import type { Request, Response } from "express"
import type { Types } from "mongoose"
import type { ApiResponse, FavoriteResponse, CheckFavoriteResponse } from "../types/api.js"
import Favorite, { IFavorite } from "../models/favorities.js"

// Helper function to convert IFavorite to FavoriteResponse
const toFavoriteResponse = (favorite: IFavorite): FavoriteResponse => ({
  _id: (favorite._id as Types.ObjectId).toString(),
  userId: favorite.userId,
  movieId: favorite.movieId,
  movieTitle: favorite.movieTitle,
  moviePosterPath: favorite.moviePosterPath,
  createdAt: favorite.createdAt,
})

// Get all favorites for a user
export const getUserFavorites = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get userId from authenticated user
    const userId = req.user?.sub

    if (!userId) {
      res.status(400).json({
        success: false,
        error: "User ID not found in token",
      } as ApiResponse)
      return
    }

    const favorites: IFavorite[] = await Favorite.find({ userId }).sort({ createdAt: -1 })
    const favoriteResponses: FavoriteResponse[] = favorites.map(toFavoriteResponse)

    res.status(200).json({
      success: true,
      data: favoriteResponses,
    } as ApiResponse<FavoriteResponse[]>)
  } catch (error) {
    console.error("Error fetching favorites:", error)
    res.status(500).json({
      success: false,
      error: "Failed to fetch favorites",
    } as ApiResponse)
  }
}

// Add a movie to favorites
export const addToFavorites = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get userId from authenticated user instead of request body
    const userId = req.user?.sub
    const { movieId, movieTitle, moviePosterPath } = req.body

    if (!userId) {
      res.status(400).json({
        success: false,
        error: "User ID not found in token",
      } as ApiResponse)
      return
    }

    if (!movieId || !movieTitle || !moviePosterPath) {
      res.status(400).json({
        success: false,
        error: "Missing required fields",
      } as ApiResponse)
      return
    }

    // Check if already favorited
    const existingFavorite: IFavorite | null = await Favorite.findOne({ userId, movieId })
    if (existingFavorite) {
      res.status(409).json({
        success: false,
        error: "Movie already in favorites",
      } as ApiResponse)
      return
    }

    const favorite: IFavorite = new Favorite({
      userId,
      movieId,
      movieTitle,
      moviePosterPath,
    })

    const savedFavorite = await favorite.save()

    res.status(201).json({
      success: true,
      message: "Added to favorites",
      data: toFavoriteResponse(savedFavorite),
    } as ApiResponse<FavoriteResponse>)
  } catch (error) {
    console.error("Error adding to favorites:", error)
    res.status(500).json({
      success: false,
      error: "Failed to add to favorites",
    } as ApiResponse)
  }
}

// Remove a movie from favorites
export const removeFromFavorites = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get userId from authenticated user
    const userId = req.user?.sub
    const { movieId } = req.params

    if (!userId) {
      res.status(400).json({
        success: false,
        error: "User ID not found in token",
      } as ApiResponse)
      return
    }

    if (!movieId) {
      res.status(400).json({
        success: false,
        error: "Movie ID is required",
      } as ApiResponse)
      return
    }

    const deletedFavorite: IFavorite | null = await Favorite.findOneAndDelete({ userId, movieId })

    if (!deletedFavorite) {
      res.status(404).json({
        success: false,
        error: "Favorite not found",
      } as ApiResponse)
      return
    }

    res.status(200).json({
      success: true,
      message: "Removed from favorites",
    } as ApiResponse)
  } catch (error) {
    console.error("Error removing from favorites:", error)
    res.status(500).json({
      success: false,
      error: "Failed to remove from favorites",
    } as ApiResponse)
  }
}

// Check if a movie is favorited by user
export const checkFavoriteStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get userId from authenticated user
    const userId = req.user?.sub
    const { movieId } = req.params

    if (!userId) {
      res.status(400).json({
        success: false,
        error: "User ID not found in token",
      } as ApiResponse)
      return
    }

    if (!movieId) {
      res.status(400).json({
        success: false,
        error: "Movie ID is required",
      } as ApiResponse)
      return
    }

    const favorite: IFavorite | null = await Favorite.findOne({ userId, movieId })

    res.status(200).json({
      success: true,
      data: { isFavorite: !!favorite },
    } as ApiResponse<CheckFavoriteResponse>)
  } catch (error) {
    console.error("Error checking favorite status:", error)
    res.status(500).json({
      success: false,
      error: "Failed to check favorite status",
    } as ApiResponse)
  }
}
