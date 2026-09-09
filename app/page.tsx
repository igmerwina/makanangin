import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/ssr";
import Hero, { type HeroFoto } from "./Hero";
import { getIndexItem, indexItems } from "@/lib/items";
import { gambarUntuk } from "@/lib/gambar";
import ItemCard from "@/components/ItemCard";
import FotoMarquee from "@/components/FotoMarquee";
import Gust from "@/components/Gust";

const POPULER = [
  "nasi-goreng",
  "rendang",
  "sate-ayam-madura",
  "bakso",
  "ayam-geprek",
  "gudeg",
  "es-cendol",
  "klepon",
];

const CARA = [
  {
    judul: "Pilih makanannya",
    isi: "80 hidangan dari 34 provinsi. Atur porsi, level pedas, tambahan, semuanya jalan.",
  },
  {
    judul: "Bayar pakai angin",
    isi: "Kartu, e-wallet, QRIS, transfer bank. Semuanya palsu, ga ada satu rupiah pun yang pindah.",
  },
  {
    judul: "Kurirnya nelepon",
    isi: "Dia minta maaf, kasih alasan, lalu pergi. Resep lengkapnya masuk ke riwayat kamu.",
  },
];

export default function Home() {
  const items = POPULER.map((slug) => getIndexItem(slug)).filter((i) => i !== undefined);
  const semua = indexItems();

  // Two plates for the hero composition: the most recognisable one large,
  // a second one tucked underneath it.
  const heroFoto: HeroFoto[] = [
    { slug: "nasi-padang", alt: "Sepiring nasi Padang dengan aneka lauk" },
    { slug: "es-teler", alt: "Semangkuk es teler dengan alpukat, nangka, dan kelapa muda" },
  ].flatMap(({ slug, alt }) => {
    const src = gambarUntuk(slug, "hero") ?? gambarUntuk(slug, "card");
    return src ? [{ src, alt }] : [];
  });

  // Anything not already in the popular grid, so the drift row never repeats it.
  const marqueeItems = semua
    .filter((i) => !POPULER.includes(i.slug))
    .slice(0, 14)
    .map(({ slug, nama }) => ({ slug, nama }));

  // One representative photo per island for the scroll strip.
  const pulauUrut = ["Jawa", "Sumatera", "Sulawesi", "Kalimantan", "Bali", "Nusa Tenggara", "Maluku", "Papua"];
  const pulau = pulauUrut
    .map((nama) => {
      const isi = semua.filter((i) => i.pulau === nama);
      const wakil = isi.find((i) => gambarUntuk(i.slug, "card"));
      return { nama, jumlah: isi.length, foto: wakil ? gambarUntuk(wakil.slug, "card") : null };
    })
    .filter((p) => p.jumlah > 0);

  return (
    <>
      <Hero foto={heroFoto} />

      <FotoMarquee items={marqueeItems} />

      <section className="reveal mx-auto max-w-[1280px] px-4 pb-16 pt-14 sm:px-6 lg:px-10">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <h2 className="font-display text-3xl font-semibold sm:text-4xl">Yang paling sering dipesan</h2>
          <Link
            href="/menu"
            className="inline-flex items-center gap-1.5 rounded-full px-1 py-1 text-sm font-medium text-accent hover:underline"
          >
            Semua 80 hidangan
            <ArrowRight size={16} weight="bold" aria-hidden />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
          {items.map((item, i) => (
            <ItemCard key={item.slug} item={item} delay={i * 35} />
          ))}
        </div>
      </section>

      {/* Staggered staircase, not three equal cards: each step sits a little
          further right than the last, which is the whole point of the flow. */}
      <section className="reveal mx-auto max-w-[1280px] px-4 py-16 sm:px-6 lg:px-10">
        <h2 className="mb-10 max-w-[16ch] font-display text-3xl font-semibold sm:text-4xl">
          Gimana situs ini kerja
        </h2>
        <ol className="space-y-8">
          {CARA.map((c, i) => (
            <li
              key={c.judul}
              className="flex max-w-2xl gap-5 border-t border-line pt-6"
              style={{ marginLeft: `${i * 4}%` }}
            >
              <span className="tnum shrink-0 font-display text-4xl font-semibold leading-none text-accent/40 sm:text-5xl">
                {i + 1}
              </span>
              <div>
                <h3 className="font-display text-xl font-semibold sm:text-2xl">{c.judul}</h3>
                <p className="mt-1.5 max-w-[52ch] leading-relaxed text-ink-2">{c.isi}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Horizontal scroll-snap strip: eight islands is too many for a grid of
          equal tiles and too few to hide behind a filter. */}
      <section className="reveal py-16">
        <div className="mx-auto mb-6 max-w-[1280px] px-4 sm:px-6 lg:px-10">
          <h2 className="font-display text-3xl font-semibold sm:text-4xl">Jelajah per pulau</h2>
          <p className="mt-2 max-w-[50ch] text-ink-2">
            Rempah pesisir, santan Jawa, sagu Papua. Tiap pulau punya dapurnya sendiri.
          </p>
        </div>
        <ul className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:px-6 lg:px-10">
          {pulau.map((p) => (
            <li key={p.nama} className="w-[42vw] max-w-[220px] shrink-0 snap-start sm:w-[200px]">
              <Link href={`/daerah/${p.nama}`} className="group block">
                <div className="relative aspect-[3/4] overflow-hidden rounded-card bg-surface">
                  {p.foto && (
                    <img
                      src={p.foto}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                  )}
                  <span className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/10 to-transparent" />
                  <span className="absolute inset-x-4 bottom-4 text-bg">
                    <span className="block font-display text-xl font-semibold">{p.nama}</span>
                    <span className="tnum block text-sm opacity-80">{p.jumlah} hidangan</span>
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="reveal mx-auto max-w-[1280px] px-4 pb-20 sm:px-6 lg:px-10">
        <div className="relative overflow-hidden rounded-card bg-surface px-6 py-14 text-center sm:px-12">
          <Gust className="mx-auto mb-5 w-16 text-kunyit" />
          <h2 className="mx-auto max-w-[20ch] font-display text-3xl font-semibold sm:text-4xl">
            Craving-nya nyata. Makanannya nggak.
          </h2>
          <p className="mx-auto mt-3 max-w-[46ch] leading-relaxed text-ink-2">
            Kamu keluar dari sini dengan resep lengkap dan cerita asal daerahnya. Gratis, tanpa akun.
          </p>
          <Link
            href="/menu"
            className="mt-7 inline-flex min-h-12 items-center gap-2 whitespace-nowrap rounded-full bg-accent px-7 py-3.5 text-base font-semibold text-on-accent transition-transform duration-150 hover:-translate-y-px active:translate-y-0"
          >
            Mulai pesan
            <ArrowRight size={20} weight="bold" aria-hidden />
          </Link>
        </div>
      </section>
    </>
  );
}
