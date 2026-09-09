import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Pepper, Storefront } from "@phosphor-icons/react/ssr";
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
    title: item.nama,
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
    <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-10">
      <Link
        href="/menu"
        className="inline-block py-5 text-sm font-medium text-ink-2 transition-colors hover:text-accent"
      >
        Kembali ke menu
      </Link>

      <div className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-14">
        <div className="lg:col-span-6 lg:sticky lg:top-[92px]">
          <div className="relative aspect-[4/3] overflow-hidden rounded-card bg-surface">
            {foto ? (
              <img
                src={foto}
                alt={item.nama}
                fetchPriority="high"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <span className="absolute inset-0 flex items-center justify-center text-8xl" aria-hidden>
                {item.emoji}
              </span>
            )}
          </div>
        </div>

        <div className="mt-8 flex flex-col lg:col-span-6 lg:mt-0">
          <h1 className="font-display text-4xl font-semibold leading-[1.03] sm:text-5xl">{item.nama}</h1>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Link
              href={`/daerah/${item.pulau}`}
              className="min-h-8 rounded-full bg-accent-soft px-3 py-1.5 text-sm font-medium text-accent transition-opacity hover:opacity-80"
            >
              {item.daerah}
            </Link>
            {item.halal && (
              <span className="inline-flex min-h-8 items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-sm font-medium text-pandan">
                <CheckCircle size={15} weight="bold" aria-hidden />
                Halal
              </span>
            )}
            {item.pedas > 0 && (
              <span
                className="tnum inline-flex min-h-8 items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-sm font-medium text-accent"
                aria-label={`Level pedas ${item.pedas} dari 5`}
              >
                <Pepper size={15} weight="fill" aria-hidden />
                Pedas {item.pedas}/5
              </span>
            )}
          </div>

          <p className="mt-5 max-w-[58ch] leading-relaxed text-ink-2">{item.deskripsi}</p>

          <div className="mt-6 flex items-baseline gap-2">
            <span className="tnum font-display text-4xl font-semibold">{formatRupiah(item.harga)}</span>
            <span className="text-sm text-ink-2">{unitLabel(item.kategori)}</span>
          </div>

          <div className="mt-7">
            <OpsiPicker item={item} />
          </div>

          <p className="mt-4 text-xs text-ink-2">
            Dikemas rapi. Soal beneran nyampe apa nggak, itu urusan lain.
          </p>

          <div className="mt-7 flex items-start gap-3 border-t border-line pt-6">
            <Storefront size={20} weight="bold" aria-hidden className="mt-0.5 shrink-0 text-ink-2" />
            <p className="text-sm text-ink-2">
              Dijual oleh <span className="font-medium text-ink">{warung.nama}</span>. {warung.tagline}
            </p>
          </div>
        </div>
      </div>

      <section className="mb-16 mt-14 lg:mt-24">
        <div className="max-w-3xl border-t-2 border-ink pt-8">
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">
            {item.nama} dari {item.daerah}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-ink-2">{item.cerita}</p>
        </div>
      </section>
    </div>
  );
}
