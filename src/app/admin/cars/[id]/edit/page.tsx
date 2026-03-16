import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { AdminCarForm } from "@/components/AdminCarForm";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditCarPage({ params }: Props) {
  const { id } = await params;
  const car = await prisma.car.findUnique({ where: { id } });
  if (!car) notFound();

  const formData = {
    id: car.id,
    slug: car.slug,
    year: car.year,
    make: car.make,
    model: car.model,
    subtitle: car.subtitle,
    color: car.color,
    heroImage: car.heroImage,
    description: car.description,
    story: car.story,
    stats: car.stats as Record<string, string>,
    highlights: car.highlights as string[],
    auctionInfo: car.auctionInfo as {
      house: string;
      event: string;
      lot: string;
      soldPrice: string;
      chassis: string;
    } | null,
    images: car.images as string[],
    storyDismissSeconds: car.storyDismissSeconds,
    slideshowIntervalMs: car.slideshowIntervalMs,
    displayMode: car.displayMode,
  };

  return (
    <div>
      <h1 className="text-2xl font-light tracking-tight mb-8">
        Edit{" "}
        <span className="font-semibold">
          {car.year} {car.make} {car.model}
        </span>
      </h1>
      <AdminCarForm initialData={formData} isEdit />
    </div>
  );
}
