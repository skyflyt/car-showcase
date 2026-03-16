"use client";

import { useState } from "react";
import type { CarStats } from "@/lib/types";

interface Props {
  stats: CarStats;
  mode?: "interactive" | "display";
}

const statLabels: Record<string, string> = {
  engine: "Engine",
  horsepower: "Power",
  torque: "Torque",
  zeroToSixty: "0-60",
  topSpeed: "Top Speed",
  transmission: "Gearbox",
  weight: "Weight",
  production: "Production",
};

const statIcons: Record<string, string> = {
  engine: "\u26A1",
  horsepower: "\uD83D\uDCA8",
  torque: "\uD83D\uDD27",
  zeroToSixty: "\uD83C\uDFC1",
  topSpeed: "\uD83D\uDE80",
  transmission: "\u2699\uFE0F",
  weight: "\u2696\uFE0F",
  production: "\uD83D\uDD12",
};

export function StatsPanel({ stats, mode = "interactive" }: Props) {
  const [expanded, setExpanded] = useState(mode === "display");
  const entries = Object.entries(stats);
  const visible = expanded ? entries : entries.slice(0, 5);

  return (
    <div>
      <div className="flex flex-wrap gap-x-8 gap-y-3">
        {visible.map(([key, value]) => (
          <button
            key={key}
            onClick={() => mode === "interactive" && setExpanded(!expanded)}
            className="group text-left"
          >
            <div className="text-white/40 text-xs uppercase tracking-wider mb-0.5">
              {statIcons[key] || "\u2022"} {statLabels[key] || key}
            </div>
            <div className="text-xl font-light tracking-tight group-hover:text-white/90 transition-colors">
              {value}
            </div>
          </button>
        ))}
        {!expanded && entries.length > 5 && mode === "interactive" && (
          <button
            onClick={() => setExpanded(true)}
            className="self-end text-white/30 text-sm hover:text-white/60 transition-colors mb-1"
          >
            +{entries.length - 5} more
          </button>
        )}
      </div>
    </div>
  );
}
