import Link from "next/link";
import Hero from "./Hero";
import { getIndexItem, indexItems } from "@/lib/items";
import ItemCard from "@/components/ItemCard";
import FotoMarquee from "@/components/FotoMarquee";

const POPULER = [
  "nasi-goreng",
  "rendang",
  "sate-ayam-madura",
  "bakso",
  "ayam-geprek",
  "gudeg",
  "es-cendol",
  "klepon",
];

export default function Home() {
  const items = POPULER.map((slug) => getIndexItem(slug)).filter((i) => i !== undefined);
  // deretan "kebawa angin": item di luar grid populer biar ga dobel muncul
  const marqueeItems = indexItems()
    .filter((i) => !POPULER.includes(i.slug))
    .slice(0, 14)
    .map(({ slug, nama }) => ({ slug, nama }));

  return (
    <div>
      <Hero />

      <FotoMarquee items={marqueeItems} />

      <div className="max-w-6xl mx-auto px-4 pt-12 pb-16">
        <div className="flex items-end justify-between mb-4">
          <h2 className="font-display text-2xl md:text-3xl">Pilih, langsung pesan</h2>
          <Link href="/menu" className="text-sm text-sambal underline">
            Semua menu →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {items.map((item, i) => (
            <ItemCard key={item.slug} item={item} delay={i * 35} />
          ))}
        </div>
      </div>
    </div>
  );
}
