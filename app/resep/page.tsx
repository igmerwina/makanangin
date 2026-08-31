import Link from "next/link";
import { allItems } from "@/lib/items";
import { gambarUntuk } from "@/lib/gambar";

export const metadata = { title: "Resep — Makan Angin" };

export default function ResepIndexPage() {
  const items = allItems();

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 py-6 lg:py-10">
      <p className="text-xs font-semibold tracking-[0.2em] uppercase text-sambal mb-2">80 Resep Asli</p>
      <h1 className="font-display text-3xl sm:text-4xl text-tinta mb-6">Semua Resep</h1>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => {
          const foto = gambarUntuk(item.slug, "card");
          return (
            <li key={item.slug}>
              <Link
                href={`/resep/${item.slug}`}
                className="flex items-center gap-4 rounded-2xl bg-krem p-3 hover:ring-2 hover:ring-sambal/30 transition-all"
              >
                <div className="relative w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-white flex items-center justify-center">
                  {foto ? (
                    <img
                      src={foto}
                      alt={item.nama}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl" aria-hidden>
                      {item.emoji}
                    </span>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-tinta truncate">{item.nama}</p>
                  <p className="text-xs text-muted mb-1 truncate">{item.daerah}</p>
                  <p className="text-sm text-muted">
                    {item.resep.waktu} · {item.resep.sulit}
                  </p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
