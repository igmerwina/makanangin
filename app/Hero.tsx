"use client";

import Link from "next/link";
import { animated, useSpring, useTrail } from "@react-spring/web";
import Gust from "@/components/Gust";

const WORDS = ["Makan", "Angin"];

/** Centered kinetic-type hero: the joke is the type, no imagery. Entry motion
 *  is staggered so the reader hits "Makan", then "Angin", then the punchline. */
export default function Hero({
  jumlahItem,
  jumlahProvinsi,
}: {
  jumlahItem: number;
  jumlahProvinsi: number;
}) {
  const trail = useTrail(WORDS.length, {
    from: { opacity: 0, y: 30 },
    to: { opacity: 1, y: 0 },
    config: { tension: 260, friction: 22 },
  });

  const sub = useSpring({
    from: { opacity: 0, y: 12 },
    to: { opacity: 1, y: 0 },
    delay: 250,
  });

  const cta = useSpring({
    from: { opacity: 0, scale: 0.9 },
    to: { opacity: 1, scale: 1 },
    delay: 420,
    config: { tension: 300, friction: 18 },
  });

  const [ctaHover, ctaHoverApi] = useSpring(() => ({ scale: 1, config: { tension: 400, friction: 20 } }));

  return (
    <div className="px-4 pt-12 md:pt-16 pb-8 text-center">
      <p className="text-xs font-semibold tracking-[0.25em] uppercase text-accent mb-4">
        {jumlahItem} hidangan · {jumlahProvinsi} provinsi · Rp0 yang bener-bener dibayar
      </p>

      <h1 className="font-display text-5xl sm:text-6xl md:text-7xl leading-[0.95] tracking-tight mb-4">
        {trail.map((s, i) => (
          <animated.span key={i} style={s} className={`block ${i === 1 ? "text-accent" : ""}`}>
            {WORDS[i]}
            {i === 1 && <Gust className="inline-block w-10 sm:w-14 ml-2 sm:ml-3 -mt-2 text-kunyit" />}
          </animated.span>
        ))}
      </h1>

      <animated.p style={sub} className="text-lg md:text-xl max-w-xl mx-auto mb-8 text-ink-2">
        Pesan makanan khas Indonesia. Kurir pasti jalan tapi makanannya{" "}
        <span className="font-medium">ga bakal dateng</span>. Resepnya yang sampai.
      </animated.p>

      <animated.div style={cta} className="flex flex-wrap items-center justify-center gap-3 whitespace-nowrap">
        <animated.div style={{ scale: ctaHover.scale }}>
          <Link
            href="/menu"
            onMouseEnter={() => ctaHoverApi.start({ scale: 1.06 })}
            onMouseLeave={() => ctaHoverApi.start({ scale: 1 })}
            onPointerDown={() => ctaHoverApi.start({ scale: 0.96 })}
            onPointerUp={() => ctaHoverApi.start({ scale: 1.06 })}
            className="inline-block px-7 py-3.5 min-h-11 rounded-full bg-accent text-on-accent text-base sm:text-lg font-semibold shadow-lg shadow-accent/25"
          >
            Mulai pesan angin →
          </Link>
        </animated.div>
        <Link
          href="/resep"
          className="inline-block px-6 py-3.5 min-h-11 rounded-full bg-surface text-ink text-base sm:text-lg font-medium hover:bg-surface-2 transition-colors"
        >
          Lihat resep
        </Link>
      </animated.div>
    </div>
  );
}
