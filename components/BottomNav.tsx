"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { animated, useSpring } from "@react-spring/web";
import { useCart } from "@/lib/CartProvider";

const TABS = [
  { href: "/menu", label: "Menu", emoji: "🍛" },
  { href: "/resep", label: "Resep", emoji: "📖" },
  { href: "/keranjang", label: "Keranjang", emoji: "🛒" },
  { href: "/riwayat", label: "Riwayat", emoji: "🕓" },
] as const;

export default function BottomNav() {
  const { jumlahItem } = useCart();
  const prevJumlah = useRef(jumlahItem);
  const [badgeStyle, badgeApi] = useSpring(() => ({ scale: 1, config: { tension: 500, friction: 10 } }));

  useEffect(() => {
    if (jumlahItem > prevJumlah.current) {
      badgeApi.start({ to: [{ scale: 1.4 }, { scale: 1 }] });
    }
    prevJumlah.current = jumlahItem;
  }, [jumlahItem, badgeApi]);

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 flex border-t border-border bg-card">
      {TABS.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className="relative flex-1 flex flex-col items-center justify-center gap-0.5 py-2 min-h-14 text-xs text-foreground/80"
        >
          <span className="relative text-xl leading-none" aria-hidden>
            {tab.emoji}
            {tab.href === "/keranjang" && jumlahItem > 0 && (
              <animated.span
                style={{ scale: badgeStyle.scale }}
                className="absolute -top-1.5 -right-2.5 min-w-4 h-4 px-1 rounded-full bg-sambal text-white text-[10px] leading-4 text-center"
              >
                {jumlahItem}
              </animated.span>
            )}
          </span>
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
