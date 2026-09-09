"use client";

import { useState } from "react";
import Link from "next/link";
import { MagnifyingGlass } from "@phosphor-icons/react";

export type BarisResep = {
  slug: string;
  nama: string;
  daerah: string;
  waktu: string;
  sulit: string;
  foto: string | null;
};

/** Two hundred recipes is too many to scan, so the index gets its own search. Filtering
 *  happens on an already-loaded array; no request, no debounce needed. */
export default function ResepBrowser({ baris }: { baris: BarisResep[] }) {
  const [cari, setCari] = useState("");

  const q = cari.trim().toLowerCase();
  const hasil = q
    ? baris.filter((b) => b.nama.toLowerCase().includes(q) || b.daerah.toLowerCase().includes(q))
    : baris;

  return (
    <div className="mt-8">
      <div className="relative mb-8 max-w-md">
        <label htmlFor="cari-resep" className="sr-only">
          Cari resep
        </label>
        <MagnifyingGlass
          size={18}
          weight="bold"
          aria-hidden
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-2"
        />
        <input
          id="cari-resep"
          type="search"
          value={cari}
          onChange={(e) => setCari(e.target.value)}
          placeholder="Cari resep atau daerah"
          className="min-h-12 w-full rounded-full border border-line bg-surface py-2 pl-11 pr-4 text-ink placeholder:text-ink-2 focus:border-accent focus:outline-none focus-visible:outline-2"
        />
      </div>

      {hasil.length === 0 ? (
        <div className="mx-auto max-w-sm rounded-card bg-surface px-6 py-14 text-center">
          <h2 className="font-display text-xl font-semibold">Ga ada resep yang cocok</h2>
          <p className="mt-2 text-sm text-ink-2">Coba nama hidangan atau nama daerahnya.</p>
          <button
            type="button"
            onClick={() => setCari("")}
            className="mt-6 min-h-11 rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-on-accent active:scale-95"
          >
            Reset pencarian
          </button>
        </div>
      ) : (
        <ul className="grid gap-x-6 sm:grid-cols-2 lg:grid-cols-3">
          {hasil.map((b) => (
            <li key={b.slug} className="border-b border-line">
              <Link href={`/resep/${b.slug}`} className="group flex items-center gap-4 py-3">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-inner bg-surface">
                  {b.foto && (
                    <img
                      src={b.foto}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-display text-base font-semibold text-ink transition-colors group-hover:text-accent">
                    {b.nama}
                  </p>
                  <p className="truncate text-xs text-ink-2">{b.daerah}</p>
                  <p className="mt-0.5 text-xs capitalize text-ink-2">
                    {b.waktu}, {b.sulit}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
