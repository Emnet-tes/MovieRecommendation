"use client";

import { JSX, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FaClock,
  FaGhost,
  FaGrinStars,
  FaSadTear,
  FaSmile,
  FaSpa,
} from "react-icons/fa";
import MovieHero from "../components/MovieHero";
import MovieCard from "../components/MovieCard";
import { fetchTrendingMovies } from "@/lib/feauters/movie/movieSlice";
import { useAppDispatch, useAppSelector } from "../hooks/useRedux";
import { fetchMoods } from "@/lib/feauters/mood/moodSlice";

const moodIcons: Record<string, JSX.Element> = {
  happy: <FaSmile className="text-yellow-400" />,
  sad: <FaSadTear className="text-blue-400" />,
  excited: <FaGrinStars className="text-pink-400" />,
  scared: <FaGhost className="text-purple-400" />,
  relaxed: <FaSpa className="text-green-400" />,
  nostalgic: <FaClock className="text-orange-300" />,
};

// Hook: triggers when element enters viewport
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

// Staggered child animation wrapper
function FadeUp({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, inView } = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0px)" : "translateY(40px)",
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

// Spotlight section label
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-white/50 backdrop-blur-md"
    >
      {children}
    </span>
  );
}

const Dashboard = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const filmStripRef = useRef<HTMLDivElement>(null);
  const [stripDragging, setStripDragging] = useState(false);
  const [stripStartX, setStripStartX] = useState(0);
  const [stripScrollLeft, setStripScrollLeft] = useState(0);

  const { trending, loading, fetchedTrending } = useAppSelector(
    (state) => state.movies
  );
  const { moods, loading: loadingMoods } = useAppSelector(
    (state) => state.moods
  );

  const getAuthToken = (): string | null => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("access_token");
    }
    return null;
  };

  const handleMoodClick = (mood: string) => {
    router.push(`/movies?mood=${mood}`);
  };

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      router.push("/signin");
      return;
    }
    if (!fetchedTrending) dispatch(fetchTrendingMovies());
    dispatch(fetchMoods());
  }, [dispatch, fetchedTrending, router]);

  // Film-strip drag scroll
  const onMouseDown = (e: React.MouseEvent) => {
    const el = filmStripRef.current;
    if (!el) return;
    setStripDragging(true);
    setStripStartX(e.pageX - el.offsetLeft);
    setStripScrollLeft(el.scrollLeft);
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!stripDragging || !filmStripRef.current) return;
    e.preventDefault();
    const x = e.pageX - filmStripRef.current.offsetLeft;
    filmStripRef.current.scrollLeft = stripScrollLeft - (x - stripStartX);
  };
  const stopDrag = () => setStripDragging(false);

  const { ref: moodRef, inView: moodInView } = useInView(0.1);
  const { ref: trendRef, inView: trendInView } = useInView(0.05);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white font-sans">

      {/* ── HERO ── */}
      <MovieHero />

      {/* ── DIVIDER: film-grain curtain drop ── */}
      <div className="relative h-20 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, transparent 0%, #0a0a0f 100%)",
          }}
        />
        {/* decorative sprocket holes */}
        <div className="absolute top-0 left-0 right-0 flex justify-between px-6">
          {Array.from({ length: 18 }).map((_, i) => (
            <div
              key={i}
              className="h-3 w-5 rounded-sm border border-white/10 bg-white/5"
            />
          ))}
        </div>
      </div>

      {/* ── MOOD SECTION ── */}
      <section
        ref={moodRef}
        className="relative px-4 pb-8 sm:px-6 lg:px-12 lg:pb-12"
      >
        {/* ambient glow */}
        <div
          className="pointer-events-none absolute -top-20 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full opacity-20 blur-[80px]"
          style={{ background: "radial-gradient(circle, #f43f5e, transparent)" }}
        />

        <div
          className="mx-auto max-w-7xl rounded-[2rem] border border-white/5 bg-white/[0.03] p-6 backdrop-blur-xl sm:p-8 lg:p-10"
          style={{
            boxShadow: "0 0 60px rgba(244,63,94,0.05) inset",
          }}
        >
          {/* header */}
          <FadeUp delay={0}>
            <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <SectionLabel>Pick a mood to begin</SectionLabel>
                <h2
                  className="mt-4 text-2xl font-semibold md:text-3xl"
                  style={{ letterSpacing: "-0.01em" }}
                >
                  How are you feeling?
                </h2>
                <p className="mt-2 max-w-lg text-sm text-white/50 md:text-base">
                  Each mood unlocks a curated collection tuned to where you are
                  right now.
                </p>
              </div>
            </div>
          </FadeUp>

          {loadingMoods ? (
            <div className="flex min-h-[260px] items-center justify-center rounded-[1.5rem] border border-white/5 bg-white/5">
              <div className="text-center">
                <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-b-2 border-rose-500" />
                <p className="text-sm text-white/40">Curating moods…</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
              {moods.map((mood, index) => (
                <FadeUp key={index} delay={moodInView ? index * 0.07 : 0}>
                  <button
                    onClick={() => handleMoodClick(mood)}
                    className="cursor-pointer group relative flex w-full flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl border border-white/8 bg-white/[0.04] px-4 py-7 text-center backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-rose-500/30 hover:bg-white/[0.07]"
                    style={{
                      boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
                    }}
                  >
                    {/* hover spotlight */}
                    <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      style={{ background: "radial-gradient(circle at 50% 30%, rgba(244,63,94,0.1), transparent 70%)" }}
                    />
                    <div className="text-3xl transition-transform duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
                      {moodIcons[mood] || <FaSmile className="text-white/80" />}
                    </div>
                    <span className="text-sm font-medium capitalize text-white/80 transition-colors duration-200 group-hover:text-white md:text-base">
                      {mood}
                    </span>
                  </button>
                </FadeUp>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── FILM STRIP SPROCKET DIVIDER ── */}
      <div className="relative my-2 flex items-center gap-0 overflow-hidden px-4 opacity-30">
        {Array.from({ length: 40 }).map((_, i) => (
          <div
            key={i}
            className="mx-0.5 h-4 w-6 flex-shrink-0 rounded-[3px] border border-white/20 bg-white/10"
          />
        ))}
      </div>

      {/* ── TRENDING SECTION ── */}
      <section
        ref={trendRef}
        className="relative px-4 pb-14 sm:px-6 lg:px-12"
      >
        {/* ambient glow */}
        <div
          className="pointer-events-none absolute top-0 right-0 h-72 w-72 rounded-full opacity-10 blur-[100px]"
          style={{ background: "radial-gradient(circle, #f59e0b, transparent)" }}
        />

        <div
          className="mx-auto max-w-7xl rounded-[2rem] border border-white/5 bg-white/[0.03] p-6 backdrop-blur-xl sm:p-8 lg:p-10"
          style={{ boxShadow: "0 0 60px rgba(251,191,36,0.03) inset" }}
        >
          <FadeUp delay={0}>
            <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <SectionLabel>
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                  Live · What everyone is watching
                </SectionLabel>
                <h2
                  className="mt-4 text-2xl font-semibold md:text-3xl"
                  style={{ letterSpacing: "-0.01em" }}
                >
                  Trending now
                </h2>
              </div>
              <p className="text-xs text-white/30">
                Drag to scroll →
              </p>
            </div>
          </FadeUp>

          {loading ? (
            <div className="flex min-h-[280px] items-center justify-center rounded-[1.5rem] border border-white/5 bg-white/5">
              <div className="text-center">
                <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-b-2 border-amber-400" />
                <p className="text-sm text-white/40">Loading the reel…</p>
              </div>
            </div>
          ) : (
            <>
              {/* Film-strip horizontal scroll */}
              <div
                ref={filmStripRef}
                className="flex gap-4 overflow-x-auto pb-4 xl:hidden"
                style={{
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                  cursor: stripDragging ? "grabbing" : "grab",
                }}
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={stopDrag}
                onMouseLeave={stopDrag}
              >
                {trending.map((movie, i) => (
                  <div
                    key={movie._id}
                    className="flex-shrink-0 w-40 sm:w-48"
                    style={{
                      opacity: trendInView ? 1 : 0,
                      transform: trendInView ? "translateX(0)" : "translateX(60px)",
                      transition: `opacity 0.6s ease ${i * 0.06}s, transform 0.6s ease ${i * 0.06}s`,
                    }}
                  >
                    <MovieCard movie={movie} />
                  </div>
                ))}
              </div>

              {/* Grid for xl screens */}
              <div className="hidden xl:grid xl:grid-cols-4 gap-4">
                {trending.map((movie, i) => (
                  <div
                    key={movie._id}
                    style={{
                      opacity: trendInView ? 1 : 0,
                      transform: trendInView ? "translateY(0)" : "translateY(40px)",
                      transition: `opacity 0.6s ease ${i * 0.08}s, transform 0.6s ease ${i * 0.08}s`,
                    }}
                  >
                    <MovieCard movie={movie} />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* bottom film-strip */}
      <div className="flex items-center gap-0 overflow-hidden px-4 pb-6 opacity-20">
        {Array.from({ length: 40 }).map((_, i) => (
          <div
            key={i}
            className="mx-0.5 h-4 w-6 flex-shrink-0 rounded-[3px] border border-white/20 bg-white/10"
          />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;