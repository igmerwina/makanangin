"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, BagSimple } from "@phosphor-icons/react";
import { useCart } from "@/lib/CartProvider";
import CartItemCard from "@/components/CartItemCard";
import RincianBiaya from "@/components/RincianBiaya";

export default function KeranjangPage() {
  const { cart, ubah, hapus, subtotal } = useCart();

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <span className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-surface text-ink-2">
          <BagSimple size={34} weight="regular" aria-hidden />
        </span>
        <h1 className="font-display text-3xl font-semibold">Keranjangmu masih kosong</h1>
        <p className="mx-auto mt-3 max-w-[36ch] text-ink-2">
          Yuk cari makanan yang bikin pulang terasa lebih dekat.
        </p>
        <Link
          href="/menu"
          className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-full bg-accent px-7 py-3.5 font-semibold text-on-accent transition-transform duration-150 hover:-translate-y-px active:translate-y-0"
        >
          Mulai pesan
          <ArrowRight size={19} weight="bold" aria-hidden />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
      <h1 className="font-display text-4xl font-semibold sm:text-5xl">Keranjang</h1>
      <p className="tnum mt-2 text-ink-2">{cart.length} hidangan siap dilepas ke angin</p>

      <div className="mt-8 lg:grid lg:grid-cols-3 lg:items-start lg:gap-12">
        <div className="lg:col-span-2">
          <ul className="border-t border-line">
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
            className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-ink-2 transition-colors hover:text-accent"
          >
            <ArrowLeft size={16} weight="bold" aria-hidden />
            Lanjut belanja
          </Link>
        </div>

        <aside className="mt-10 rounded-card bg-surface p-6 lg:sticky lg:top-[92px] lg:mt-0">
          <h2 className="mb-5 font-display text-lg font-semibold">Ringkasan</h2>
          <RincianBiaya subtotal={subtotal} labelTotal="Total" />
          <p className="mb-6 mt-2 text-[11px] leading-relaxed text-ink-2">
            Biaya rindu kampung: ongkos emosional pulang ke rasa asli.
          </p>
          <Link
            href="/checkout"
            className="flex min-h-[52px] w-full items-center justify-center gap-2 whitespace-nowrap rounded-full bg-accent px-6 py-4 text-base font-semibold text-on-accent transition-transform duration-150 hover:-translate-y-px active:translate-y-0"
          >
            Lanjut checkout
            <ArrowRight size={19} weight="bold" aria-hidden />
          </Link>
          <p className="mt-3 text-center text-xs text-ink-2">Ga ada uang yang beneran ditarik.</p>
        </aside>
      </div>
    </div>
  );
}
