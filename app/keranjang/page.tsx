"use client";

import Link from "next/link";
import { useCart } from "@/lib/CartProvider";
import { formatRupiah } from "@/lib/harga";
import CartItemCard from "@/components/CartItemCard";

const ONGKIR = 5000;
const BIAYA_RINDU = 2000;

export default function KeranjangPage() {
  const { cart, ubah, hapus, subtotal } = useCart();

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <p className="text-6xl mb-5">🧺</p>
        <h1 className="font-display text-3xl mb-2">Keranjangmu masih kosong</h1>
        <p className="text-muted mb-7 max-w-sm mx-auto">
          Yuk cari makanan yang bikin pulang terasa lebih dekat.
        </p>
        <Link
          href="/menu"
          className="inline-block px-7 py-3.5 min-h-11 rounded-full bg-sambal text-white font-semibold shadow-md hover:shadow-lg transition-shadow"
        >
          Jelajahi Menu
        </Link>
      </div>
    );
  }

  const total = subtotal + ONGKIR + BIAYA_RINDU;

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 py-6 lg:py-10">
      <p className="text-xs font-semibold tracking-[0.2em] uppercase text-sambal mb-2">Pesanan Kamu</p>
      <h1 className="font-display text-3xl sm:text-4xl text-tinta mb-1">Keranjang kamu</h1>
      <p className="text-muted mb-6 lg:mb-8">
        {cart.length} makanan siap disantap
      </p>

      <div className="lg:grid lg:grid-cols-3 lg:gap-10 lg:items-start">
        {/* items */}
        <div className="lg:col-span-2">
          <ul className="space-y-3">
            {cart.map((line) => (
              <CartItemCard
                key={line.id}
                line={line}
                onUbah={(qty) => ubah(line.id, qty)}
                onHapus={() => hapus(line.id)}
              />
            ))}
          </ul>

          <Link
            href="/menu"
            className="inline-flex items-center gap-1.5 mt-6 text-sm font-medium text-muted hover:text-tinta transition-colors"
          >
            ← Lanjut Belanja
          </Link>
        </div>

        {/* summary */}
        <div className="mt-8 lg:mt-0 rounded-3xl bg-krem p-6 lg:sticky lg:top-24">
          <h2 className="font-display text-lg text-tinta mb-4">Ringkasan Pesanan</h2>

          <div className="space-y-2 text-sm mb-4">
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

          <div className="flex justify-between items-baseline border-t border-beige pt-4 mb-1">
            <span className="font-medium text-tinta">Total</span>
            <span className="font-display text-2xl text-tinta">{formatRupiah(total)}</span>
          </div>
          <p className="text-[11px] text-muted mb-5">
            Biaya rindu kampung: ongkos emosional pulang ke rasa asli.
          </p>

          <Link
            href="/checkout"
            className="flex items-center justify-center gap-2 w-full px-6 py-4 min-h-[52px] rounded-full bg-sambal text-white text-base font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all"
          >
            Lanjut Checkout →
          </Link>
        </div>
      </div>
    </div>
  );
}
