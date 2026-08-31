"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { animated, useSpring } from "@react-spring/web";
import { useCart } from "@/lib/CartProvider";

const LINKS = [
  { href: "/menu", label: "Menu" },
  { href: "/resep", label: "Resep" },
  { href: "/riwayat", label: "Riwayat" },
  { href: "/tentang", label: "Tentang" },
] as const;

export default function TopNav() {
  const { jumlahItem } = useCart();
  const prevJumlah = useRef(jumlahItem);
  const [style, api] = useSpring(() => ({ scale: 1, config: { tension: 500, friction: 10 } }));

  useEffect(() => {
    if (jumlahItem > prevJumlah.current) {
      api.start({ to: [{ scale: 1.25 }, { scale: 1 }] });
    }
    prevJumlah.current = jumlahItem;
  }, [jumlahItem, api]);

  return (
    <header className="hidden md:flex items-center justify-between px-8 h-16 border-b border-border bg-card">
      <Link href="/" className="font-display text-xl text-sambal">
        Makan Angin
      </Link>
      <nav className="flex items-center gap-6">
        {LINKS.map((link) => (
          <Link key={link.href} href={link.href} className="text-sm text-foreground/80 hover:text-foreground">
            {link.label}
          </Link>
        ))}
        <animated.div style={{ scale: style.scale }}>
          <Link href="/keranjang" className="text-sm px-3 py-1.5 rounded-full bg-sambal text-white inline-block">
            🛒 Keranjang{jumlahItem > 0 ? ` (${jumlahItem})` : ""}
          </Link>
        </animated.div>
      </nav>
    </header>
  );
}
