"use client";

import { useRouter } from "next/navigation";
import { useCart } from "@/lib/CartProvider";
import { formatRupiah } from "@/lib/harga";
import { gambarUntuk } from "@/lib/gambar";
import { readStorage, writeStorage } from "@/lib/storage";
import { RIWAYAT_KEY, ORDER_AKTIF_KEY, type Order } from "@/lib/order";

const ONGKIR = 5000;
const BIAYA_RINDU = 2000;

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, subtotal } = useCart();
  const total = subtotal + ONGKIR + BIAYA_RINDU;

  function bayar() {
    const order: Order = {
      id: `MA-${Math.floor(Math.random() * 900000 + 100000)}`,
      cart,
      subtotal: total,
      waktu: new Date().toISOString(),
    };
    const riwayat = readStorage<Order[]>(RIWAYAT_KEY, []);
    writeStorage(RIWAYAT_KEY, [order, ...riwayat]);
    writeStorage(ORDER_AKTIF_KEY, order);
    // keranjang dikosongkan di halaman /kurir setelah order tersimpan, bukan di sini —
    // supaya halaman ini ga sempat render ulang ke state "keranjang kosong" sebelum navigasi kelar.
    router.push("/kurir");
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <p className="mb-4">Keranjang kosong, ga ada yang dibayar.</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 py-6 lg:py-10">
      <p className="text-xs font-semibold tracking-[0.2em] uppercase text-sambal mb-2">Langkah Terakhir</p>
      <h1 className="font-display text-3xl sm:text-4xl text-tinta mb-8">Checkout</h1>

      <div className="lg:grid lg:grid-cols-3 lg:gap-10 lg:items-start">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-tinta mb-2" htmlFor="alamat">
              Alamat pengantaran
            </label>
            <input
              id="alamat"
              defaultValue="Depan warung, sebelah yang lagi tutup"
              className="w-full px-4 py-3 min-h-12 rounded-2xl border border-border bg-krem"
            />
          </div>

          <div>
            <p className="text-sm font-semibold text-tinta mb-2">Pembayaran</p>
            <div className="rounded-2xl bg-krem p-5">
              <p className="text-xs font-semibold mb-3 inline-block px-2.5 py-1 rounded-full bg-kunyit text-tinta">
                KARTU DEMO
              </p>
              <div className="space-y-3">
                <input
                  disabled
                  value="4242 4242 4242 4242"
                  aria-label="Nomor kartu (demo, tidak bisa diisi)"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-white text-muted"
                />
                <div className="flex gap-3">
                  <input
                    disabled
                    value="12/29"
                    aria-label="Masa berlaku (demo)"
                    className="w-1/2 px-4 py-3 rounded-xl border border-border bg-white text-muted"
                  />
                  <input
                    disabled
                    value="123"
                    aria-label="CVV (demo)"
                    className="w-1/2 px-4 py-3 rounded-xl border border-border bg-white text-muted"
                  />
                </div>
              </div>
            </div>
            <p className="text-xs text-muted mt-3">
              Ini bukan pembayaran asli. Ga ada kartu yang diproses, ga ada uang yang keluar. Situs
              parodi — baca <a href="/tentang" className="underline">selengkapnya</a>.
            </p>
          </div>
        </div>

        <div className="mt-8 lg:mt-0 rounded-3xl bg-krem p-6 lg:sticky lg:top-24">
          <h2 className="font-display text-lg text-tinta mb-4">Pesananmu</h2>

          <ul className="space-y-3 mb-4">
            {cart.map((line) => {
              const foto = gambarUntuk(line.slug, "card");
              return (
                <li key={line.id} className="flex items-center gap-3">
                  <div className="relative w-12 h-12 shrink-0 rounded-xl overflow-hidden bg-white flex items-center justify-center">
                    {foto ? (
                      <img
                        src={foto}
                        alt={line.nama}
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-xl" aria-hidden>
                        {line.emoji}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{line.nama}</p>
                    <p className="text-xs text-muted">{line.qty}x</p>
                  </div>
                  <p className="text-sm font-medium shrink-0">{formatRupiah(line.hargaSatuan * line.qty)}</p>
                </li>
              );
            })}
          </ul>

          <div className="space-y-2 text-sm mb-4 border-t border-beige pt-4">
            <div className="flex justify-between">
              <span className="text-muted">Subtotal</span>
              <span className="font-medium text-tinta">{formatRupiah(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Ongkir</span>
              <span className="font-medium text-tinta">{formatRupiah(ONGKIR)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Biaya rindu kampung</span>
              <span className="font-medium text-tinta">{formatRupiah(BIAYA_RINDU)}</span>
            </div>
          </div>

          <div className="flex justify-between items-baseline border-t border-beige pt-4 mb-5">
            <span className="font-medium text-tinta">Total bayar</span>
            <span className="font-display text-2xl text-tinta">{formatRupiah(total)}</span>
          </div>

          <button
            type="button"
            onClick={bayar}
            className="w-full px-6 py-4 min-h-[52px] rounded-full bg-sambal text-white text-base font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all"
          >
            Bayar {formatRupiah(total)}
          </button>
        </div>
      </div>
    </div>
  );
}
