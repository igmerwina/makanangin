"use client";

import Link from "next/link";
import { useCart } from "@/lib/CartProvider";

const LINKS = [
  { href: "/menu", label: "Menu" },
  { href: "/resep", label: "Resep" },
  { href: "/riwayat", label: "Riwayat" },
  { href: "/tentang", label: "Tentang" },
] as const;

export default function TopNav() {
  const { jumlahItem } = useCart();

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
        <Link
          href="/keranjang"
          className="text-sm px-3 py-1.5 rounded-full bg-sambal text-white"
        >
          🛒 Keranjang{jumlahItem > 0 ? ` (${jumlahItem})` : ""}
        </Link>
      </nav>
    </header>
  );
}
