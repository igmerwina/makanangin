import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/ssr";
import { allItems, indexByPulau } from "@/lib/items";
import ItemCard from "@/components/ItemCard";

const NARASI: Record<string, string> = {
  Sumatera: "Dari Aceh sampai Lampung, rempah dan asap jadi ciri khas dapur pesisirnya.",
  Jawa: "Pulau dengan warung paling padat sejauh mata memandang, gurih santan dan manis kecap mendominasi.",
  Bali: "Base genep, bumbu dasar lengkap, jadi fondasi hampir semua hidangannya.",
  "Nusa Tenggara": "Daging bakar dan asap jadi andalan, iklim keringnya cocok untuk pengawetan tradisional.",
  Kalimantan: "Sungai-sungai besar jadi jalur dagang sekaligus sumber ikan air tawarnya.",
  Sulawesi: "Rasa berani, asam pedas dan segar sekaligus, khas masakan pesisirnya.",
  Maluku: "Kepulauan rempah asli, ikan segar dan kunyit jadi andalan dapur sehari-hari.",
  Papua: "Sagu jadi makanan pokok pengganti nasi, diolah sederhana tapi mengenyangkan.",
};

export function generateStaticParams() {
  const pulauSet = new Set(allItems().map((i) => i.pulau));
  return Array.from(pulauSet).map((pulau) => ({ pulau }));
}

export async function generateMetadata({ params }: { params: Promise<{ pulau: string }> }) {
  const { pulau } = await params;
  return { title: `Kuliner ${pulau}`, description: NARASI[pulau] };
}

export default async function DaerahPage({ params }: { params: Promise<{ pulau: string }> }) {
  const { pulau } = await params;
  const items = indexByPulau(pulau);
  if (items.length === 0) notFound();

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
      <Link
        href="/menu"
        className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-ink-2 transition-colors hover:text-accent"
      >
        <ArrowLeft size={16} weight="bold" aria-hidden />
        Semua menu
      </Link>

      <h1 className="font-display text-4xl font-semibold sm:text-6xl">{pulau}</h1>
      <p className="mt-3 max-w-[54ch] text-lg text-ink-2">{NARASI[pulau] ?? `Kuliner dari ${pulau}.`}</p>
      <p className="tnum mt-2 text-sm text-ink-2">{items.length} hidangan</p>

      <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
        {items.map((item, i) => (
          <ItemCard key={item.slug} item={item} delay={Math.min(i, 12) * 35} />
        ))}
      </div>
    </div>
  );
}
