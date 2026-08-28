import Link from "next/link";
import { allItems } from "@/lib/items";

export const metadata = { title: "Resep — Makan Angin" };

export default function ResepIndexPage() {
  const items = allItems();

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="font-display text-2xl md:text-3xl mb-4">Semua Resep</h1>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {items.map((item) => (
          <li key={item.slug}>
            <Link
              href={`/resep/${item.slug}`}
              className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 hover:border-sambal"
            >
              <span className="text-3xl" aria-hidden>
                {item.emoji}
              </span>
              <div>
                <p className="font-medium">{item.nama}</p>
                <p className="text-sm text-muted">
                  {item.resep.waktu} · {item.resep.sulit}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
