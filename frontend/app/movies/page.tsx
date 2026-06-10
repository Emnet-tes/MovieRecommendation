"use client";

import { fetchMoviesByMood } from "@/lib/feauters/movie/movieSlice";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import { useAppDispatch, useAppSelector } from "../hooks/useRedux";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

function MoviesPageContent() {
  const searchParams = useSearchParams();
  const mood = searchParams.get("mood") || "";
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { movies, totalPages, loading } = useAppSelector(
    (state) => state.movies
  );
  const [currentPage, setCurrentPage] = useState(1);

  const getAuthToken = (): string | null => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("access_token");
    }
    return null;
  };

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      router.push("/signin");
      return;
    }

    if (mood) {
      dispatch(fetchMoviesByMood({ mood, page: currentPage }));
    }
  }, [mood, currentPage, dispatch, router]);

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  return (
    <div className="movie-page-shell pt-28 sm:pt-32">
      {loading ? (
        <div className="movie-surface mx-auto flex min-h-[320px] max-w-7xl items-center justify-center rounded-[2rem]">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-red-500"></div>
            <p className="text-white/60">Loading movies...</p>
          </div>
        </div>
      ) : movies.length === 0 ? (
        <div className="movie-surface mx-auto max-w-3xl rounded-[2rem] p-10 text-center">
          <p className="text-lg text-red-300">No movies found for this mood.</p>
          <Button
            onClick={() => router.push("/dashboard")}
            className="cursor-pointer mt-6 rounded-full bg-white/10 px-5 py-6 text-white hover:bg-white/15"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to moods
          </Button>
        </div>
      ) : (
        <>
          <div className="movie-surface mx-auto max-w-7xl rounded-[2rem] p-5 sm:p-7 lg:p-16">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <Button
                  onClick={() => router.push("/dashboard")}
                  variant="ghost"
                  className="cursor-pointer mb-4 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-white/80 hover:bg-white/10 hover:text-white"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to moods
                </Button>
                <div className="movie-chip w-fit">
                  <Sparkles className="h-4 w-4 text-amber-300" />
                  Mood-based recommendations
                </div>
                <h1 className="mt-4 text-3xl font-semibold capitalize md:text-4xl">
                  Movies for &quot;{mood}&quot;
                </h1>
              </div>
              <p className="max-w-md text-sm text-white/60">
                Page {currentPage} of {totalPages}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {movies.map((movie) => (
                <MovieCard key={movie._id} movie={movie} />
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={handlePrevious}
                disabled={currentPage === 1}
                className="rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm text-white transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-white/60">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm text-white transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function MoviesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MoviesPageContent />
    </Suspense>
  );
}
