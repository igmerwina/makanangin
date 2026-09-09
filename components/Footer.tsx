import Link from "next/link";
import { Heart } from "@phosphor-icons/react/ssr";
import Gust from "@/components/Gust";

const LINKS = [
  { href: "/menu", label: "Menu" },
  { href: "/resep", label: "Resep" },
  { href: "/riwayat", label: "Riwayat" },
  { href: "/tentang", label: "Tentang" },
] as const;

export default function Footer() {
  return (
    <footer className="mt-8 border-t border-line px-4 pb-[calc(5.5rem+env(safe-area-inset-bottom))] pt-12 sm:px-6 md:pb-12 lg:px-10">
      <div className="mx-auto max-w-[1280px]">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="flex items-center gap-2 font-display text-2xl font-semibold text-ink">
              Makan Angin
              <Gust className="w-8 text-kunyit" />
            </p>
            <p className="mt-1 text-sm text-ink-2">Kuliner Nusantara, dianter angin.</p>
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            {LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm text-ink-2 transition-colors hover:text-accent">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:items-start sm:justify-between">
          <p className="max-w-2xl text-xs leading-relaxed text-ink-2">
            Makan Angin situs parodi. Ga ada makanan asli, ga ada pembayaran asli, ga ada data kartu
            yang disimpan. Yang asli cuma resepnya.{" "}
            <Link href="/tentang" className="underline underline-offset-2 hover:text-accent">
              Selengkapnya
            </Link>
            .
          </p>
          <p className="flex shrink-0 items-center gap-1.5 text-xs text-ink-2">
            Dibuat
            <Heart size={13} weight="fill" className="text-accent" aria-label="dengan sayang" />
            oleh
            <a
              href="https://github.com/igmerwina"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-accent"
            >
              @igmerwina
            </a>
            <span className="tnum">2026</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
