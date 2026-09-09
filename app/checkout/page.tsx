"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, WarningCircle } from "@phosphor-icons/react";
import { useCart } from "@/lib/CartProvider";
import { formatRupiah, totalPesanan } from "@/lib/harga";
import { gambarUntuk } from "@/lib/gambar";
import { readStorage, writeStorage } from "@/lib/storage";
import { RIWAYAT_KEY, ORDER_AKTIF_KEY, type Order } from "@/lib/order";
import PaymentMethod from "@/components/PaymentMethod";
import RincianBiaya from "@/components/RincianBiaya";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, subtotal } = useCart();
  const total = totalPesanan(subtotal);

  const [alamat, setAlamat] = useState("Depan warung, sebelah yang lagi tutup");
  const [errorAlamat, setErrorAlamat] = useState<string | null>(null);

  function bayar() {
    if (alamat.trim().length < 8) {
      setErrorAlamat("Tulis alamat pengantaran dulu, minimal 8 karakter.");
      document.getElementById("alamat")?.focus();
      return;
    }
    setErrorAlamat(null);

    const order: Order = {
      id: `MA-${Math.floor(Math.random() * 900000 + 100000)}`,
      cart,
      subtotal: total,
      waktu: new Date().toISOString(),
    };
    const riwayat = readStorage<Order[]>(RIWAYAT_KEY, []);
    writeStorage(RIWAYAT_KEY, [order, ...riwayat]);
    writeStorage(ORDER_AKTIF_KEY, order);
    // keranjang dikosongkan di halaman /kurir setelah order tersimpan, bukan di sini,
    // supaya halaman ini ga sempat render ulang ke state "keranjang kosong" sebelum navigasi kelar.
    router.push("/kurir");
  }

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="font-display text-3xl font-semibold">Ga ada yang dibayar</h1>
        <p className="mx-auto mt-3 max-w-[34ch] text-ink-2">Keranjangmu kosong, jadi checkout-nya lewat.</p>
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
    <div className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
      <Link
        href="/keranjang"
        className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-ink-2 transition-colors hover:text-accent"
      >
        <ArrowLeft size={16} weight="bold" aria-hidden />
        Kembali ke keranjang
      </Link>

      <h1 className="font-display text-4xl font-semibold sm:text-5xl">Checkout</h1>

      <div className="mt-8 lg:grid lg:grid-cols-3 lg:items-start lg:gap-12">
        <div className="space-y-8 lg:col-span-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-ink" htmlFor="alamat">
              Alamat pengantaran
            </label>
            <input
              id="alamat"
              value={alamat}
              onChange={(e) => {
                setAlamat(e.target.value);
                if (errorAlamat) setErrorAlamat(null);
              }}
              aria-invalid={errorAlamat ? true : undefined}
              aria-describedby={errorAlamat ? "alamat-error" : "alamat-bantuan"}
              className={`min-h-12 w-full rounded-full border bg-surface px-5 py-3 text-ink placeholder:text-ink-2 focus:outline-none focus-visible:outline-2 ${
                errorAlamat ? "border-accent" : "border-line focus:border-accent"
              }`}
            />
            {errorAlamat ? (
              <p id="alamat-error" className="mt-2 flex items-center gap-1.5 text-sm text-accent">
                <WarningCircle size={16} weight="bold" aria-hidden />
                {errorAlamat}
              </p>
            ) : (
              <p id="alamat-bantuan" className="mt-2 text-xs text-ink-2">
                Ga dikirim ke mana pun. Cuma disimpan sebentar di browser kamu.
              </p>
            )}
          </div>

          <div>
            <p className="mb-2 text-sm font-semibold text-ink">Pembayaran</p>
            <PaymentMethod total={total} />
          </div>
        </div>

        <aside className="mt-10 rounded-card bg-surface p-6 lg:sticky lg:top-[92px] lg:mt-0">
          <h2 className="mb-5 font-display text-lg font-semibold">Pesananmu</h2>

          <ul className="mb-5 space-y-3">
            {cart.map((line) => {
              const foto = gambarUntuk(line.slug, "card");
              return (
                <li key={line.id} className="flex items-center gap-3">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-inner bg-bg">
                    {foto ? (
                      <img
                        src={foto}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    ) : (
                      <span className="absolute inset-0 flex items-center justify-center text-xl" aria-hidden>
                        {line.emoji}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink">{line.nama}</p>
                    <p className="tnum text-xs text-ink-2">{line.qty}x</p>
                  </div>
                  <p className="tnum shrink-0 text-sm font-medium text-ink">
                    {formatRupiah(line.hargaSatuan * line.qty)}
                  </p>
                </li>
              );
            })}
          </ul>

          <div className="border-t border-line pt-5">
            <RincianBiaya subtotal={subtotal} labelTotal="Total bayar" />
          </div>

          <button
            type="button"
            onClick={bayar}
            className="tnum mt-6 min-h-[52px] w-full whitespace-nowrap rounded-full bg-accent px-6 py-4 text-base font-semibold text-on-accent transition-transform duration-150 hover:-translate-y-px active:translate-y-0"
          >
            Bayar {formatRupiah(total)}
          </button>
        </aside>
      </div>
    </div>
  );
}
