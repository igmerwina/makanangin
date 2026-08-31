import { notFound } from "next/navigation";
import Link from "next/link";
import { allItems, getItem } from "@/lib/items";
import { formatRupiah } from "@/lib/harga";
import { warungUntuk } from "@/lib/warung";
import { gambarUntuk } from "@/lib/gambar";
import OpsiPicker from "@/components/OpsiPicker";

export function generateStaticParams() {
  return allItems().map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = getItem(slug);
  if (!item) return {};
  const foto = gambarUntuk(slug, "hero");
  return {
    title: `${item.nama} — Makan Angin`,
    description: item.deskripsi,
    openGraph: {
      title: item.nama,
      description: item.deskripsi,
      images: foto ? [{ url: foto }] : undefined,
    },
  };
}

export default async function ItemDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = getItem(slug);
  if (!item) notFound();
  const warung = warungUntuk(item);
  const foto = gambarUntuk(slug, "hero");

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:grid md:grid-cols-2 md:gap-10">
      <div>
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-krem/50 flex items-center justify-center mb-4">
          {foto ? (
            <img
              src={foto}
              alt={item.nama}
              loading="eager"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <span className="text-7xl" aria-hidden>
              {item.emoji}
            </span>
          )}
        </div>
        <h1 className="font-display text-3xl mb-1">{item.nama}</h1>
        <Link href={`/daerah/${item.pulau}`} className="text-muted underline text-sm">
          {item.daerah}
        </Link>
        <p className="mt-3">{item.deskripsi}</p>
        <p className="font-medium mt-3">{formatRupiah(item.harga)}</p>
        <p className="text-xs text-muted mt-1">
          Dijual oleh {warung.nama} — {warung.tagline}
        </p>

        <div className="mt-6 rounded-2xl border border-border bg-card p-4">
          <h2 className="font-display text-lg mb-1">Asal-usulnya</h2>
          <p className="text-sm">{item.cerita}</p>
        </div>
      </div>

      <div className="mt-6 md:mt-0">
        <OpsiPicker item={item} />
      </div>
    </div>
  );
}
