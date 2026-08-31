"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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

  if (order === undefined) return null;

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <p className="mb-4">Ga ada pesanan aktif.</p>
        <Link href="/menu" className="underline">
          Pesan sesuatu
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 lg:py-16">
      <div className="text-center mb-10">
        <p className="text-7xl mb-4">
          <Gust className="inline-block w-12 mr-2 -mb-3 text-kunyit" />
          🍃
        </p>
        <h1 className="font-display text-4xl sm:text-5xl text-tinta mb-3">Makanannya ga dateng.</h1>
        <p className="text-lg text-muted">
          Tapi resepnya buat kamu. Kamu hemat{" "}
          <span className="font-semibold text-sambal">{formatRupiah(order.subtotal)}</span> hari ini.
        </p>
      </div>

      <p className="text-xs font-semibold tracking-[0.2em] uppercase text-sambal mb-3">Resep Kamu</p>
      <ul className="space-y-3 mb-10">
        {order.cart.map((line) => {
          const foto = gambarUntuk(line.slug, "card");
          return (
            <li key={line.id}>
              <Link
                href={`/resep/${line.slug}`}
                className="flex items-center gap-4 rounded-2xl bg-krem p-4 hover:ring-2 hover:ring-sambal/30 transition-all"
              >
                <div className="relative w-16 h-16 shrink-0 rounded-xl overflow-hidden bg-white flex items-center justify-center">
                  {foto ? (
                    <img
                      src={foto}
                      alt={line.nama}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl" aria-hidden>
                      {line.emoji}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-tinta">{line.nama}</p>
                  <p className="text-sm text-muted">Lihat resep lengkap →</p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="flex gap-3 justify-center">
        <Link
          href="/menu"
          className="px-6 py-3.5 min-h-11 rounded-full bg-sambal text-white font-semibold shadow-md hover:shadow-lg transition-shadow"
        >
          Pesan lagi
        </Link>
        <Link
          href="/riwayat"
          className="px-6 py-3.5 min-h-11 rounded-full bg-krem text-tinta font-medium hover:bg-beige transition-colors"
        >
          Riwayat
        </Link>
      </div>
    </div>
  );
}
