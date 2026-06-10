import mongoose, { type Document, Schema, type Types } from "mongoose"

export interface IFavorite extends Document {
  _id: Types.ObjectId
  userId: string
  movieId: string
  movieTitle: string
  moviePosterPath: string
  createdAt: Date
}

const favoriteSchema: Schema<IFavorite> = new Schema({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  movieId: {
    type: String,
    required: true,
    index: true,
  },
  movieTitle: {
    type: String,
    required: true,
  },
  moviePosterPath: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// Compound index to ensure a user can't favorite the same movie twice
favoriteSchema.index({ userId: 1, movieId: 1 }, { unique: true })

const Favorite = mongoose.models.Favorite || mongoose.model<IFavorite>("Favorite", favoriteSchema)

export default Favorite
