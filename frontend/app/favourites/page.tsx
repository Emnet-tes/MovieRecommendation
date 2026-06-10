"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Heart,
  Trash2,
  Search,
  Grid,
  List,
  Star,
  Calendar,
  Film,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FavoriteButton from "../components/favorite-button";
import type { FavoriteResponse } from "../../types/api";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchFavourites,
  removeFavourite,
} from "@/lib/feauters/favourites/favouritesSlice";
import { RootState, AppDispatch } from "@/lib/store";

interface FavoriteMovie extends FavoriteResponse {
  voteAverage?: number;
  releaseDate?: string;
  runtime?: number;
  genres?: string[];
}

// Fade-up on scroll into view
function FadeUp({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0px)" : "translateY(32px)",
        transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-white/50 backdrop-blur-md">
      {children}
    </span>
  );
}

export default function FavoritesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const router = useRouter();

  const dispatch: AppDispatch = useDispatch();
  const { favourites, loading } = useSelector(
    (state: RootState) => state.favourites
  );

  useEffect(() => {
    dispatch(fetchFavourites());
  }, [dispatch]);

  const filteredFavorites = (() => {
    const filtered = favourites
      .map((fav) => ({
        ...fav,
        voteAverage: (fav as FavoriteMovie).voteAverage ?? undefined,
        releaseDate: (fav as FavoriteMovie).releaseDate ?? undefined,
        runtime: (fav as FavoriteMovie).runtime ?? undefined,
        genres: (fav as FavoriteMovie).genres ?? undefined,
      }))
      .filter((movie) =>
        movie.movieTitle.toLowerCase().includes(searchQuery.toLowerCase())
      );

    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "oldest":
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case "title":
        filtered.sort((a, b) => a.movieTitle.localeCompare(b.movieTitle));
        break;
      case "rating":
        filtered.sort((a, b) => (b.voteAverage || 0) - (a.voteAverage || 0));
        break;
    }
    return filtered;
  })();

  const handleRemoveFavorite = (movieId: string) => {
    dispatch(removeFavourite(movieId));
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0f]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-b-2 border-rose-500" />
          <p className="text-sm text-white/40">Loading your collection…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-24 text-white">

      {/* ── ambient glow ── */}
      <div
        className="pointer-events-none fixed left-1/2 top-0 h-72 w-96 -translate-x-1/2 rounded-full opacity-10 blur-[100px]"
        style={{ background: "radial-gradient(circle, #f43f5e, transparent)" }}
      />

      <div className="mx-auto max-w-7xl space-y-6 px-4 pb-14 sm:px-6 lg:px-12">

        {/* ── HEADER CARD ── */}
        <FadeUp delay={0}>
          <div
            className="rounded-[2rem] border border-white/5 bg-white/[0.03] p-6 backdrop-blur-xl sm:p-8 lg:p-10"
            style={{ boxShadow: "0 0 60px rgba(244,63,94,0.04) inset" }}
          >
            {/* title row */}
            <div className="mb-6 flex items-center gap-4">
              <div
                className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl shadow-lg shadow-rose-500/20"
                style={{
                  background: "linear-gradient(135deg, #e11d48 0%, #f97316 100%)",
                }}
              >
                <Heart className="h-5 w-5 fill-current text-white" />
              </div>
              <div>
                <SectionLabel>Your collection</SectionLabel>
                <h1
                  className="mt-2 text-2xl font-semibold md:text-3xl"
                  style={{ letterSpacing: "-0.01em" }}
                >
                  Favourites
                </h1>
                <p className="mt-1 text-sm text-white/40">
                  {favourites.length}{" "}
                  {favourites.length === 1 ? "movie" : "movies"} saved
                </p>
              </div>
            </div>

            {/* search + filters */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              {/* search */}
              <div className="relative max-w-sm flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                <Input
                  placeholder="Search your favourites…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-white/10 bg-white/5 pl-10 text-white placeholder-white/30 focus:border-rose-500/50 focus:ring-0"
                />
              </div>

              <div className="flex items-center gap-3">
                {/* sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40 border-white/10 bg-white/5 text-white/80">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-white/10 bg-[#111118] text-white">
                    <SelectItem value="newest">Newest first</SelectItem>
                    <SelectItem value="oldest">Oldest first</SelectItem>
                    <SelectItem value="title">Title A–Z</SelectItem>
                    <SelectItem value="rating">Highest rated</SelectItem>
                  </SelectContent>
                </Select>

                {/* view toggle */}
                <div className="flex rounded-xl border border-white/10 bg-white/5 p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`rounded-lg p-2 transition-colors ${
                      viewMode === "grid"
                        ? "bg-rose-500/80 text-white"
                        : "text-white/40 hover:text-white"
                    }`}
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`rounded-lg p-2 transition-colors ${
                      viewMode === "list"
                        ? "bg-rose-500/80 text-white"
                        : "text-white/40 hover:text-white"
                    }`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </FadeUp>

        {/* ── CONTENT ── */}
        {filteredFavorites.length === 0 ? (
          <FadeUp delay={0.1}>
            <div
              className="flex min-h-[420px] flex-col items-center justify-center rounded-[2rem] border border-white/5 bg-white/[0.02] text-center"
            >
              {searchQuery ? (
                <>
                  <Search className="mb-4 h-14 w-14 text-white/15" />
                  <h3 className="text-lg font-semibold text-white/60">No movies found</h3>
                  <p className="mt-1 text-sm text-white/30">Try adjusting your search</p>
                </>
              ) : (
                <>
                  <Film className="mb-4 h-14 w-14 text-white/15" />
                  <h3 className="text-lg font-semibold text-white/60">Nothing saved yet</h3>
                  <p className="mt-1 mb-6 text-sm text-white/30">
                    Add movies you love and they&apos;ll appear here
                  </p>
                  <Button
                    onClick={() => router.push("/dashboard")}
                    className="rounded-full px-6 py-5 font-medium text-white shadow-lg shadow-rose-500/20"
                    style={{
                      background: "linear-gradient(135deg, #e11d48 0%, #f97316 100%)",
                    }}
                  >
                    Discover movies
                  </Button>
                </>
              )}
            </div>
          </FadeUp>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {filteredFavorites.map((movie, i) => (
              <FadeUp key={movie.movieId} delay={i * 0.05}>
                <MovieCardGrid movie={movie as FavoriteMovie} onRemove={handleRemoveFavorite} />
              </FadeUp>
            ))}
          </div>
        ) : (
          <div
            className="rounded-[2rem] border border-white/5 bg-white/[0.03] p-4 backdrop-blur-xl sm:p-6"
          >
            <div className="space-y-3">
              {filteredFavorites.map((movie, i) => (
                <FadeUp key={movie.movieId} delay={i * 0.04}>
                  <MovieCardList movie={movie as FavoriteMovie} onRemove={handleRemoveFavorite} />
                </FadeUp>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Grid card ──
function MovieCardGrid({
  movie,
  onRemove,
}: {
  movie: FavoriteMovie;
  onRemove: (id: string) => void;
}) {
  const router = useRouter();

  return (
    <div className="group relative">
      <div
        className="cursor-pointer overflow-hidden rounded-2xl border border-white/8 bg-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-300 hover:-translate-y-2 hover:border-white/15 hover:shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
        onClick={() => router.push(`/movies/${movie.movieId}`)}
      >
        <div className="relative aspect-[2/3]">
          <Image
            src={`https://image.tmdb.org/t/p/w500${movie.moviePosterPath}`}
            alt={movie.movieTitle}
            width={300}
            height={450}
            className="h-full w-full object-cover"
          />

          {/* gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <h3 className="truncate text-sm font-semibold text-white">
                {movie.movieTitle}
              </h3>
              {movie.voteAverage && (
                <div className="mt-1 flex items-center gap-1">
                  <Star className="h-3 w-3 fill-current text-amber-400" />
                  <span className="text-xs text-white/70">
                    {movie.voteAverage.toFixed(1)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* remove button */}
          <div className="absolute right-2 top-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <button
              onClick={(e) => { e.stopPropagation(); onRemove(movie.movieId); }}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-rose-500/30 bg-rose-600/70 text-white backdrop-blur-sm transition-colors hover:bg-rose-600"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── List card ──
function MovieCardList({
  movie,
  onRemove,
}: {
  movie: FavoriteMovie;
  onRemove: (id: string) => void;
}) {
  const router = useRouter();

  return (
    <div
      className="group flex cursor-pointer items-center gap-4 rounded-2xl border border-white/5 bg-white/[0.03] p-3 transition-all duration-200 hover:border-white/10 hover:bg-white/[0.06]"
      onClick={() => router.push(`/movies/${movie.movieId}`)}
    >
      <Image
        src={`https://image.tmdb.org/t/p/w200${movie.moviePosterPath}`}
        alt={movie.movieTitle}
        width={80}
        height={120}
        className="h-20 w-14 flex-shrink-0 rounded-xl object-cover"
      />

      <div className="min-w-0 flex-1">
        <h3 className="truncate font-semibold text-white">{movie.movieTitle}</h3>
        <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-white/40">
          {movie.voteAverage && (
            <span className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-current text-amber-400" />
              {movie.voteAverage.toFixed(1)}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            Added {new Date(movie.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <FavoriteButton
          movieId={movie.movieId}
          movieTitle={movie.movieTitle}
          moviePosterPath={movie.moviePosterPath}
          size="sm"
        />
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(movie.movieId); }}
          className="flex h-8 w-8 items-center justify-center rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-400 transition-colors hover:bg-rose-500/80 hover:text-white"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}