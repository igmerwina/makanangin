import Link from "next/link";
import { allItems } from "@/lib/items";
import { gambarUntuk } from "@/lib/gambar";

export const metadata = { title: "Resep — Makan Angin" };

export default function ResepIndexPage() {
  const items = allItems();

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="font-display text-2xl md:text-3xl mb-4">Semua Resep</h1>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {items.map((item) => {
          const foto = gambarUntuk(item.slug, "card");
          return (
            <li key={item.slug}>
              <Link
                href={`/resep/${item.slug}`}
                className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 hover:border-sambal"
              >
                <div className="relative w-14 h-14 shrink-0 rounded-xl overflow-hidden bg-krem/50 flex items-center justify-center">
                  {foto ? (
                    <img
                      src={foto}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl" aria-hidden>
                      {item.emoji}
                    </span>
                  )}
                </div>
                <div>
                  <p className="font-medium">{item.nama}</p>
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
