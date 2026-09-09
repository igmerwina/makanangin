import { allItems } from "@/lib/items";
import { gambarUntuk } from "@/lib/gambar";
import ResepBrowser, { type BarisResep } from "./ResepBrowser";

export const metadata = {
  title: "Resep",
  description: "80 resep masakan Indonesia, ditulis ulang, lengkap dengan bahan dan langkahnya.",
};

export default function ResepIndexPage() {
  const baris: BarisResep[] = allItems().map((item) => ({
    slug: item.slug,
    nama: item.nama,
    daerah: item.daerah,
    waktu: item.resep.waktu,
    sulit: item.resep.sulit,
    foto: gambarUntuk(item.slug, "card"),
  }));

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
      <h1 className="font-display text-4xl font-semibold sm:text-5xl">Resep</h1>
      <p className="mt-2 max-w-[52ch] text-ink-2">
        {baris.length} resep, ditulis ulang dari nol. Bahan, langkah, dan cerita asal daerahnya.
      </p>
      <ResepBrowser baris={baris} />
    </div>
  );
}
