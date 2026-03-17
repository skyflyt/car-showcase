"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Slideshow } from "./Slideshow";
import { StatsPanel } from "./StatsPanel";
import { StoryPanel } from "./StoryPanel";
import type { CarData } from "@/lib/types";

interface Props {
  car: CarData;
  mode: "interactive" | "display";
}

// In display mode, auto-open story every N slides
const DISPLAY_STORY_INTERVAL = 12;

export function CarDisplay({ car, mode }: Props) {
  const [storyOpen, setStoryOpen] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const slidesSinceStory = useRef(0);

  const handleSlideChange = useCallback(
    (index: number) => {
      setSlideIndex(index);
      if (mode === "display") {
        slidesSinceStory.current++;
        if (slidesSinceStory.current >= DISPLAY_STORY_INTERVAL) {
          slidesSinceStory.current = 0;
          setStoryOpen(true);
        }
      }
    },
    [mode]
  );

  const handleStoryClose = useCallback(() => {
    setStoryOpen(false);
    slidesSinceStory.current = 0;
  }, []);

  // In display mode, auto-open story on first load after a delay
  useEffect(() => {
    if (mode === "display") {
      const timer = setTimeout(() => setStoryOpen(true), 20000);
      return () => clearTimeout(timer);
    }
  }, [mode]);

  const hasStory = car.story || car.description;

  return (
    <main className="h-screen w-screen overflow-hidden bg-black text-white relative">
      <Slideshow
        images={car.images}
        alt={`${car.year} ${car.make} ${car.model}`}
        intervalMs={car.slideshowIntervalMs}
        mode={mode}
        paused={storyOpen}
        onSlideChange={handleSlideChange}
      />

      {/* Bottom info bar */}
      <div className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none">
        <div className="bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-32 pb-8 px-8">
          <div className="max-w-screen-2xl mx-auto pointer-events-auto">
            <div className="mb-4 flex items-end justify-between">
              <div>
                <h1 className="text-5xl font-light tracking-tight">
                  <span className="text-white/60">{car.year}</span>{" "}
                  <span className="font-semibold">{car.make}</span>{" "}
                  <span className="italic">{car.model}</span>
                </h1>
                <p className="text-lg text-white/50 mt-1 tracking-wide uppercase">
                  {car.subtitle}
                </p>
              </div>

              {/* Story button — interactive mode only */}
              {hasStory && mode === "interactive" && (
                <button
                  onClick={() => setStoryOpen(true)}
                  className="flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors text-sm tracking-wider uppercase border border-white/15 hover:border-white/30 rounded-full px-5 py-2.5 backdrop-blur-sm"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                  The Story
                </button>
              )}
            </div>
            <StatsPanel stats={car.stats} mode={mode} startExpanded={car.statsExpanded} />
          </div>
        </div>
      </div>

      {/* Jacobs Entertainment watermark */}
      <div className="absolute top-6 right-8 z-10">
        <div className="text-white/20 text-sm tracking-[0.3em] uppercase font-light">
          Jacobs Entertainment
        </div>
      </div>

      {/* Slide counter - top left subtle */}
      {mode === "display" && (
        <div className="absolute top-6 left-8 z-10">
          <div className="text-white/15 text-xs tracking-wider">
            {slideIndex + 1} / {car.images.length}
          </div>
        </div>
      )}

      {/* Story Panel */}
      {hasStory && (
        <StoryPanel
          isOpen={storyOpen}
          onClose={handleStoryClose}
          title={`${car.year} ${car.make} ${car.model}`}
          description={car.description}
          story={car.story}
          highlights={car.highlights}
          auctionInfo={car.auctionInfo}
          dismissSeconds={car.storyDismissSeconds}
        />
      )}
    </main>
  );
}
