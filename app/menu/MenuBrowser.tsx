"use client";

import { useState } from "react";
import { MagnifyingGlass } from "@phosphor-icons/react";
import type { ItemIndex, Kategori } from "@/lib/types";
import { terapkanFilter } from "@/lib/filter";
import ItemCard from "@/components/ItemCard";

const KATEGORI: { value: Kategori | ""; label: string }[] = [
  { value: "", label: "Semua" },
  { value: "makanan", label: "Makanan" },
  { value: "minuman", label: "Minuman" },
  { value: "jajanan", label: "Jajanan" },
  { value: "kudapan", label: "Kudapan" },
];

export default function MenuBrowser({ items }: { items: ItemIndex[] }) {
  const [kategori, setKategori] = useState<Kategori | "">("");
  const [cari, setCari] = useState("");

  const hasil = terapkanFilter(items, { kategori: kategori || undefined, cari: cari || undefined });
  const disaring = kategori !== "" || cari !== "";

  function reset() {
    setKategori("");
    setCari("");
  }

  return (
    <div className="mt-8">
      <div className="sticky top-0 z-20 -mx-4 mb-8 border-b border-line bg-bg/90 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6 md:top-[68px] lg:-mx-10 lg:px-10">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative lg:w-80 lg:shrink-0">
            <label htmlFor="cari" className="sr-only">
              Cari hidangan
            </label>
            <MagnifyingGlass
              size={18}
              weight="bold"
              aria-hidden
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-2"
            />
            <input
              id="cari"
              type="search"
              value={cari}
              onChange={(e) => setCari(e.target.value)}
              placeholder="Cari nama, daerah, atau tag"
              className="min-h-12 w-full rounded-full border border-line bg-surface py-2 pl-11 pr-4 text-ink placeholder:text-ink-2 focus:border-accent focus:outline-none focus-visible:outline-2"
            />
          </div>

          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:mx-0 lg:flex-wrap lg:px-0 lg:pb-0">
            {KATEGORI.map((k) => (
              <button
                key={k.value}
                type="button"
                aria-pressed={kategori === k.value}
                onClick={() => setKategori(k.value)}
                className={`min-h-11 shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors active:scale-95 ${
                  kategori === k.value
                    ? "bg-accent text-on-accent"
                    : "border border-line text-ink-2 hover:bg-surface hover:text-ink"
                }`}
              >
                {k.label}
              </button>
            ))}
          </div>

          <p className="tnum text-sm text-ink-2 lg:ml-auto lg:shrink-0" aria-live="polite">
            {hasil.length} hidangan
          </p>
        </div>
      </div>

      {hasil.length === 0 ? (
        <div className="mx-auto max-w-sm rounded-card bg-surface px-6 py-14 text-center">
          <h2 className="font-display text-xl font-semibold">Ga ada yang cocok</h2>
          <p className="mt-2 text-sm text-ink-2">
            Coba kata lain, atau lepas filternya dan lihat semua {items.length} hidangan.
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-6 min-h-11 rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-on-accent active:scale-95"
          >
            Reset pencarian
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
          {hasil.map((item, i) => (
            <ItemCard key={item.slug} item={item} delay={Math.min(i, 12) * 35} />
          ))}
        </div>
      )}

      {disaring && hasil.length > 0 && (
        <button
          type="button"
          onClick={reset}
          className="mx-auto mt-10 block min-h-11 rounded-full border border-line px-5 py-2.5 text-sm font-medium text-ink-2 transition-colors hover:bg-surface hover:text-ink"
        >
          Tampilkan semua
        </button>
      )}
    </div>
  );
}
