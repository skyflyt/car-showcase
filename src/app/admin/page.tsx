import { prisma } from "@/lib/db";
import Link from "next/link";
import Image from "next/image";
import type { Car } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const cars: Car[] = await prisma.car.findMany({ orderBy: { year: "desc" } });

  return (
    <div>
      <h1 className="text-2xl font-light tracking-tight mb-8">
        All <span className="font-semibold">Vehicles</span>
        <span className="text-white/30 ml-3 text-sm">{cars.length} total</span>
      </h1>

      {cars.length === 0 && (
        <div className="text-center py-24 border border-dashed border-white/10 rounded-xl">
          <p className="text-white/30 text-lg mb-4">No cars added yet</p>
          <Link
            href="/admin/cars/new"
            className="admin-btn admin-btn-primary inline-block"
          >
            Add Your First Car
          </Link>
        </div>
      )}

      <div className="space-y-4">
        {cars.map((car) => (
          <div
            key={car.id}
            className="flex items-center gap-6 p-4 rounded-xl border border-white/5 hover:border-white/15 transition-colors"
          >
            {/* Thumbnail */}
            <div className="relative w-32 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-white/5">
              {car.heroImage && (
                <Image
                  src={car.heroImage}
                  alt={`${car.make} ${car.model}`}
                  fill
                  className="object-cover"
                  unoptimized
                />
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-lg font-semibold">
                <span className="text-white/50 font-light">{car.year}</span>{" "}
                {car.make} {car.model}
              </p>
              <p className="text-white/40 text-sm">{car.subtitle}</p>
              <div className="flex gap-4 mt-1 text-xs text-white/25">
                <span>{(car.images as string[]).length} photos</span>
                <span>{car.displayMode} mode</span>
                <span>/{car.slug}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <Link
                href={`/car/${car.slug}`}
                className="admin-btn admin-btn-secondary text-sm"
              >
                Preview
              </Link>
              <Link
                href={`/car/${car.slug}?mode=display`}
                className="admin-btn admin-btn-secondary text-sm"
              >
                Display
              </Link>
              <Link
                href={`/admin/cars/${car.id}/edit`}
                className="admin-btn admin-btn-primary text-sm"
              >
                Edit
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
