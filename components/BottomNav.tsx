"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { animated, useSpring } from "@react-spring/web";
import { BagSimple, BookOpen, ClockCounterClockwise, ForkKnife } from "@phosphor-icons/react";
import { useCart } from "@/lib/CartProvider";

const TABS = [
  { href: "/menu", label: "Menu", Icon: ForkKnife },
  { href: "/resep", label: "Resep", Icon: BookOpen },
  { href: "/keranjang", label: "Keranjang", Icon: BagSimple },
  { href: "/riwayat", label: "Riwayat", Icon: ClockCounterClockwise },
] as const;

export default function BottomNav() {
  const { jumlahItem } = useCart();
  const pathname = usePathname();
  const prevJumlah = useRef(jumlahItem);
  const [badgeStyle, badgeApi] = useSpring(() => ({ scale: 1, config: { tension: 500, friction: 10 } }));

  useEffect(() => {
    if (jumlahItem > prevJumlah.current) {
      badgeApi.start({ to: [{ scale: 1.35 }, { scale: 1 }] });
    }
    prevJumlah.current = jumlahItem;
  }, [jumlahItem, badgeApi]);

  return (
    <nav
      className="fixed inset-x-0 bottom-0 flex border-t border-line bg-bg/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
      style={{ zIndex: "var(--z-nav)" }}
    >
      {TABS.map(({ href, label, Icon }) => {
        const active = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`relative flex min-h-14 flex-1 flex-col items-center justify-center gap-1 py-2 text-[11px] font-medium transition-colors ${
              active ? "text-accent" : "text-ink-2"
            }`}
          >
            <span className="relative leading-none">
              <Icon size={22} weight={active ? "fill" : "regular"} aria-hidden />
              {href === "/keranjang" && jumlahItem > 0 && (
                <animated.span
                  style={{ scale: badgeStyle.scale }}
                  className="tnum absolute -right-2.5 -top-1.5 h-4 min-w-4 rounded-full bg-accent px-1 text-center text-[10px] leading-4 text-on-accent"
                >
                  {jumlahItem}
                </animated.span>
              )}
            </span>
            {label}
            {active && (
              <span className="absolute inset-x-7 top-0 h-0.5 rounded-full bg-accent" aria-hidden />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
