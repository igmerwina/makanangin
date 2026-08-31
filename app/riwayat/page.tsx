"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { readStorage, writeStorage } from "@/lib/storage";
import { RIWAYAT_KEY, type Order } from "@/lib/order";
import { formatRupiah } from "@/lib/harga";
import { gambarUntuk } from "@/lib/gambar";

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
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <p className="text-6xl mb-5">🕓</p>
        <h1 className="font-display text-3xl mb-2">Belum ada riwayat</h1>
        <p className="text-muted mb-7">Belum pernah pesan angin sekali pun.</p>
        <Link
          href="/menu"
          className="inline-block px-7 py-3.5 min-h-11 rounded-full bg-sambal text-white font-semibold shadow-md hover:shadow-lg transition-shadow"
        >
          Mulai sekarang
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 py-6 lg:py-10">
      <p className="text-xs font-semibold tracking-[0.2em] uppercase text-sambal mb-2">Riwayat Kamu</p>
      <h1 className="font-display text-3xl sm:text-4xl text-tinta mb-1">Pesanan sebelumnya</h1>
      <p className="text-muted mb-8">
        Total hemat sepanjang masa: <span className="font-semibold text-tinta">{formatRupiah(totalHemat)}</span>
      </p>

      <ul className="space-y-4 mb-6">
        {riwayat.map((order) => (
          <li key={order.id} className="rounded-2xl bg-krem p-5">
            <div className="flex justify-between text-xs text-muted mb-3">
              <span>{order.id}</span>
              <span>{new Date(order.waktu).toLocaleString("id-ID")}</span>
            </div>
            <div className="flex flex-wrap gap-3 mb-3">
              {order.cart.map((line) => {
                const foto = gambarUntuk(line.slug, "card");
                return (
                  <div
                    key={line.id}
                    className="relative w-14 h-14 shrink-0 rounded-xl overflow-hidden bg-white flex items-center justify-center"
                    title={line.nama}
                  >
                    {foto ? (
                      <img
                        src={foto}
                        alt={line.nama}
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl" aria-hidden>
                        {line.emoji}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
            <p className="text-sm text-muted mb-1">{order.cart.map((l) => l.nama).join(", ")}</p>
            <p className="font-semibold text-tinta">{formatRupiah(order.subtotal)}</p>
          </li>
        ))}
      </ul>

      <button type="button" onClick={hapusRiwayat} className="text-sm text-muted underline hover:text-sambal">
        Hapus riwayat
      </button>
    </div>
  );
}
