import { gambarUntuk } from "@/lib/gambar";

/** Photos drifting left, "kebawa angin". Pure CSS keyframes so nothing runs on
 *  the main thread. Under reduced motion the animation stops, the duplicate
 *  copy is hidden, and the row becomes a normal scroll strip. Decorative only,
 *  hence unlinked: every dish is reachable from the grid below. */
export default function FotoMarquee({ items }: { items: { slug: string; nama: string }[] }) {
  const withFoto = items
    .map((i) => ({ ...i, foto: gambarUntuk(i.slug, "card") }))
    .filter((i): i is { slug: string; nama: string; foto: string } => i.foto !== null);

  if (withFoto.length === 0) return null;

  const Tile = ({ foto, i }: { foto: string; i: number }) => (
    <div
      className="relative h-28 w-36 shrink-0 overflow-hidden rounded-card bg-surface sm:h-32 sm:w-44"
      style={{ rotate: i % 2 === 0 ? "-1.5deg" : "1.5deg" }}
    >
      <img src={foto} alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
    </div>
  );

  return (
    <div aria-hidden className="relative overflow-hidden py-2 motion-reduce:overflow-x-auto">
      <div className="flex w-max gap-4 py-2 motion-safe:animate-[drift_50s_linear_infinite]">
        {withFoto.map((item, i) => (
          <Tile key={item.slug} foto={item.foto} i={i} />
        ))}
        {/* second copy closes the loop; pointless once the animation is off */}
        <div className="flex gap-4 motion-reduce:hidden">
          {withFoto.map((item, i) => (
            <Tile key={`b-${item.slug}`} foto={item.foto} i={i} />
          ))}
        </div>
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-bg to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-bg to-transparent" />
    </div>
  );
}
