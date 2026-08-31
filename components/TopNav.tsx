"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();
  const prevJumlah = useRef(jumlahItem);
  const [style, api] = useSpring(() => ({ scale: 1, config: { tension: 500, friction: 10 } }));

  useEffect(() => {
    if (jumlahItem > prevJumlah.current) {
      api.start({ to: [{ scale: 1.25 }, { scale: 1 }] });
    }
    prevJumlah.current = jumlahItem;
  }, [jumlahItem, api]);

  return (
    <header className="hidden md:flex items-center justify-between px-8 lg:px-12 h-20 bg-sambal shadow-md">
      <Link href="/" className="font-display text-2xl text-white tracking-tight">
        🍚 Makan Angin
      </Link>
      <nav className="flex items-center gap-8">
        {LINKS.map((link) => {
          const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium underline-offset-4 transition-colors ${
                active ? "text-white underline" : "text-white/80 hover:text-white hover:underline"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
        <animated.div style={{ scale: style.scale }}>
          <Link
            href="/keranjang"
            aria-current={pathname === "/keranjang" ? "page" : undefined}
            className={`text-sm px-4 py-2 rounded-full bg-kunyit text-tinta font-semibold inline-flex items-center gap-1.5 shadow-sm hover:brightness-105 transition ${
              pathname === "/keranjang" ? "ring-2 ring-white" : ""
            }`}
          >
            🛒 Keranjang{jumlahItem > 0 ? ` (${jumlahItem})` : ""}
          </Link>
        </animated.div>
      </nav>
    </header>
  );
}
