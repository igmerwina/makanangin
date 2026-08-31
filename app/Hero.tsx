"use client";

import Link from "next/link";
import { animated, useSpring, useTrail } from "@react-spring/web";

const FLOATERS = [
  { emoji: "🍛", top: "8%", left: "6%", size: "text-5xl", dur: 6200 },
  { emoji: "🌶️", top: "18%", left: "88%", size: "text-4xl", dur: 5200 },
  { emoji: "🥥", top: "72%", left: "10%", size: "text-4xl", dur: 7000 },
  { emoji: "🍢", top: "68%", left: "86%", size: "text-5xl", dur: 6600 },
  { emoji: "🥭", top: "40%", left: "94%", size: "text-3xl", dur: 5800 },
];

function Floater({ emoji, top, left, size, dur }: (typeof FLOATERS)[number]) {
  const style = useSpring({
    loop: true,
    from: { y: -10, rotate: -6 },
    to: async (next) => {
      await next({ y: 10, rotate: 6 });
      await next({ y: -10, rotate: -6 });
    },
    config: { duration: dur },
  });
  return (
    <animated.span
      aria-hidden
      className={`hidden md:block absolute select-none ${size}`}
      style={{ top, left, ...style }}
    >
      {emoji}
    </animated.span>
  );
}

const WORDS = ["Makan", "Angin"];

export default function Hero() {
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
    <div className="relative overflow-hidden px-4 py-12 md:py-16 text-center">
      {FLOATERS.map((f, i) => (
        <Floater key={i} {...f} />
      ))}

      <p className="text-xs font-medium tracking-[0.25em] uppercase text-sambal mb-4">
        80 hidangan · 34 provinsi · Rp0 yang bener-bener dibayar
      </p>

      <h1 className="font-display text-5xl sm:text-6xl md:text-7xl leading-[0.95] tracking-tight mb-4">
        {trail.map((s, i) => (
          <animated.span key={i} style={s} className={`block ${i === 1 ? "text-sambal" : ""}`}>
            {WORDS[i]}
          </animated.span>
        ))}
      </h1>

      <animated.p style={sub} className="text-lg md:text-xl max-w-xl mx-auto mb-10 text-foreground/80">
        Pesan makanan Indonesia. Bayar demo. Kurir jalan. Makanannya{" "}
        <span className="font-medium">ga bakal dateng</span> — resepnya iya.
      </animated.p>

      <animated.div style={cta} className="inline-block">
        <animated.div style={{ scale: ctaHover.scale }}>
          <Link
            href="/menu"
            onMouseEnter={() => ctaHoverApi.start({ scale: 1.06 })}
            onMouseLeave={() => ctaHoverApi.start({ scale: 1 })}
            onPointerDown={() => ctaHoverApi.start({ scale: 0.96 })}
            onPointerUp={() => ctaHoverApi.start({ scale: 1.06 })}
            className="inline-block px-8 py-4 min-h-11 rounded-full bg-sambal text-white text-lg font-medium shadow-lg shadow-sambal/25"
          >
            Mulai pesan angin →
          </Link>
        </animated.div>
      </animated.div>
    </div>
  );
}
