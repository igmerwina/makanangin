"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react";
import { readStorage } from "@/lib/storage";
import { ORDER_AKTIF_KEY, type Order } from "@/lib/order";
import { formatRupiah } from "@/lib/harga";
import { gambarUntuk } from "@/lib/gambar";
import Gust from "@/components/Gust";

export default function PesananSelesaiPage() {
  const [order, setOrder] = useState<Order | null | undefined>(undefined);

  useEffect(() => {
    setOrder(readStorage<Order | null>(ORDER_AKTIF_KEY, null));
  }, []);

  // Skeleton matching the final shape, so the page does not flash empty.
  if (order === undefined) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16" aria-busy>
        <div className="mx-auto mb-4 h-12 w-24 animate-pulse rounded-full bg-surface" />
        <div className="mx-auto mb-3 h-12 w-4/5 animate-pulse rounded-full bg-surface" />
        <div className="mx-auto mb-12 h-6 w-3/5 animate-pulse rounded-full bg-surface" />
        <div className="space-y-3">
          {[0, 1].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-card bg-surface" />
          ))}
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="font-display text-3xl font-semibold">Ga ada pesanan aktif</h1>
        <p className="mx-auto mt-3 max-w-[34ch] text-ink-2">
          Belum ada angin yang dipesan di browser ini.
        </p>
        <Link
          href="/menu"
          className="mt-8 inline-flex min-h-12 items-center rounded-full bg-accent px-7 py-3.5 font-semibold text-on-accent active:scale-[0.98]"
        >
          Mulai pesan
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 lg:py-20">
      <div className="mb-14 text-center">
        <Gust className="mx-auto mb-6 w-20 text-kunyit" />
        <h1 className="font-display text-4xl font-semibold leading-[1.05] sm:text-5xl">
          Makanannya ga dateng.
        </h1>
        <p className="mx-auto mt-4 max-w-[40ch] text-lg text-ink-2">
          Tapi resepnya buat kamu. Kamu hemat{" "}
          <span className="tnum font-semibold text-accent">{formatRupiah(order.subtotal)}</span> hari
          ini.
        </p>
      </div>

      <h2 className="mb-4 font-display text-xl font-semibold">Resep kamu</h2>
      <ul className="mb-12 border-t border-line">
        {order.cart.map((line) => {
          const foto = gambarUntuk(line.slug, "card");
          return (
            <li key={line.id} className="border-b border-line">
              <Link href={`/resep/${line.slug}`} className="group flex items-center gap-4 py-4">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-inner bg-surface">
                  {foto ? (
                    <img
                      src={foto}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : (
                    <span className="absolute inset-0 flex items-center justify-center text-3xl" aria-hidden>
                      {line.emoji}
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-display text-base font-semibold text-ink transition-colors group-hover:text-accent">
                    {line.nama}
                  </p>
                  <p className="text-sm text-ink-2">Resep lengkap dan cerita asalnya</p>
                </div>
                <ArrowRight
                  size={18}
                  weight="bold"
                  aria-hidden
                  className="shrink-0 text-ink-2 transition-transform group-hover:translate-x-1"
                />
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="flex flex-wrap justify-center gap-3">
        <Link
          href="/menu"
          className="min-h-12 rounded-full bg-accent px-7 py-3.5 font-semibold text-on-accent transition-transform duration-150 hover:-translate-y-px active:translate-y-0"
        >
          Mulai pesan
        </Link>
        <Link
          href="/riwayat"
          className="min-h-12 rounded-full border border-line px-6 py-3.5 font-medium text-ink transition-colors hover:bg-surface"
        >
          Riwayat
        </Link>
      </div>
    </div>
  );
}
