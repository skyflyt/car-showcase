"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";

interface Props {
  images: string[];
  alt: string;
  intervalMs?: number;
  mode?: "interactive" | "display";
  paused?: boolean;
  onSlideChange?: (index: number) => void;
}

export function Slideshow({
  images,
  alt,
  intervalMs = 6000,
  mode = "interactive",
  paused = false,
  onSlideChange,
}: Props) {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pauseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const goTo = useCallback(
    (index: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrent(index);
        onSlideChange?.(index);
        setTimeout(() => setIsTransitioning(false), 100);
      }, 500);
    },
    [isTransitioning, onSlideChange]
  );

  const next = useCallback(() => {
    goTo((current + 1) % images.length);
  }, [current, images.length, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + images.length) % images.length);
  }, [current, images.length, goTo]);

  // Auto-advance
  useEffect(() => {
    if (isPaused || paused) return;
    timeoutRef.current = setTimeout(next, intervalMs);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [current, isPaused, paused, intervalMs, next]);

  // Touch/click handlers — only in interactive mode
  const handleInteraction = (e: React.MouseEvent | React.TouchEvent) => {
    if (mode === "display") return;

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const clientX =
      "touches" in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const x = clientX - rect.left;
    const isLeftHalf = x < rect.width / 2;

    setIsPaused(true);
    if (isLeftHalf) prev();
    else next();

    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    pauseTimeoutRef.current = setTimeout(() => setIsPaused(false), 15000);
  };

  return (
    <div
      className="absolute inset-0 cursor-none"
      onClick={handleInteraction}
      onTouchStart={handleInteraction}
    >
      {/* Current image */}
      <div
        className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
          isTransitioning ? "opacity-0" : "opacity-100"
        }`}
      >
        <Image
          src={images[current]}
          alt={`${alt} - Photo ${current + 1}`}
          fill
          className="object-cover"
          priority={current < 3}
          unoptimized
        />
      </div>

      {/* Preload next image */}
      <div className="hidden">
        <Image
          src={images[(current + 1) % images.length]}
          alt="preload"
          width={1}
          height={1}
          unoptimized
        />
      </div>

      {/* Progress indicator */}
      <div className="absolute bottom-44 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
        {images.length <= 30 ? (
          images.map((_, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                i === current ? "bg-white/80 scale-125" : "bg-white/20"
              }`}
            />
          ))
        ) : (
          <div className="text-white/30 text-xs tracking-wider">
            {current + 1} / {images.length}
          </div>
        )}
      </div>
    </div>
  );
}
