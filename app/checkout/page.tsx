"use client";

import { useRouter } from "next/navigation";
import { useCart } from "@/lib/CartProvider";
import { formatRupiah } from "@/lib/harga";
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
    <div className="max-w-3xl mx-auto px-4 py-6 md:grid md:grid-cols-2 md:gap-10">
      <div>
        <h1 className="font-display text-2xl mb-4">Checkout</h1>

        <label className="block text-sm font-medium mb-1" htmlFor="alamat">
          Alamat pengantaran
        </label>
        <input
          id="alamat"
          defaultValue="Depan warung, sebelah yang lagi tutup"
          className="w-full mb-4 px-4 py-2 min-h-11 rounded-xl border border-border bg-card"
        />

        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="text-xs font-medium mb-2 inline-block px-2 py-0.5 rounded-full bg-kunyit/30">
            KARTU DEMO
          </p>
          <div className="space-y-3">
            <input
              disabled
              value="4242 4242 4242 4242"
              aria-label="Nomor kartu (demo, tidak bisa diisi)"
              className="w-full px-4 py-2 rounded-xl border border-border bg-background text-muted"
            />
            <div className="flex gap-3">
              <input
                disabled
                value="12/29"
                aria-label="Masa berlaku (demo)"
                className="w-1/2 px-4 py-2 rounded-xl border border-border bg-background text-muted"
              />
              <input
                disabled
                value="123"
                aria-label="CVV (demo)"
                className="w-1/2 px-4 py-2 rounded-xl border border-border bg-background text-muted"
              />
            </div>
          </div>
        </div>

        <p className="text-xs text-muted mt-3">
          Ini bukan pembayaran asli. Ga ada kartu yang diproses, ga ada uang yang keluar. Situs
          parodi — baca <a href="/tentang" className="underline">selengkapnya</a>.
        </p>
      </div>

      <div className="mt-6 md:mt-0">
        <div className="rounded-2xl border border-border bg-card p-4 mb-4">
          <div className="flex justify-between font-medium">
            <span>Total bayar</span>
            <span>{formatRupiah(total)}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={bayar}
          className="w-full px-6 py-3 min-h-11 rounded-full bg-sambal text-white font-medium"
        >
          Bayar {formatRupiah(total)}
        </button>
      </div>
    </div>
  );
}
