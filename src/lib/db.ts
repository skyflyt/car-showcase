import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function createClient() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma || createClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/** Awaited return type of prisma.car.findMany()[0] */
export type DbCar = {
  id: string;
  slug: string;
  year: number;
  make: string;
  model: string;
  subtitle: string;
  color: string;
  heroImage: string;
  description: string;
  story: string;
  stats: unknown;
  highlights: unknown;
  auctionInfo: unknown;
  images: unknown;
  storyDismissSeconds: number;
  slideshowIntervalMs: number;
  displayMode: string;
  createdAt: Date;
  updatedAt: Date;
};
