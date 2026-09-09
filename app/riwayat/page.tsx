"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ClockCounterClockwise } from "@phosphor-icons/react";
import { readStorage, writeStorage } from "@/lib/storage";
import { RIWAYAT_KEY, type Order } from "@/lib/order";
import { formatRupiah } from "@/lib/harga";
import { gambarUntuk } from "@/lib/gambar";

export default function RiwayatPage() {
  const [riwayat, setRiwayat] = useState<Order[]>([]);
  const [siapHapus, setSiapHapus] = useState(false);

  useEffect(() => {
    setRiwayat(readStorage<Order[]>(RIWAYAT_KEY, []));
  }, []);

  const totalHemat = riwayat.reduce((sum, o) => sum + o.subtotal, 0);

  function hapusRiwayat() {
    writeStorage(RIWAYAT_KEY, []);
    setRiwayat([]);
    setSiapHapus(false);
  }

  if (riwayat.length === 0) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <span className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-surface text-ink-2">
          <ClockCounterClockwise size={34} aria-hidden />
        </span>
        <h1 className="font-display text-3xl font-semibold">Belum ada riwayat</h1>
        <p className="mx-auto mt-3 max-w-[34ch] text-ink-2">Belum pernah pesan angin sekali pun.</p>
        <Link
          href="/menu"
          className="mt-8 inline-flex min-h-12 items-center rounded-full bg-accent px-7 py-3.5 font-semibold text-on-accent transition-transform duration-150 hover:-translate-y-px active:translate-y-0"
        >
          Mulai pesan
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
      <h1 className="font-display text-4xl font-semibold sm:text-5xl">Riwayat</h1>
      <p className="mt-2 text-ink-2">
        Total hemat sepanjang masa:{" "}
        <span className="tnum font-semibold text-ink">{formatRupiah(totalHemat)}</span>
      </p>

      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {riwayat.map((order) => (
          <li key={order.id} className="rounded-card border border-line p-5">
            <div className="mb-4 flex justify-between text-xs text-ink-2">
              <span className="tnum font-medium">{order.id}</span>
              <time className="tnum" dateTime={order.waktu}>
                {new Date(order.waktu).toLocaleString("id-ID")}
              </time>
            </div>
            <div className="mb-4 flex flex-wrap gap-2">
              {order.cart.map((line) => {
                const foto = gambarUntuk(line.slug, "card");
                return (
                  <div
                    key={line.id}
                    className="relative h-14 w-14 shrink-0 overflow-hidden rounded-inner bg-surface"
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
                      <span className="absolute inset-0 flex items-center justify-center text-2xl" aria-hidden>
                        {line.emoji}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
            <p className="mb-1 text-sm text-ink-2">{order.cart.map((l) => l.nama).join(", ")}</p>
            <p className="tnum font-semibold text-ink">{formatRupiah(order.subtotal)}</p>
          </li>
        ))}
      </ul>

      <div className="mt-10">
        {siapHapus ? (
          <div className="flex flex-wrap items-center gap-3 rounded-card border border-accent p-4">
            <p className="text-sm text-ink">
              Hapus semua {riwayat.length} riwayat dari browser ini? Ga bisa dibalikin.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={hapusRiwayat}
                className="min-h-11 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-on-accent active:scale-95"
              >
                Ya, hapus
              </button>
              <button
                type="button"
                onClick={() => setSiapHapus(false)}
                className="min-h-11 rounded-full border border-line px-5 py-2.5 text-sm font-medium text-ink-2 hover:bg-surface hover:text-ink"
              >
                Batal
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setSiapHapus(true)}
            className="min-h-11 rounded-full border border-line px-5 py-2.5 text-sm font-medium text-ink-2 transition-colors hover:bg-surface hover:text-ink"
          >
            Hapus riwayat
          </button>
        )}
      </div>
    </div>
  );
}
