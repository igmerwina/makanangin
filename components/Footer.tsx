import Link from "next/link";

export default function Footer() {
  return (
    <footer className="hidden md:block border-t border-border bg-card px-8 py-6 text-sm text-foreground/70">
      <p>
        Makan Angin situs parodi. Ga ada makanan asli, ga ada pembayaran asli, ga ada data kartu
        yang disimpan. Yang asli cuma resepnya.{" "}
        <Link href="/tentang" className="underline">
          Selengkapnya
        </Link>
        .
      </p>
    </footer>
  );
}
