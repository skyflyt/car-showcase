import { prisma, type DbCar } from "@/lib/db";
import { notFound } from "next/navigation";
import { CarDisplay } from "@/components/CarDisplay";
import type { CarData } from "@/lib/types";

// Dynamic rendering — data comes from database
export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ mode?: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const car = (await prisma.car.findUnique({ where: { slug } })) as DbCar | null;
  if (!car) return { title: "Not Found" };
  return { title: `${car.year} ${car.make} ${car.model}` };
}

export default async function CarPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { mode: queryMode } = await searchParams;

  const dbCar = (await prisma.car.findUnique({ where: { slug } })) as DbCar | null;
  if (!dbCar) notFound();

  const car: CarData = {
    id: dbCar.id,
    slug: dbCar.slug,
    year: dbCar.year,
    make: dbCar.make,
    model: dbCar.model,
    subtitle: dbCar.subtitle,
    color: dbCar.color,
    heroImage: dbCar.heroImage,
    stats: dbCar.stats as CarData["stats"],
    description: dbCar.description,
    story: dbCar.story,
    highlights: dbCar.highlights as string[],
    auctionInfo: dbCar.auctionInfo as CarData["auctionInfo"],
    images: dbCar.images as string[],
    imageSettings: (dbCar.imageSettings as CarData["imageSettings"]) || [],
    defaultTransition: (dbCar.defaultTransition as CarData["defaultTransition"]) || "fade",
    storyDismissSeconds: dbCar.storyDismissSeconds,
    slideshowIntervalMs: dbCar.slideshowIntervalMs,
    statsExpanded: dbCar.statsExpanded,
    displayMode: dbCar.displayMode,
  };

  // URL param overrides the database default
  const mode =
    queryMode === "display" || queryMode === "interactive"
      ? queryMode
      : (car.displayMode as "interactive" | "display");

  return <CarDisplay car={car} mode={mode} />;
}
