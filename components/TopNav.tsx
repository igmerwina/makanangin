"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { animated, useSpring } from "@react-spring/web";
import { BagSimple } from "@phosphor-icons/react";
import { useCart } from "@/lib/CartProvider";
import Gust from "@/components/Gust";

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

  // A nudge on the cart when a line lands in it: feedback, not decoration.
  useEffect(() => {
    if (jumlahItem > prevJumlah.current) {
      api.start({ to: [{ scale: 1.18 }, { scale: 1 }] });
    }
    prevJumlah.current = jumlahItem;
  }, [jumlahItem, api]);

  return (
    <header
      className="hidden md:block sticky top-0 z-30 border-b border-line bg-bg/85 backdrop-blur-md"
      style={{ zIndex: "var(--z-nav)" }}
    >
      <div className="mx-auto flex h-[68px] max-w-[1280px] items-center justify-between px-6 lg:px-10">
        <Link href="/" className="group flex items-center gap-2">
          <Gust className="w-7 text-kunyit transition-transform duration-300 group-hover:translate-x-0.5" />
          <span className="font-display text-[22px] font-semibold text-ink">Makan Angin</span>
        </Link>

        <nav className="flex items-center gap-1">
          {LINKS.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                  active ? "bg-accent-soft text-accent" : "text-ink-2 hover:bg-surface hover:text-ink"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          <animated.div style={{ scale: style.scale }} className="ml-3">
            <Link
              href="/keranjang"
              aria-current={pathname === "/keranjang" ? "page" : undefined}
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-on-accent transition-transform duration-150 hover:-translate-y-px active:translate-y-0"
            >
              <BagSimple size={18} weight="bold" aria-hidden />
              Keranjang
              {jumlahItem > 0 && (
                <span className="tnum rounded-full bg-on-accent/20 px-1.5 py-0.5 text-xs leading-none">
                  {jumlahItem}
                </span>
              )}
            </Link>
          </animated.div>
        </nav>
      </div>
    </header>
  );
}
