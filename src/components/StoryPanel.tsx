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

      {/* Panel — wider at max-w-3xl with two-column layout */}
      <div
        className={`story-panel fixed top-0 right-0 h-full z-50 w-full max-w-3xl ${
          isOpen ? "story-panel-open" : "story-panel-closed"
        }`}
      >
        <div className="h-full bg-black/80 backdrop-blur-xl border-l border-white/10 flex flex-col">
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

          <div className="flex-1 overflow-y-auto p-10 pt-14">
            {/* Close hint */}
            <button
              onClick={onClose}
              className="absolute top-4 right-6 text-white/30 hover:text-white/60 transition-colors text-sm tracking-wider uppercase"
            >
              Close
            </button>

            {/* Title */}
            <h2 className="text-3xl font-light tracking-tight mb-8">
              The <span className="italic font-semibold">Story</span>
            </h2>

            {/* Two-column layout: story text + sidebar (highlights/provenance) */}
            <div className={highlights.length > 0 || auctionInfo ? "grid grid-cols-5 gap-10" : ""}>
              {/* Story text — wider column */}
              {displayText && (
                <div className={highlights.length > 0 || auctionInfo ? "col-span-3" : ""}>
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

              {/* Sidebar */}
              {(highlights.length > 0 || auctionInfo) && (
                <div className="col-span-2 space-y-8">
                  {/* Highlights */}
                  {highlights.length > 0 && (
                    <div>
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
                    <div className="border-t border-white/10 pt-6">
                      <h3 className="text-xs uppercase tracking-[0.2em] text-white/40 mb-4">
                        Provenance
                      </h3>
                      <div className="space-y-3">
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
                                <div className="text-white/30 text-xs uppercase tracking-wider mb-0.5">
                                  {label}
                                </div>
                                <div className="text-white/70 text-sm">{value}</div>
                              </div>
                            )
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom padding */}
            <div className="h-8" />
          </div>
        </div>
      </div>
    </>
  );
}
