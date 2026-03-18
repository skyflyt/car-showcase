"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import Image from "next/image";
import type { TransitionEffect, ImageEntry } from "@/lib/types";

interface Props {
  images: string[];
  imageSettings?: ImageEntry[];
  defaultTransition?: TransitionEffect;
  alt: string;
  intervalMs?: number;
  mode?: "interactive" | "display";
  paused?: boolean;
  onSlideChange?: (index: number) => void;
}

// Track which images are low-res relative to the viewport
type ImageSizing = "cover" | "contain";

// Detect video URLs by extension
const isVideo = (url: string) =>
  /\.(mp4|webm|mov|avi|mkv|m4v|ogv)(\?|$)/i.test(url);

// Ken Burns picks a random sub-effect each slide
const KENBURNS_EFFECTS: TransitionEffect[] = [
  "zoom-in",
  "zoom-out",
  "pan-left",
  "pan-right",
];

// CSS for each animation effect — applied while the image is visible
function getAnimationStyle(
  effect: TransitionEffect,
  durationMs: number
): React.CSSProperties {
  const dur = `${durationMs}ms`;
  switch (effect) {
    case "zoom-in":
      return { animation: `slideZoomIn ${dur} ease-out forwards` };
    case "zoom-out":
      return { animation: `slideZoomOut ${dur} ease-out forwards` };
    case "pan-left":
      return { animation: `slidePanLeft ${dur} linear forwards` };
    case "pan-right":
      return { animation: `slidePanRight ${dur} linear forwards` };
    case "slide-left":
    case "slide-right":
    case "fade":
    default:
      return {};
  }
}

// Get transition classes for entering/exiting
function getTransitionClasses(
  effect: TransitionEffect,
  isTransitioning: boolean
): string {
  switch (effect) {
    case "slide-left":
      return isTransitioning
        ? "translate-x-full opacity-0"
        : "translate-x-0 opacity-100";
    case "slide-right":
      return isTransitioning
        ? "-translate-x-full opacity-0"
        : "translate-x-0 opacity-100";
    default:
      return isTransitioning ? "opacity-0" : "opacity-100";
  }
}

export function Slideshow({
  images,
  imageSettings = [],
  defaultTransition = "fade",
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
  const [kbEffect, setKbEffect] = useState<TransitionEffect>("zoom-in");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pauseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Build a map of per-image transitions
  const transitionMap = useMemo(() => {
    const map: Record<number, TransitionEffect> = {};
    imageSettings.forEach((entry, i) => {
      if (entry.transition) {
        map[i] = entry.transition;
      }
    });
    return map;
  }, [imageSettings]);

  // Resolve the effective transition for the current image
  const resolveTransition = useCallback(
    (index: number): TransitionEffect => {
      const perImage = transitionMap[index];
      const base = perImage || defaultTransition;
      if (base === "kenburns") {
        return kbEffect;
      }
      return base;
    },
    [transitionMap, defaultTransition, kbEffect]
  );

  const currentTransition = resolveTransition(current);

  // Detect low-res images when they load
  const handleImageLoad = useCallback(
    (index: number, e: React.SyntheticEvent<HTMLImageElement>) => {
      const img = e.currentTarget;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
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
      // Pick new random Ken Burns effect before transitioning
      setKbEffect(
        KENBURNS_EFFECTS[Math.floor(Math.random() * KENBURNS_EFFECTS.length)]
      );
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
      "touches" in e
        ? e.touches[0].clientX
        : (e as React.MouseEvent).clientX;
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
  const currentIsVideo = isVideo(images[current]);
  const nextIsVideo = isVideo(images[nextIdx]);
  const animStyle = currentIsVideo ? {} : getAnimationStyle(currentTransition, intervalMs);
  const transClasses = getTransitionClasses(currentTransition, isTransitioning);
  const currentCaption = imageSettings[current]?.caption;

  return (
    <div
      className="absolute inset-0 cursor-none overflow-hidden"
      onClick={handleInteraction}
      onTouchStart={handleInteraction}
    >
      {/* Blurred background layer — only shown for low-res images (not videos) */}
      {sizing === "contain" && !currentIsVideo && (
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

      {/* Current media with animation */}
      <div
        key={current}
        className={`absolute inset-0 transition-all duration-700 ease-in-out ${transClasses}`}
        style={animStyle}
      >
        {currentIsVideo ? (
          <video
            ref={(el) => {
              // iOS / Kiosk Pro may not autoplay on remounted elements — force play
              if (el) {
                el.muted = true;
                el.playsInline = true;
                el.play().catch(() => {});
              }
            }}
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
          >
            <source src={images[current]} type={images[current].endsWith(".webm") ? "video/webm" : "video/mp4"} />
          </video>
        ) : (
          <Image
            src={images[current]}
            alt={`${alt} - Photo ${current + 1}`}
            fill
            className={sizing === "contain" ? "object-contain" : "object-cover"}
            priority={current < 3}
            unoptimized
            onLoad={(e) => handleImageLoad(current, e)}
          />
        )}
      </div>

      {/* Preload next image (hidden, but triggers onLoad for sizing detection) */}
      {!nextIsVideo && (
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
      )}

      {/* Image caption overlay */}
      {currentCaption && !isTransitioning && (
        <div className="absolute top-8 left-8 z-20 max-w-md animate-caption-in">
          <div className="bg-black/40 backdrop-blur-md rounded-2xl px-5 py-3 border border-white/10">
            <p className="text-white/80 text-sm leading-relaxed">{currentCaption}</p>
          </div>
        </div>
      )}

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
