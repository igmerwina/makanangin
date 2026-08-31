import { notFound } from "next/navigation";
import Link from "next/link";
import { allItems, getItem } from "@/lib/items";
import { formatRupiah, unitLabel } from "@/lib/harga";
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
  const badge = item.tipe === "tradisional" ? `Khas ${item.daerah}` : "Favorit Semua Orang";

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      {/* ---------- hero ---------- */}
      <div className="pt-6 lg:pt-12 lg:grid lg:grid-cols-2 lg:gap-14 lg:items-start">
        {/* image column */}
        <div className="relative">
          <div aria-hidden className="dot-pattern hidden lg:block absolute -z-10 -top-6 -left-6 w-32 h-32 opacity-50" />
          <div className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-krem ring-1 ring-border">
            {foto ? (
              <img
                src={foto}
                alt={item.nama}
                loading="eager"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />
            ) : (
              <span className="absolute inset-0 flex items-center justify-center text-8xl" aria-hidden>
                {item.emoji}
              </span>
            )}
            <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold tracking-wide text-tinta shadow-sm">
              🔥 {badge.toUpperCase()}
            </span>
          </div>
        </div>

        {/* info column */}
        <div className="mt-6 lg:mt-0 flex flex-col">
          <Link
            href={`/daerah/${item.pulau}`}
            className="inline-flex w-fit items-center gap-1 text-xs font-semibold tracking-[0.18em] uppercase text-sambal hover:underline mb-2"
          >
            {item.daerah}
          </Link>

          <h1 className="font-display text-4xl sm:text-5xl leading-[1.05] tracking-tight text-tinta mb-3">
            {item.nama}
          </h1>

          <p className="text-base text-foreground/70 leading-relaxed max-w-md mb-5">{item.deskripsi}</p>

          {item.halal && (
            <div className="mb-6">
              <span className="inline-flex items-center gap-1 rounded-full bg-pandan/10 text-pandan text-xs font-medium px-2.5 py-1.5">
                ✓ Halal
              </span>
            </div>
          )}

          <div className={`flex items-baseline gap-2 ${item.pedas > 0 ? "mb-2" : "mb-6"}`}>
            <span className="font-display text-4xl text-tinta">{formatRupiah(item.harga)}</span>
            <span className="text-sm text-muted">{unitLabel(item.kategori)}</span>
          </div>

          {item.pedas > 0 && (
            <p className="text-sm text-sambal mb-6" aria-label={`Level pedas ${item.pedas} dari 5`}>
              {"🌶️".repeat(item.pedas)} <span className="text-muted">level pedas</span>
            </p>
          )}

          <OpsiPicker item={item} />

          <p className="mt-4 text-xs text-muted">
            Dikemas rapi — soal beneran nyampe apa nggak, itu urusan lain. 😅
          </p>

          <div className="mt-6 pt-5 border-t border-border flex items-start gap-3">
            <span className="text-lg shrink-0" aria-hidden>
              🏪
            </span>
            <p className="text-sm text-muted">
              Dijual oleh <span className="text-foreground font-medium">{warung.nama}</span> — {warung.tagline}
            </p>
          </div>
        </div>
      </div>

      {/* ---------- origin story ---------- */}
      <div className="mt-12 lg:mt-20 mb-16 rounded-3xl bg-krem px-6 py-10 sm:px-10 sm:py-12 lg:px-16">
        <p className="text-xs font-semibold tracking-[0.25em] uppercase text-sambal mb-3">Asal-Usul</p>
        <h2 className="font-display text-2xl sm:text-3xl text-tinta mb-5 max-w-xl">
          {item.nama} dari {item.daerah}
        </h2>
        <p className="text-base sm:text-lg leading-relaxed text-foreground/80 max-w-2xl">{item.cerita}</p>
      </div>
    </div>
  );
}
