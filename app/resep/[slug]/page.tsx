import { notFound } from "next/navigation";
import { allItems, getItem } from "@/lib/items";

export function generateStaticParams() {
  return allItems().map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = getItem(slug);
  if (!item) return {};
  return {
    title: `Resep ${item.nama} — Makan Angin`,
    description: `Cara masak ${item.nama} khas ${item.daerah}. ${item.resep.bahan.length} bahan, ${item.resep.waktu}.`,
  };
}

export default async function ResepDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = getItem(slug);
  if (!item) notFound();
  const { resep } = item;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: item.nama,
    description: item.deskripsi,
    recipeYield: `${resep.porsi} porsi`,
    recipeIngredient: resep.bahan,
    recipeInstructions: resep.langkah.map((step) => ({ "@type": "HowToStep", text: step })),
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:grid md:grid-cols-[280px_1fr] md:gap-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div>
        <h1 className="font-display text-2xl mb-1">
          {item.emoji} Resep {item.nama}
        </h1>
        <p className="text-muted text-sm mb-4">{item.daerah}</p>

        <div className="md:sticky md:top-20 rounded-2xl border border-border bg-card p-4">
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
      </div>
    </div>
  );
}
