import { prisma, type DbCar } from "@/lib/db";
import Link from "next/link";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function Home() {
  const carList = (await prisma.car.findMany({ orderBy: { year: "desc" } })) as DbCar[];

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-light tracking-tight mb-2">
              Car <span className="font-semibold">Showcase</span>
            </h1>
            <p className="text-white/40 text-lg">Select a vehicle to display</p>
          </div>
          <Link
            href="/admin"
            className="text-white/30 hover:text-white/60 transition-colors text-sm tracking-wider uppercase border border-white/10 hover:border-white/25 rounded-lg px-4 py-2"
          >
            Admin
          </Link>
        </div>

        {carList.length === 0 && (
          <div className="text-center py-24">
            <p className="text-white/30 text-lg mb-4">No cars yet</p>
            <Link
              href="/admin/cars/new"
              className="admin-btn admin-btn-primary inline-block"
            >
              Add Your First Car
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {carList.map((car) => (
            <Link
              key={car.slug}
              href={`/car/${car.slug}`}
              className="group relative aspect-[16/10] rounded-xl overflow-hidden"
            >
              {car.heroImage ? (
                <Image
                  src={car.heroImage}
                  alt={`${car.year} ${car.make} ${car.model}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  unoptimized
                />
              ) : (
                <div className="absolute inset-0 bg-white/5" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-white/50 text-sm">{car.year}</p>
                <p className="text-xl font-semibold">
                  {car.make}{" "}
                  <span className="italic font-light">{car.model}</span>
                </p>
                <p className="text-white/40 text-sm mt-1">{car.subtitle}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
