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

// Track which images are low-res relative to the viewport
type ImageSizing = "cover" | "contain";

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
  const [imageSizing, setImageSizing] = useState<Record<number, ImageSizing>>({});
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pauseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Detect low-res images when they load
  const handleImageLoad = useCallback(
    (index: number, e: React.SyntheticEvent<HTMLImageElement>) => {
      const img = e.currentTarget;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      // If image doesn't fill at least 85% of viewport in both dimensions, it's "low-res"
      const isLowRes =
        img.naturalWidth < vw * 0.85 || img.naturalHeight < vh * 0.85;
      setImageSizing((prev) => ({
        ...prev,
        [index]: isLowRes ? "contain" : "cover",
      }));
    },
    []
  );

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

  const sizing = imageSizing[current] || "cover";
  const nextIdx = (current + 1) % images.length;

  return (
    <div
      className="absolute inset-0 cursor-none"
      onClick={handleInteraction}
      onTouchStart={handleInteraction}
    >
      {/* Blurred background layer — only shown for low-res images */}
      {sizing === "contain" && (
        <div className="absolute inset-0">
          <Image
            src={images[current]}
            alt=""
            fill
            className="object-cover scale-110"
            style={{ filter: "blur(40px) brightness(0.4)" }}
            unoptimized
            aria-hidden
          />
        </div>
      )}

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
          className={sizing === "contain" ? "object-contain" : "object-cover"}
          priority={current < 3}
          unoptimized
          onLoad={(e) => handleImageLoad(current, e)}
        />
      </div>

      {/* Preload next image (hidden, but triggers onLoad for sizing detection) */}
      <div className="hidden">
        <Image
          src={images[nextIdx]}
          alt="preload"
          width={1}
          height={1}
          unoptimized
          onLoad={(e) => handleImageLoad(nextIdx, e)}
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
