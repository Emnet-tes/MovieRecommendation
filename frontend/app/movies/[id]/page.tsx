"use client";

import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/app/hooks/useRedux";
import { fetchMovieById } from "@/lib/feauters/movie/movieSlice";
import FavoriteButton from "@/app/components/favorite-button";
import TrailerModal from "@/app/components/trailer-modal";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";


const formatRuntime = (runtime: number): string => {
  if (!runtime || isNaN(runtime)) return "N/A";
  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;
  if (hours === 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
};

const MovieDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const {
    selectedMovie: movie,
    loading,
    error,
  } = useAppSelector((state) => state.movies);

  useEffect(() => {
    const movieId = typeof params.id === "string" ? params.id : params.id?.[0];
    if (movieId) {
      dispatch(fetchMovieById(movieId));
    }
  }, [dispatch, params.id]);

  if (loading || !movie) {
    return (
      <div className="min-h-screen bg-gray-800 flex items-center justify-center text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading Movie...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-800 flex items-center justify-center text-red-400">
        Failed to load movie: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-800 px-6 pt-28 pb-12 text-white sm:pt-32">
      <div className="mx-auto mb-6 max-w-5xl">
        <Button
          onClick={() => router.back()}
          variant="ghost"
          className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-white/80 hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to movies
        </Button>
      </div>
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10">
        <div className="relative">
          <Image
            src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
            width={200}
            height={300}
            alt={movie.title}
            className="rounded-lg shadow-lg w-full"
          />
          <div className="absolute top-4 right-4">
            <FavoriteButton
              movieId={movie._id}
              movieTitle={movie.title}
              moviePosterPath={movie.posterPath}
              size="lg"
            />
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-2">{movie.title}</h1>
          <p className="text-gray-400 mb-4">{movie.releaseDate}</p>
          <p className="mb-4 text-lg">{movie.overview}</p>
          <p className="text-yellow-400 text-lg mb-2">
            ⭐ {movie.voteAverage} / 10
          </p>

          <div className="text-sm text-gray-400">
            <p>
              <strong>Runtime:</strong> {formatRuntime(movie.runtime)}
            </p>
            <p>
              <strong>Votes:</strong> {movie.voteCount}
            </p>
            <p>
              <strong>Genres:</strong>{" "}
              {movie.genres.map((g) => g.name).join(", ")}
            </p>
            <p>
              <strong>Moods:</strong>{" "}
              {movie.moods.map((m) => m.name).join(", ")}
            </p>
          </div>

          <div className="my-4">
            {movie.trailerKey && (
              <TrailerModal
                videoId={movie.trailerKey}
                movieTitle={movie.title}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailPage;
