import Link from "next/link";
import Gust from "@/components/Gust";

const LINKS = [
  { href: "/menu", label: "Menu" },
  { href: "/resep", label: "Resep" },
  { href: "/riwayat", label: "Riwayat" },
  { href: "/tentang", label: "Tentang" },
] as const;

export default function Footer() {
  return (
    <footer className="bg-krem px-4 sm:px-8 pt-10 pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-10 mt-8">
      <div className="max-w-[1280px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div>
            <p className="font-display text-2xl text-sambal flex items-center gap-2">
              Makan Angin
              <Gust className="w-8 text-kunyit" />
            </p>
            <p className="text-sm text-muted mt-1">Kuliner Nusantara, dianter angin.</p>
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            {LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm text-foreground/70 hover:text-sambal">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <p className="text-xs text-muted mt-8 pt-6 border-t border-beige max-w-2xl">
          Makan Angin situs parodi. Ga ada makanan asli, ga ada pembayaran asli, ga ada data kartu
          yang disimpan. Yang asli cuma resepnya —{" "}
          <Link href="/tentang" className="underline">
            selengkapnya
          </Link>
          .
        </p>
      </div>
    </footer>
  );
}
