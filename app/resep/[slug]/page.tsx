import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Lightbulb, Play } from "@phosphor-icons/react/ssr";
import { allItems, getItem } from "@/lib/items";
import { gambarUntuk } from "@/lib/gambar";
import { youtubeSearchUrl } from "@/lib/video";

export function generateStaticParams() {
  return allItems().map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = getItem(slug);
  if (!item) return {};
  const foto = gambarUntuk(slug, "hero");
  return {
    title: `Resep ${item.nama}`,
    description: `Cara masak ${item.nama} khas ${item.daerah}. ${item.resep.bahan.length} bahan, ${item.resep.waktu}.`,
    openGraph: { images: foto ? [{ url: foto }] : undefined },
  };
}

export default async function ResepDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = getItem(slug);
  if (!item) notFound();
  const { resep } = item;
  const foto = gambarUntuk(slug, "hero");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: item.nama,
    description: item.deskripsi,
    image: foto ?? undefined,
    recipeYield: `${resep.porsi} porsi`,
    recipeIngredient: resep.bahan,
    recipeInstructions: resep.langkah.map((step) => ({ "@type": "HowToStep", text: step })),
  };

  return (
    <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <Link
        href="/resep"
        className="inline-flex items-center gap-2 py-5 text-sm font-medium text-ink-2 transition-colors hover:text-accent"
      >
        <ArrowLeft size={16} weight="bold" aria-hidden />
        Semua resep
      </Link>

      <div className="relative mb-8 flex aspect-[21/9] items-center justify-center overflow-hidden rounded-card bg-surface sm:aspect-[3/1]">
        {foto ? (
          <img
            src={foto}
            alt={item.nama}
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <span className="text-7xl" aria-hidden>
            {item.emoji}
          </span>
        )}
      </div>

      <h1 className="font-display text-4xl font-semibold leading-[1.05] sm:text-5xl">
        Resep {item.nama}
      </h1>
      <p className="mt-2 text-ink-2">
        Khas {item.daerah}.{" "}
        <Link href={`/menu/${item.slug}`} className="underline underline-offset-2 hover:text-accent">
          Lihat halaman menunya
        </Link>
        .
      </p>

      <div className="mb-16 mt-10 md:grid md:grid-cols-[300px_1fr] md:gap-14">
        <div>
          <div className="rounded-card bg-surface p-6 md:sticky md:top-[92px]">
            <dl className="mb-6 grid grid-cols-3 gap-2 text-sm">
              <div>
                <dt className="text-ink-2">Porsi</dt>
                <dd className="tnum font-medium text-ink">{resep.porsi}</dd>
              </div>
              <div>
                <dt className="text-ink-2">Waktu</dt>
                <dd className="font-medium text-ink">{resep.waktu}</dd>
              </div>
              <div>
                <dt className="text-ink-2">Sulit</dt>
                <dd className="font-medium capitalize text-ink">{resep.sulit}</dd>
              </div>
            </dl>
            <h2 className="mb-3 font-display text-lg font-semibold">Bahan</h2>
            <ul className="space-y-2 text-sm text-ink-2">
              {resep.bahan.map((b, i) => (
                <li key={i} className="flex gap-2.5">
                  <span aria-hidden className="mt-2 h-px w-2.5 shrink-0 bg-line" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 md:mt-0">
          <h2 className="mb-5 font-display text-lg font-semibold">Langkah</h2>
          <ol className="space-y-5">
            {resep.langkah.map((step, i) => (
              <li key={i} className="flex gap-4">
                <span className="tnum flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-soft text-sm font-semibold text-accent">
                  {i + 1}
                </span>
                <p className="max-w-[65ch] pt-1 leading-relaxed text-ink-2">{step}</p>
              </li>
            ))}
          </ol>

          {resep.tips && (
            <p className="mt-8 flex max-w-[65ch] gap-3 rounded-card bg-surface p-5 text-sm leading-relaxed text-ink-2">
              <Lightbulb size={18} weight="fill" aria-hidden className="mt-0.5 shrink-0 text-kunyit" />
              <span>
                <strong className="font-semibold text-ink">Tips:</strong> {resep.tips}
              </span>
            </p>
          )}

          <a
            href={youtubeSearchUrl(item.nama, item.daerah)}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-6 flex max-w-[65ch] items-center gap-4 rounded-card border border-line p-4 transition-colors hover:border-accent"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent text-on-accent">
              <Play size={18} weight="fill" aria-hidden />
            </span>
            <span>
              <span className="block font-medium text-ink">Cari tutorial video {item.nama}</span>
              <span className="block text-xs text-ink-2">Buka pencarian YouTube di tab baru</span>
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
