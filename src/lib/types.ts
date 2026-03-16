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
  storyDismissSeconds: number;
  slideshowIntervalMs: number;
  displayMode: string;
}
