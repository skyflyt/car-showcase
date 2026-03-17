import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

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
