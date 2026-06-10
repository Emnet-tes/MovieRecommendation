import { useRouter } from "next/navigation";
import React from "react";
import FavoriteButton from "../components/favorite-button"; // Adjust the import path as necessary
import Image from "next/image";

interface Movie {
  _id: string;
  title: string;
  posterPath: string;
  voteAverage: number;
  releaseDate: string;
}

const MovieCard = ({ movie }: { movie: Movie }) => {
    const router = useRouter();
  return (
     <div
      className="group w-full max-w-[220px] cursor-pointer transition-transform duration-300 hover:-translate-y-1 hover:scale-[1.02]"
      onClick={() => router.push(`/movies/${movie._id}`)}
    >
       <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_24px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl transition duration-300 group-hover:border-white/20">
      <div className="relative aspect-[2/3]">
        <Image
          src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
          width={200}
          height={300}
          alt={movie.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
         {/* Favorite Button */}
          <div className="absolute right-3 top-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <FavoriteButton movieId={movie._id} movieTitle={movie.title} moviePosterPath={movie.posterPath} size="sm" />
          </div>

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/70 to-transparent px-4 py-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <h3 className="text-base font-semibold text-white truncate">
            {movie.title}
          </h3>
          <p className="text-xs text-gray-300">
            ⭐ {movie.voteAverage.toFixed(1)} · {movie.releaseDate.slice(0, 4)}
          </p>
        </div>
      </div>
    </div> 
    </div>
    
  );
};

export default MovieCard;
