"use client";

import { useState } from "react";
import type { Item, Kategori } from "@/lib/types";
import { terapkanFilter } from "@/lib/filter";
import ItemCard from "@/components/ItemCard";

const KATEGORI: { value: Kategori | ""; label: string }[] = [
  { value: "", label: "Semua" },
  { value: "makanan", label: "Makanan" },
  { value: "minuman", label: "Minuman" },
  { value: "jajanan", label: "Jajanan" },
  { value: "kudapan", label: "Kudapan" },
];

export default function MenuBrowser({ items }: { items: Item[] }) {
  const [kategori, setKategori] = useState<Kategori | "">("");
  const [cari, setCari] = useState("");

  const hasil = terapkanFilter(items, { kategori: kategori || undefined, cari: cari || undefined });

  return (
    <div>
      <input
        type="search"
        value={cari}
        onChange={(e) => setCari(e.target.value)}
        placeholder="Cari nama, daerah, atau tag…"
        className="w-full mb-3 px-4 py-2 min-h-11 rounded-full border border-border bg-card"
      />

      <div className="flex gap-2 overflow-x-auto pb-1 mb-4 md:flex-wrap">
        {KATEGORI.map((k) => (
          <button
            key={k.value}
            type="button"
            aria-pressed={kategori === k.value}
            onClick={() => setKategori(k.value)}
            className={`shrink-0 px-4 py-2 min-h-11 rounded-full border text-sm transition-all active:scale-95 ${
              kategori === k.value ? "bg-sambal text-white border-sambal scale-105" : "border-border bg-card"
            }`}
          >
            {k.label}
          </button>
        ))}
      </div>

      {hasil.length === 0 ? (
        <p className="text-muted text-center py-10">Ga ada. Coba kata lain.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {hasil.map((item, i) => (
            <ItemCard key={item.slug} item={item} delay={Math.min(i, 12) * 35} />
          ))}
        </div>
      )}
    </div>
  );
}
