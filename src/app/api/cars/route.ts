import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const cars = await prisma.car.findMany({ orderBy: { year: "desc" } });
  return NextResponse.json(cars);
}

export async function POST(request: Request) {
  const data = await request.json();

  const slug =
    data.slug ||
    `${data.year}-${data.make}-${data.model}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const car = await prisma.car.create({
    data: {
      slug,
      year: parseInt(data.year),
      make: data.make,
      model: data.model,
      subtitle: data.subtitle || "",
      color: data.color || "",
      heroImage: data.heroImage || (data.images?.[0] ?? ""),
      description: data.description || "",
      story: data.story || "",
      stats: data.stats || {},
      highlights: data.highlights || [],
      auctionInfo: data.auctionInfo || null,
      images: data.images || [],
      storyDismissSeconds: parseInt(data.storyDismissSeconds) || 30,
      slideshowIntervalMs: parseInt(data.slideshowIntervalMs) || 6000,
      statsExpanded: !!data.statsExpanded,
      displayMode: data.displayMode || "interactive",
    },
  });

  return NextResponse.json(car, { status: 201 });
}
