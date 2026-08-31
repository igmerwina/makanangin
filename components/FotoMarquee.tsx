import Link from "next/link";
import { gambarUntuk } from "@/lib/gambar";

/** Deretan foto makanan yang "kebawa angin" — drift pelan ke kiri, loop mulus.
 *  Murni CSS (keyframes `drift` di globals.css). Di prefers-reduced-motion animasi mati,
 *  salinan kedua disembunyikan, dan barisnya jadi bisa di-scroll manual. */
export default function FotoMarquee({ items }: { items: { slug: string; nama: string }[] }) {
  const withFoto = items
    .map((i) => ({ ...i, foto: gambarUntuk(i.slug, "card") }))
    .filter((i): i is { slug: string; nama: string; foto: string } => i.foto !== null);

  if (withFoto.length === 0) return null;

  const Tile = ({ item, i }: { item: (typeof withFoto)[number]; i: number }) => (
    <Link
      href={`/menu/${item.slug}`}
      tabIndex={-1}
      aria-hidden
      className="relative block w-36 h-28 sm:w-44 sm:h-32 shrink-0 rounded-2xl overflow-hidden bg-krem"
      style={{ rotate: i % 2 === 0 ? "-1.5deg" : "1.5deg" }}
    >
      <img
        src={item.foto}
        alt=""
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
      />
    </Link>
  );

  return (
    <div className="relative overflow-hidden motion-reduce:overflow-x-auto">
      <div className="flex w-max gap-4 py-2 motion-safe:animate-[drift_50s_linear_infinite]">
        {withFoto.map((item, i) => (
          <Tile key={item.slug} item={item} i={i} />
        ))}
        {/* salinan kedua = loop tanpa jeda; ga perlu ada kalau animasinya mati */}
        <div className="motion-reduce:hidden flex gap-4" aria-hidden>
          {withFoto.map((item, i) => (
            <Tile key={`b-${item.slug}`} item={item} i={i} />
          ))}
        </div>
      </div>
      {/* fade di kedua tepi biar foto muncul/hilang kayak ketiup, bukan kepotong */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background to-transparent" />
    </div>
  );
}
