import Link from "next/link";

const TABS = [
  { href: "/menu", label: "Menu", emoji: "🍛" },
  { href: "/resep", label: "Resep", emoji: "📖" },
  { href: "/keranjang", label: "Keranjang", emoji: "🛒" },
  { href: "/riwayat", label: "Riwayat", emoji: "🕓" },
] as const;

export default function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 flex border-t border-border bg-card">
      {TABS.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2 min-h-14 text-xs text-foreground/80"
        >
          <span className="text-xl leading-none" aria-hidden>
            {tab.emoji}
          </span>
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
