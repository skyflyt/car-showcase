import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.car.findUnique({
    where: { slug: "2008-lamborghini-reventon" },
  });

  if (existing) {
    console.log("Seed data already exists, skipping.");
    return;
  }

  await prisma.car.create({
    data: {
      slug: "2008-lamborghini-reventon",
      year: 2008,
      make: "Lamborghini",
      model: "Reventón",
      subtitle: "Coupe — #12 of 20",
      color: "Grigio Reventón",
      heroImage:
        "https://cdn.rmsothebys.com/9/d/1/c/1/1/9d1c11512758aa4f702e4b8cb24b9b6a3c245779.webp",
      description:
        "Named after a fighting bull that fatally wounded matador Félix Guzmán in 1943, the Reventón debuted at the 2007 Frankfurt Motor Show. Inspired by fighter jets — Lamborghini's design team visited a NATO air base for inspiration — only 20 coupes were produced, all spoken for before the car was even announced. This example, chassis ZHWBU77S68LA03387, is #12 of 20, delivered directly from Sant'Agata to its first and only owner with less than 900 miles at cataloging.",
      story:
        "The Lamborghini Reventón represents the pinnacle of Lamborghini's design philosophy — a fusion of aerospace engineering and Italian craftsmanship that pushed the boundaries of what a supercar could be.\n\nWhen Lamborghini's Centro Stile design team set out to create the Reventón, they drew inspiration from an unexpected source: the world's most advanced fighter jets. A visit to a NATO air base became the catalyst for a design language that would redefine automotive aesthetics. The angular, stealth-fighter lines of the F-22 Raptor directly influenced the car's razor-sharp bodywork.\n\nThe interior broke new ground with its fighter jet-inspired TFT instrument cluster — a first for any production car. The digital display could switch between different layouts, including a G-force meter that visualized the car's lateral and longitudinal acceleration in real time.\n\nBeneath the carbon-fiber skin lies the heart of the Murciélago LP 640: a naturally-aspirated 6.5-liter V-12 producing 650 horsepower, mated to a robotized 6-speed gearbox with paddle shifters. But the Reventón was never about numbers alone — it was about creating an experience that transcended traditional automotive boundaries.\n\nOnly 20 coupes were produced for the entire world, each priced at €1 million — roughly three times the cost of the Murciélago LP 640 upon which it was based. Every single unit was pre-sold before the car's public debut at the 2007 Frankfurt Motor Show.\n\nThis particular example, chassis #12 of 20, has remained in single-owner custody since delivery from Sant'Agata Bolognese. With fewer than 900 miles on the odometer, it represents one of the most pristine Reventóns in existence — a time capsule of Lamborghini's most audacious vision.",
      stats: {
        engine: "6.5L V-12",
        horsepower: "670 hp",
        torque: "~500 lb-ft",
        zeroToSixty: "3.4s",
        topSpeed: "211 mph",
        transmission: "6-Speed Paddle-Shift",
        weight: "3,450 lbs",
        production: "20 units",
      },
      highlights: [
        "One of only 20 coupes produced worldwide",
        "Single owner from new — direct delivery from factory",
        "Less than 900 miles at cataloging",
        "Shown at Meadow Brook & St. John's Concours d'Elegance",
        "Fighter jet-inspired TFT instrument cluster with G-force meter",
        "Carbon-fiber body, steel tubular chassis with honeycomb carbon elements",
        "Includes original Lamborghini Reventón shoulder bag & factory car cover",
      ],
      auctionInfo: {
        house: "RM Sotheby's",
        event: "Monterey 2022",
        lot: "224",
        soldPrice: "$1,952,000",
        chassis: "ZHWBU77S68LA03387",
      },
      images: [
        "https://cdn.rmsothebys.com/9/d/1/c/1/1/9d1c11512758aa4f702e4b8cb24b9b6a3c245779.webp",
        "https://cdn.rmsothebys.com/6/d/6/6/c/3/6d66c3f23a509fb8f86f2ec1830453236781e6a6.webp",
        "https://cdn.rmsothebys.com/5/6/c/8/f/1/56c8f1f98583a7b23aa0c0ab97911414c9c39666.webp",
        "https://cdn.rmsothebys.com/9/f/9/2/7/3/9f92736553d5c4a0afec908c5f05dbd365dc3985.webp",
        "https://cdn.rmsothebys.com/0/a/b/2/8/f/0ab28fc8f5bf9f9beed52576d52e1a60974f9bc2.webp",
        "https://cdn.rmsothebys.com/5/7/8/0/b/f/5780bf7b302a96cbddf312ddcf2809909fcbe926.webp",
        "https://cdn.rmsothebys.com/4/3/2/d/0/8/432d08b351244c4c6496a33b517991a296db37d2.webp",
        "https://cdn.rmsothebys.com/4/4/b/1/6/a/44b16ac611d30192a186c703dfc418b191bf96c5.webp",
        "https://cdn.rmsothebys.com/a/1/4/3/f/d/a143fd3b17d5780a36fba851ae380c2af4bbf67a.webp",
        "https://cdn.rmsothebys.com/1/1/7/a/b/a/117aba9218ecda5c9bbffb9c2a4c8711b6c8279e.webp",
        "https://cdn.rmsothebys.com/9/7/5/d/6/f/975d6f3df46d24f1ef2bdf886f3caeb7663a41de.webp",
        "https://cdn.rmsothebys.com/9/6/6/5/d/0/9665d087525abc7eca7e1971eb4f4db7f5fcd2c5.webp",
        "https://cdn.rmsothebys.com/8/6/4/8/f/b/8648fb0f7805161232f20b3fa0e7025c41141513.webp",
        "https://cdn.rmsothebys.com/8/6/0/8/5/4/8608546d4d12c65e1d71f088c7b643bfab48c16c.webp",
        "https://cdn.rmsothebys.com/e/1/d/d/b/e/e1ddbeb3b42f598de10f68aa0ae786652834c315.webp",
        "https://cdn.rmsothebys.com/a/f/e/c/5/6/afec56cb6a59f8833d41a3e35fdfbdf881055ed3.webp",
        "https://cdn.rmsothebys.com/6/e/4/5/0/e/6e450e6183fe29cc7cc4622cb986d33b0f471eef.webp",
        "https://cdn.rmsothebys.com/7/a/3/0/5/3/7a30537bad226734cbffd3d3cff0da5deb5db213.webp",
        "https://cdn.rmsothebys.com/1/5/2/3/1/7/1523179f01bc81edbc7562de5c23880b38f2ec22.webp",
        "https://cdn.rmsothebys.com/3/e/a/6/d/6/3ea6d61a55d169e2220095c77da58b2b80d999fc.webp",
        "https://cdn.rmsothebys.com/1/b/1/f/3/2/1b1f3207b0c43036aceeb61f0ca3354501206c9c.webp",
        "https://cdn.rmsothebys.com/9/b/2/3/e/2/9b23e2900fcc33cfb3e6d2d644b9e6f974120245.webp",
        "https://cdn.rmsothebys.com/d/d/4/a/9/e/dd4a9edc368b3390ea6852464576e958d5dc15a9.webp",
        "https://cdn.rmsothebys.com/a/5/2/6/0/6/a5260645a5d3da1f7be5c66884a8d666f192d4dc.webp",
        "https://cdn.rmsothebys.com/8/3/0/9/b/e/8309be353de2e74a922d71dd8bacd41030e50392.webp",
        "https://cdn.rmsothebys.com/1/0/e/9/8/4/10e984a0f9da068bc451bb6d52ab7e9f3825345b.webp",
        "https://cdn.rmsothebys.com/d/8/7/3/f/0/d873f046a97ba77d2567b34f98409279fed925b1.webp",
        "https://cdn.rmsothebys.com/7/0/9/7/6/2/709762b32d1f02201ff8d1c1b16cd66ce65122b8.webp",
        "https://cdn.rmsothebys.com/d/0/4/d/6/5/d04d65ef8c0bf0f629053e92a2ba8beff2b76123.webp",
        "https://cdn.rmsothebys.com/9/0/e/b/c/2/90ebc2c483bfa5cb00f5bdd9e92c55aa7f13d8b4.webp",
        "https://cdn.rmsothebys.com/0/a/b/d/1/2/0abd1231c598c0c5052897d0899e897669ff4e21.webp",
        "https://cdn.rmsothebys.com/5/8/c/f/3/3/58cf33ddacdff4d20ab73f7f8f7b49dc0a622bf7.webp",
        "https://cdn.rmsothebys.com/c/b/1/4/c/c/cb14cca36516afa1998550631d8510e872c471cf.webp",
        "https://cdn.rmsothebys.com/3/b/c/6/d/0/3bc6d025c2d21177b1325936c0831ebe76f9fa25.webp",
        "https://cdn.rmsothebys.com/6/0/5/f/7/0/605f70e1065de3f3a95dcf019ef57d1be65e50e5.webp",
        "https://cdn.rmsothebys.com/6/8/3/f/4/4/683f44a817936b62c39c3a111481f150b08193c9.webp",
        "https://cdn.rmsothebys.com/6/4/e/4/f/c/64e4fcd17bb22c9652dce457443669d1755adb88.webp",
        "https://cdn.rmsothebys.com/0/1/2/c/8/4/012c84c8deb1dd9568e012246b93f87f734dff47.webp",
        "https://cdn.rmsothebys.com/5/4/d/1/5/3/54d1539627de26c28be870a9911fa44f3506cd68.webp",
        "https://cdn.rmsothebys.com/a/3/2/d/e/b/a32deb5a38c9d4631cbee03367731711ab172a82.webp",
        "https://cdn.rmsothebys.com/9/b/a/9/d/2/9ba9d2b77b8de3eb27982c960d5874bf016d9f49.webp",
        "https://cdn.rmsothebys.com/0/8/c/5/8/c/08c58c784a79cc525daaed6d83c6d7cf5090c1fc.webp",
        "https://cdn.rmsothebys.com/5/3/5/f/f/f/535fffb23cf40936daf380a161c2f2d900d937db.webp",
        "https://cdn.rmsothebys.com/f/4/5/5/3/d/f4553d4c0a378353844a2bf024b91ef8aa3a4529.webp",
        "https://cdn.rmsothebys.com/1/a/0/6/2/7/1a062787dc8d992147f71a76a0130f4f3e24c52e.webp",
        "https://cdn.rmsothebys.com/c/0/5/4/f/f/c054ff7a65c64d9e796cdf595090b0d6503abd11.webp",
        "https://cdn.rmsothebys.com/6/b/8/d/9/8/6b8d98d0c75476509740fc1a216b129e411a5e3f.webp",
        "https://cdn.rmsothebys.com/4/e/0/7/e/d/4e07edbc5a09b27b50a307b617fb8190d4d6e538.webp",
        "https://cdn.rmsothebys.com/6/b/7/a/4/3/6b7a43fb8d40952b684e9d6fca4557dcd02438da.webp",
        "https://cdn.rmsothebys.com/d/c/f/e/e/b/dcfeebf3ed466d182183b5aaff9de976228cad8c.webp",
        "https://cdn.rmsothebys.com/5/1/d/f/e/5/51dfe5d6126722b4527167f1b9e76629d7ccc640.webp",
        "https://cdn.rmsothebys.com/b/8/a/7/e/6/b8a7e6ba97dc80c5f133ef07c31e1543c6cdcfe1.webp",
        "https://cdn.rmsothebys.com/1/6/b/b/1/6/16bb167c64b97f0bcdd0623b5c886c47bf64f311.webp",
        "https://cdn.rmsothebys.com/a/5/f/e/7/5/a5fe757b4817d0c2ec4319a9f9d86120556919b2.webp",
        "https://cdn.rmsothebys.com/5/9/4/5/0/8/5945084bf1f08769dbc1acef47ba17932086dee1.webp",
        "https://cdn.rmsothebys.com/d/6/f/9/1/e/d6f91eb3cb459f4d1c0d25a958acffcadf3f58dd.webp",
        "https://cdn.rmsothebys.com/4/0/b/6/0/3/40b60363d4e42bab55473985a8d6555ebe217229.webp",
        "https://cdn.rmsothebys.com/d/2/2/1/3/8/d221388e4760d77e0433082bdcc9c8ba6e422d3b.webp",
        "https://cdn.rmsothebys.com/7/3/a/4/6/9/73a469677618aad502a52fc0332a36c88f2d0286.webp",
        "https://cdn.rmsothebys.com/d/5/b/3/b/8/d5b3b89bc3707f81285f9a29cc4eed6b5aeb1253.webp",
        "https://cdn.rmsothebys.com/4/4/0/c/5/7/440c575a2e3601ce08579858345f68a592d62554.webp",
        "https://cdn.rmsothebys.com/7/a/6/3/4/a/7a634aea28f9e21ae9b76f0275a33c0cd47b5d0b.webp",
        "https://cdn.rmsothebys.com/f/8/5/9/e/c/f859ecad00b39db90c6dd9efb631a73ed5c44f11.webp",
        "https://cdn.rmsothebys.com/7/9/1/5/1/8/791518056aa2f0a5f3f4197943da09714f924bcd.webp",
        "https://cdn.rmsothebys.com/f/9/4/d/f/8/f94df82e9abcf20539bdfac01fcce082d3c71ae6.webp",
        "https://cdn.rmsothebys.com/6/f/c/7/5/2/6fc752dbcf920ea7d518d64b4bf07db99af32ace.webp",
        "https://cdn.rmsothebys.com/d/1/e/b/d/8/d1ebd8bbec247fb06feda2bc2232ceab2cea57a6.webp",
      ],
      storyDismissSeconds: 30,
      slideshowIntervalMs: 6000,
      displayMode: "interactive",
    },
  });

  console.log("Seeded 2008 Lamborghini Reventón");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
