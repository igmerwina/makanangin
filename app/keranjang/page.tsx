"use client";

import Link from "next/link";
import { useCart } from "@/lib/CartProvider";
import { formatRupiah } from "@/lib/harga";
import { gambarUntuk } from "@/lib/gambar";

const ONGKIR = 5000;
const BIAYA_RINDU = 2000;

export default function KeranjangPage() {
  const { cart, ubah, hapus, subtotal } = useCart();

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <p className="text-5xl mb-4">🛒</p>
        <h1 className="font-display text-2xl mb-2">Keranjang kosong</h1>
        <p className="text-muted mb-6">Belum ada yang mau ga jadi dateng nih.</p>
        <Link href="/menu" className="inline-block px-6 py-3 rounded-full bg-sambal text-white font-medium">
          Lihat menu
        </Link>
      </div>
    );
  }

  const total = subtotal + ONGKIR + BIAYA_RINDU;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 md:grid md:grid-cols-3 md:gap-8">
      <div className="md:col-span-2">
        <h1 className="font-display text-2xl mb-4">Keranjang</h1>
        <ul className="space-y-3">
          {cart.map((line) => {
            const foto = gambarUntuk(line.slug, "card");
            return (
            <li key={line.id} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3">
              <div className="relative w-16 h-16 shrink-0 rounded-xl overflow-hidden bg-krem flex items-center justify-center">
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
              <div className="flex-1 min-w-0">
                <p className="font-medium">{line.nama}</p>
                {line.opsiTerpilih.length > 0 && (
                  <p className="text-xs text-muted truncate">{line.opsiTerpilih.join(", ")}</p>
                )}
                <p className="text-sm">{formatRupiah(line.hargaSatuan)}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label={`Kurangi ${line.nama}`}
                  onClick={() => ubah(line.id, line.qty - 1)}
                  className="w-9 h-9 rounded-full border border-border"
                >
                  −
                </button>
                <span className="w-5 text-center">{line.qty}</span>
                <button
                  type="button"
                  aria-label={`Tambah ${line.nama}`}
                  onClick={() => ubah(line.id, line.qty + 1)}
                  className="w-9 h-9 rounded-full border border-border"
                >
                  +
                </button>
              </div>
              <button
                type="button"
                aria-label={`Hapus ${line.nama} dari keranjang`}
                onClick={() => hapus(line.id)}
                className="text-muted text-sm ml-1"
              >
                ✕
              </button>
            </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-6 md:mt-0 rounded-2xl border border-border bg-card p-4 h-fit sticky top-20">
        <div className="space-y-1 text-sm mb-3">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatRupiah(subtotal)}</span>
          </div>
          <div className="flex justify-between text-muted">
            <span>Ongkir</span>
            <span>{formatRupiah(ONGKIR)}</span>
          </div>
          <div className="flex justify-between text-muted">
            <span>Biaya rindu kampung</span>
            <span>{formatRupiah(BIAYA_RINDU)}</span>
          </div>
        </div>
        <div className="flex justify-between font-medium border-t border-border pt-2 mb-4">
          <span>Total</span>
          <span>{formatRupiah(total)}</span>
        </div>
        <Link
          href="/checkout"
          className="block text-center w-full px-6 py-3 min-h-11 rounded-full bg-sambal text-white font-medium"
        >
          Checkout
        </Link>
      </div>
    </div>
  );
}
