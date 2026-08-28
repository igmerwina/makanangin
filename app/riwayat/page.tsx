"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { readStorage, writeStorage } from "@/lib/storage";
import { RIWAYAT_KEY, type Order } from "@/lib/order";
import { formatRupiah } from "@/lib/harga";

export default function RiwayatPage() {
  const [riwayat, setRiwayat] = useState<Order[]>([]);

  useEffect(() => {
    setRiwayat(readStorage<Order[]>(RIWAYAT_KEY, []));
  }, []);

  const totalHemat = riwayat.reduce((sum, o) => sum + o.subtotal, 0);

  function hapusRiwayat() {
    writeStorage(RIWAYAT_KEY, []);
    setRiwayat([]);
  }

  if (riwayat.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <p className="mb-4 text-muted">Belum pernah pesan angin.</p>
        <Link href="/menu" className="underline">
          Mulai sekarang
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      <h1 className="font-display text-2xl mb-1">Riwayat</h1>
      <p className="text-muted text-sm mb-4">Total hemat sepanjang masa: {formatRupiah(totalHemat)}</p>

      <ul className="space-y-3 mb-4">
        {riwayat.map((order) => (
          <li key={order.id} className="rounded-2xl border border-border bg-card p-4">
            <div className="flex justify-between text-sm text-muted mb-2">
              <span>{order.id}</span>
              <span>{new Date(order.waktu).toLocaleString("id-ID")}</span>
            </div>
            <p className="text-sm">
              {order.cart.map((l) => `${l.emoji} ${l.nama}`).join(", ")}
            </p>
            <p className="font-medium mt-1">{formatRupiah(order.subtotal)}</p>
          </li>
        ))}
      </ul>

      <button type="button" onClick={hapusRiwayat} className="text-sm text-muted underline">
        Hapus riwayat
      </button>
    </div>
  );
}
