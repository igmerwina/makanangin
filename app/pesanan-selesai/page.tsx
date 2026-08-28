"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { readStorage } from "@/lib/storage";
import { ORDER_AKTIF_KEY, type Order } from "@/lib/order";
import { formatRupiah } from "@/lib/harga";

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
    <div className="max-w-xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <p className="text-5xl mb-3">🍃</p>
        <h1 className="font-display text-2xl mb-2">Makanannya ga dateng.</h1>
        <p className="text-muted">
          Tapi resepnya buat kamu. Kamu hemat {formatRupiah(order.subtotal)} hari ini.
        </p>
      </div>

      <ul className="space-y-3 mb-8">
        {order.cart.map((line) => (
          <li key={line.id}>
            <Link
              href={`/resep/${line.slug}`}
              className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 hover:border-sambal"
            >
              <span className="text-3xl" aria-hidden>
                {line.emoji}
              </span>
              <div className="flex-1">
                <p className="font-medium">{line.nama}</p>
                <p className="text-sm text-muted">Lihat resep lengkap →</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <div className="flex gap-3 justify-center">
        <Link href="/menu" className="px-5 py-3 min-h-11 rounded-full bg-sambal text-white font-medium">
          Pesan lagi
        </Link>
        <Link href="/riwayat" className="px-5 py-3 min-h-11 rounded-full border border-border">
          Riwayat
        </Link>
      </div>
    </div>
  );
}
