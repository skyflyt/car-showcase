export interface CarStats {
  engine: string;
  horsepower: string;
  torque: string;
  zeroToSixty: string;
  topSpeed: string;
  transmission: string;
  weight: string;
  production: string;
  [key: string]: string;
}

export interface AuctionInfo {
  house: string;
  event: string;
  lot: string;
  soldPrice: string;
  chassis: string;
}

// Available transition/animation effects for slideshow images
export type TransitionEffect =
  | "fade"
  | "zoom-in"
  | "zoom-out"
  | "pan-left"
  | "pan-right"
  | "slide-left"
  | "slide-right"
  | "kenburns";

export const TRANSITION_EFFECTS: { value: TransitionEffect; label: string }[] = [
  { value: "fade", label: "Fade (Default)" },
  { value: "zoom-in", label: "Zoom In" },
  { value: "zoom-out", label: "Zoom Out" },
  { value: "pan-left", label: "Pan Left" },
  { value: "pan-right", label: "Pan Right" },
  { value: "slide-left", label: "Slide Left" },
  { value: "slide-right", label: "Slide Right" },
  { value: "kenburns", label: "Ken Burns (Random)" },
];

// Per-image settings stored alongside URL
export interface ImageEntry {
  url: string;
  transition?: TransitionEffect;
  caption?: string; // Optional "about this image" text overlay
}

export interface CarData {
  id: string;
  slug: string;
  year: number;
  make: string;
  model: string;
  subtitle: string;
  color: string;
  heroImage: string;
  stats: CarStats;
  description: string;
  story: string;
  highlights: string[];
  auctionInfo?: AuctionInfo | null;
  images: string[];
  imageSettings: ImageEntry[];
  defaultTransition: TransitionEffect;
  storyDismissSeconds: number;
  slideshowIntervalMs: number;
  statsExpanded: boolean;
  displayMode: string;
}
