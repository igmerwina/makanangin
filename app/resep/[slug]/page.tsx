import { notFound } from "next/navigation";
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
    title: `Resep ${item.nama} — Makan Angin`,
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
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 py-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="relative aspect-[21/9] sm:aspect-[3/1] rounded-2xl overflow-hidden bg-krem flex items-center justify-center mb-6">
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

      <p className="text-xs font-semibold tracking-[0.2em] uppercase text-sambal mb-1">{item.daerah}</p>
      <h1 className="font-display text-3xl sm:text-4xl text-tinta mb-6">Resep {item.nama}</h1>

      <div className="md:grid md:grid-cols-[300px_1fr] md:gap-10">
        <div>
          <div className="md:sticky md:top-24 rounded-2xl bg-krem p-5">
            <dl className="grid grid-cols-3 gap-2 text-sm mb-4">
              <div>
                <dt className="text-muted">Porsi</dt>
                <dd className="font-medium">{resep.porsi}</dd>
              </div>
              <div>
                <dt className="text-muted">Waktu</dt>
                <dd className="font-medium">{resep.waktu}</dd>
              </div>
              <div>
                <dt className="text-muted">Sulit</dt>
                <dd className="font-medium capitalize">{resep.sulit}</dd>
              </div>
            </dl>
            <h2 className="font-display text-lg mb-2">Bahan</h2>
            <ul className="list-disc list-inside space-y-1 text-sm">
              {resep.bahan.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6 md:mt-0">
          <h2 className="font-display text-lg mb-2">Langkah</h2>
          <ol className="space-y-3">
            {resep.langkah.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="shrink-0 w-7 h-7 rounded-full bg-sambal text-white text-sm flex items-center justify-center">
                  {i + 1}
                </span>
                <p className="pt-0.5">{step}</p>
              </li>
            ))}
          </ol>
          {resep.tips && (
            <p className="mt-4 text-sm rounded-xl bg-kunyit/20 p-3">
              <strong>Tips:</strong> {resep.tips}
            </p>
          )}

          <a
            href={youtubeSearchUrl(item.nama, item.daerah)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 flex items-center gap-3 rounded-2xl border border-border bg-card p-4 hover:border-sambal transition-colors"
          >
            <span className="shrink-0 w-11 h-11 rounded-full bg-sambal text-white flex items-center justify-center text-lg" aria-hidden>
              ▶
            </span>
            <span>
              <span className="block font-medium">Cari tutorial video {item.nama}</span>
              <span className="block text-xs text-muted">Buka pencarian YouTube di tab baru</span>
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
