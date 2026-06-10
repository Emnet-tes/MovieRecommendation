"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Sparkles, WandSparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";

const moviePosters = [
  { src: "/mantis.webp", rotate: "-6deg", zIndex: 10 },
  { src: "/awarness.jpg", rotate: "0deg", zIndex: 20 },
  { src: "/goat.webp", rotate: "6deg", zIndex: 10 },
];

export default function MovieHero() {
  const router = useRouter();
  const heroRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);
  const [mounted, setMounted] = useState(false);

  // Parallax on scroll
  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Entrance animation state
  const [entered, setEntered] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 80);
    return () => clearTimeout(t);
  }, []);

  const parallaxY = scrollY * 0.35;
  const fadeOut = Math.max(0, 1 - scrollY / 400);

  return (
    <div
      ref={heroRef}
      className="relative min-h-[92vh] overflow-hidden px-6 pt-28 pb-24 text-white sm:px-10 lg:px-16 flex items-center"
    >
      {/* ── BACKGROUND layers ── */}
      {/* Deep vignette */}
      <div className="absolute inset-0 bg-[#07070d]" />

      {/* Radial spotlight from top-center — the "projector" */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-700"
        style={{
          background:
            "radial-gradient(ellipse 60% 55% at 50% -5%, rgba(239,68,68,0.18) 0%, transparent 70%)",
          opacity: fadeOut,
          transform: `translateY(${parallaxY * 0.2}px)`,
        }}
      />
      {/* Warm amber from bottom-right */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 40% 40% at 90% 100%, rgba(251,191,36,0.10) 0%, transparent 70%)",
        }}
      />
      {/* Film grain overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: "128px 128px",
        }}
      />
      {/* Subtle horizontal scan lines */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,1) 2px, rgba(255,255,255,1) 3px)",
          backgroundSize: "100% 4px",
        }}
      />

      {/* ── CONTENT ── */}
      <div
        className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]"
        style={{
          opacity: fadeOut,
          transform: `translateY(${parallaxY * 0.5}px)`,
        }}
      >
        {/* LEFT: text */}
        <div className="space-y-8">
          {/* chip */}
          <div
            style={{
              opacity: entered ? 1 : 0,
              transform: entered ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s",
            }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-amber-300/80 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5" />
              Mood-powered picks
            </span>
          </div>

          {/* headline */}
          <div
            className="space-y-5"
            style={{
              opacity: entered ? 1 : 0,
              transform: entered ? "translateY(0)" : "translateY(30px)",
              transition: "opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s",
            }}
          >
            <h1
              className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-[3.5rem] lg:leading-[1.12]"
              style={{ letterSpacing: "-0.025em" }}
            >
              Your mood sets{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(90deg, #f43f5e 0%, #fb923c 50%, #fbbf24 100%)",
                }}
              >
                the scene.
              </span>
              <br />
              We handle the rest.
            </h1>
            <p className="max-w-xl text-base leading-7 text-white/50 sm:text-lg">
              Browse curated movies that match exactly how you feel — save the
              ones you love, skip the rest.
            </p>
          </div>

          {/* CTA */}
          <div
            className="flex flex-wrap items-center gap-3"
            style={{
              opacity: entered ? 1 : 0,
              transform: entered ? "translateY(0)" : "translateY(30px)",
              transition: "opacity 0.7s ease 0.35s, transform 0.7s ease 0.35s",
            }}
          >
            <Button
              onClick={() => router.push("/dashboard")}
              className="group relative overflow-hidden rounded-full px-6 py-6 font-medium text-white shadow-xl shadow-rose-500/20 transition-transform hover:scale-[1.03]"
              style={{
                background: "linear-gradient(135deg, #e11d48 0%, #f97316 100%)",
              }}
            >
              <span className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{ background: "rgba(255,255,255,0.08)" }} />
              <WandSparkles className="mr-2 h-4 w-4" />
              Explore moods
            </Button>

            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/50 backdrop-blur-md">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              Trending picks updated live
            </span>
          </div>

          {/* scroll hint */}
          <div
            className="flex items-center gap-2 text-xs text-white/25"
            style={{
              opacity: entered ? 1 : 0,
              transition: "opacity 0.7s ease 0.6s",
            }}
          >
            <div className="flex h-6 w-4 items-start justify-center rounded-full border border-white/20 p-1">
              <div className="h-1.5 w-0.5 animate-bounce rounded-full bg-white/40" />
            </div>
            Scroll to explore
          </div>
        </div>

        {/* RIGHT: stacked posters with parallax */}
        <div
          className="relative flex items-end justify-center gap-3 lg:justify-end"
          style={{
            opacity: entered ? 1 : 0,
            transform: entered
              ? `translateY(${-parallaxY * 0.15}px)`
              : `translateY(50px)`,
            transition: entered
              ? `opacity 0.8s ease 0.3s`
              : "opacity 0.8s ease 0.3s, transform 0.8s ease 0.3s",
          }}
        >
          {/* projector beam behind center poster */}
          <div
            className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-full w-32 opacity-20"
            style={{
              background:
                "linear-gradient(to bottom, rgba(239,68,68,0.5), transparent 60%)",
              filter: "blur(20px)",
            }}
          />

          {moviePosters.map((poster, i) => (
            <div
              key={i}
              className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_30px_70px_rgba(0,0,0,0.6)]"
              style={{
                transform: `rotate(${poster.rotate})`,
                zIndex: poster.zIndex,
                boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
                transitionDelay: `${i * 0.05}s`,
              }}
            >
              {/* red tint overlay on hover */}
              <div className="absolute inset-0 z-10 rounded-2xl bg-gradient-to-t from-rose-500/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <Image
                src={poster.src}
                alt={`Movie ${i + 1}`}
                width={220}
                height={330}
                className="h-auto w-36 object-cover sm:w-44 lg:w-48"
              />
            </div>
          ))}
        </div>
      </div>

      {/* bottom fade to page bg */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-32"
        style={{
          background: "linear-gradient(to bottom, transparent, #0a0a0f)",
        }}
      />
    </div>
  );
}