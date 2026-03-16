import { cars } from "@/data/cars";
import { notFound } from "next/navigation";
import { Slideshow } from "@/components/Slideshow";
import { StatsPanel } from "@/components/StatsPanel";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(cars).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const car = cars[slug];
  if (!car) return { title: "Not Found" };
  return { title: `${car.year} ${car.make} ${car.model}` };
}

export default async function CarPage({ params }: Props) {
  const { slug } = await params;
  const car = cars[slug];
  if (!car) notFound();

  return (
    <main className="h-screen w-screen overflow-hidden bg-black text-white relative">
      <Slideshow images={car.images} alt={`${car.year} ${car.make} ${car.model}`} />
      <div className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none">
        <div className="bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-32 pb-8 px-8">
          <div className="max-w-screen-2xl mx-auto pointer-events-auto">
            <div className="mb-4">
              <h1 className="text-5xl font-light tracking-tight">
                <span className="text-white/60">{car.year}</span>{" "}
                <span className="font-semibold">{car.make}</span>{" "}
                <span className="italic">{car.model}</span>
              </h1>
              <p className="text-lg text-white/50 mt-1 tracking-wide uppercase">
                {car.subtitle}
              </p>
            </div>
            <StatsPanel stats={car.stats} />
          </div>
        </div>
      </div>
      <div className="absolute top-6 right-8 z-10">
        <div className="text-white/20 text-sm tracking-[0.3em] uppercase font-light">
          Jacobs Entertainment
        </div>
      </div>
    </main>
  );
}
