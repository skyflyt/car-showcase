import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const car = await prisma.car.findUnique({ where: { id } });
  if (!car) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(car);
}

export async function PUT(request: Request, { params }: Params) {
  const { id } = await params;
  const data = await request.json();

  const slug =
    data.slug ||
    `${data.year}-${data.make}-${data.model}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const car = await prisma.car.update({
    where: { id },
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

  return NextResponse.json(car);
}

export async function DELETE(_request: Request, { params }: Params) {
  const { id } = await params;
  await prisma.car.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
