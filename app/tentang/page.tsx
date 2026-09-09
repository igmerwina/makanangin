import Link from "next/link";
import { Check, X } from "@phosphor-icons/react/ssr";

export const metadata = {
  title: "Tentang",
  description: "Kenapa Makan Angin ada, apa yang beneran jalan, dan apa yang sengaja nggak.",
};

const JALAN = [
  "Katalog 80 hidangan asli Indonesia, lengkap dengan resep",
  "Keranjang, filter, dan pencarian, semuanya nyata",
  "Riwayat pesanan disimpan di HP kamu sendiri (localStorage), ga di server kami",
];

const GA_JALAN = [
  "Ga ada pembayaran. Form kartu di checkout disabled, ga bisa diisi data asli",
  "Ga ada pengiriman. Kurir cuma animasi, makanannya emang ga pernah dateng",
  "Ga ada akun atau login. Ga ada yang perlu didaftarin",
];

function Daftar({
  judul,
  isi,
  Ikon,
  warna,
}: {
  judul: string;
  isi: string[];
  Ikon: typeof Check;
  warna: string;
}) {
  return (
    <div>
      <h2 className="mb-4 font-display text-xl font-semibold">{judul}</h2>
      <ul className="space-y-3">
        {isi.map((baris) => (
          <li key={baris} className="flex gap-3 text-sm leading-relaxed text-ink-2">
            <Ikon size={17} weight="bold" aria-hidden className={`mt-0.5 shrink-0 ${warna}`} />
            {baris}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function TentangPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-20">
      <h1 className="font-display text-4xl font-semibold sm:text-5xl">Tentang Makan Angin</h1>

      <div className="mt-8 space-y-5 text-lg leading-relaxed text-ink-2">
        <p>
          Makan Angin situs parodi. Kamu pesan makanan Indonesia, bayar pakai kartu demo, kurirnya
          jalan, terus dia telepon bilang makanannya ga bakal dateng.
        </p>
        <p>
          Ga ada makanan asli. Ga ada pembayaran asli. Ga ada akun. Ga ada data kartu yang diminta
          atau disimpan, di mana pun. Semua data checkout cuma tampilan, ga pernah diproses atau
          dikirim ke mana pun. Yang kamu dapet beneran cuma resep dan cerita asal daerahnya, buat 80
          hidangan dari 34 provinsi.
        </p>
      </div>

      <div className="my-12 grid gap-10 border-y border-line py-10 sm:grid-cols-2 sm:gap-8">
        <Daftar judul="Yang beneran jalan" isi={JALAN} Ikon={Check} warna="text-pandan" />
        <Daftar judul="Yang sengaja nggak" isi={GA_JALAN} Ikon={X} warna="text-accent" />
      </div>

      <div className="space-y-5 text-lg leading-relaxed text-ink-2">
        <p>
          Kenapa dibikin? Karena craving kadang cuma butuh dilihat, dibayangin, terus dilupain. Atau,
          kalau niat, beneran dimasak sendiri. Semua resep di situs ini ditulis ulang, bukan disalin
          dari situs lain.
        </p>
      </div>

      <Link
        href="/menu"
        className="mt-10 inline-flex min-h-12 items-center rounded-full bg-accent px-7 py-3.5 font-semibold text-on-accent transition-transform duration-150 hover:-translate-y-px active:translate-y-0"
      >
        Mulai pesan
      </Link>
    </div>
  );
}
