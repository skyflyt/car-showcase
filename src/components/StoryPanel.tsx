"use client";

import { useEffect, useRef, useCallback } from "react";
import type { AuctionInfo } from "@/lib/types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  story: string;
  highlights: string[];
  auctionInfo?: AuctionInfo | null;
  dismissSeconds: number;
}

export function StoryPanel({
  isOpen,
  onClose,
  title,
  description,
  story,
  highlights,
  auctionInfo,
  dismissSeconds,
}: Props) {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const stableOnClose = useCallback(onClose, [onClose]);

  useEffect(() => {
    if (isOpen) {
      timerRef.current = setTimeout(() => {
        stableOnClose();
      }, dismissSeconds * 1000);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isOpen, dismissSeconds, stableOnClose]);

  const displayText = story || description;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`story-panel fixed top-0 right-0 h-full z-50 w-full max-w-xl ${
          isOpen ? "story-panel-open" : "story-panel-closed"
        }`}
      >
        <div className="h-full bg-black/80 backdrop-blur-xl border-l border-white/10 overflow-y-auto">
          {/* Countdown bar */}
          {isOpen && (
            <div className="absolute top-0 left-0 right-0 h-0.5">
              <div
                className="countdown-bar h-full bg-white/30"
                style={
                  {
                    "--dismiss-duration": `${dismissSeconds}s`,
                  } as React.CSSProperties
                }
              />
            </div>
          )}

          <div className="p-8 pt-12">
            {/* Close hint */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/30 hover:text-white/60 transition-colors text-sm tracking-wider uppercase"
            >
              Close
            </button>

            {/* Title */}
            <h2 className="text-3xl font-light tracking-tight mb-8">
              The <span className="italic font-semibold">Story</span>
            </h2>

            {/* Story text */}
            {displayText && (
              <div className="mb-10">
                {displayText.split("\n\n").map((paragraph, i) => (
                  <p
                    key={i}
                    className="text-white/70 leading-relaxed mb-4 text-[15px]"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            )}

            {/* Highlights */}
            {highlights.length > 0 && (
              <div className="mb-10">
                <h3 className="text-xs uppercase tracking-[0.2em] text-white/40 mb-4">
                  Highlights
                </h3>
                <ul className="space-y-3">
                  {highlights.map((h, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-white/60 text-sm"
                    >
                      <span className="text-white/20 mt-0.5">&#9670;</span>
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Auction Info */}
            {auctionInfo && (
              <div className="border-t border-white/10 pt-8">
                <h3 className="text-xs uppercase tracking-[0.2em] text-white/40 mb-4">
                  Provenance
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    ["Auction House", auctionInfo.house],
                    ["Event", auctionInfo.event],
                    ["Lot", auctionInfo.lot],
                    ["Sold", auctionInfo.soldPrice],
                    ["Chassis", auctionInfo.chassis],
                  ].map(
                    ([label, value]) =>
                      value && (
                        <div key={label}>
                          <div className="text-white/30 text-xs uppercase tracking-wider mb-1">
                            {label}
                          </div>
                          <div className="text-white/70 text-sm">{value}</div>
                        </div>
                      )
                  )}
                </div>
              </div>
            )}

            {/* Bottom padding for scroll */}
            <div className="h-16" />
          </div>
        </div>
      </div>
    </>
  );
}
