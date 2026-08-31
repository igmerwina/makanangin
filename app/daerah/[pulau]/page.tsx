import { notFound } from "next/navigation";
import { allItems, byPulau } from "@/lib/items";
import ItemCard from "@/components/ItemCard";

const NARASI: Record<string, string> = {
  Sumatera: "Dari Aceh sampai Lampung, rempah dan asap jadi ciri khas dapur pesisirnya.",
  Jawa: "Pulau dengan warung paling padat sejauh mata memandang, gurih santan dan manis kecap mendominasi.",
  Bali: "Base genep — bumbu dasar lengkap — jadi fondasi hampir semua hidangannya.",
  "Nusa Tenggara": "Daging bakar dan asap jadi andalan, iklim keringnya cocok untuk pengawetan tradisional.",
  Kalimantan: "Sungai-sungai besar jadi jalur dagang sekaligus sumber ikan air tawarnya.",
  Sulawesi: "Rasa berani — asam, pedas, dan segar sekaligus — khas masakan pesisirnya.",
  Maluku: "Kepulauan rempah asli, ikan segar dan kunyit jadi andalan dapur sehari-hari.",
  Papua: "Sagu jadi makanan pokok pengganti nasi, diolah sederhana tapi mengenyangkan.",
};

export function generateStaticParams() {
  const pulauSet = new Set(allItems().map((i) => i.pulau));
  return Array.from(pulauSet).map((pulau) => ({ pulau }));
}

export default async function DaerahPage({ params }: { params: Promise<{ pulau: string }> }) {
  const { pulau } = await params;
  const items = byPulau(pulau);
  if (items.length === 0) notFound();

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <p className="text-xs font-medium tracking-[0.2em] uppercase text-sambal mb-1">Jelajah pulau</p>
      <h1 className="font-display text-3xl md:text-5xl tracking-tight mb-2">{pulau}</h1>
      <p className="text-muted mb-6 max-w-xl">{NARASI[pulau] ?? `Kuliner dari ${pulau}.`}</p>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item, i) => (
          <ItemCard key={item.slug} item={item} delay={Math.min(i, 12) * 35} />
        ))}
      </div>
    </div>
  );
}
