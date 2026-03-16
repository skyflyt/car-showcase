export interface CarStats {
  engine: string;
  horsepower: string;
  torque: string;
  zeroToSixty: string;
  topSpeed: string;
  transmission: string;
  weight: string;
  production: string;
  [key: string]: string; // allow additional stats
}

export interface AuctionInfo {
  house: string;
  event: string;
  lot: string;
  soldPrice: string;
  chassis: string;
}

export interface CarData {
  slug: string;
  year: number;
  make: string;
  model: string;
  subtitle: string;
  color: string;
  heroImage: string;
  stats: CarStats;
  description: string;
  highlights: string[];
  auctionInfo?: AuctionInfo;
  images: string[];
}
