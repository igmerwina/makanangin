"use client";

import Link from "next/link";
import { animated, useSpring, useTrail } from "@react-spring/web";
import { ArrowRight } from "@phosphor-icons/react";
import Gust from "@/components/Gust";

const WORDS = ["Makan", "Angin"];

export type HeroFoto = { src: string; alt: string };

/** Asymmetric split hero: the joke lives in the type on the left, the craving
 *  lives in the photos on the right. Entry motion is staggered so the reader
 *  hits "Makan", then "Angin", then the punchline, in that order. */
export default function Hero({ foto }: { foto: HeroFoto[] }) {
  const trail = useTrail(WORDS.length, {
    from: { opacity: 0, y: 28 },
    to: { opacity: 1, y: 0 },
    config: { tension: 260, friction: 22 },
  });

  const sub = useSpring({ from: { opacity: 0, y: 12 }, to: { opacity: 1, y: 0 }, delay: 250 });
  const cta = useSpring({ from: { opacity: 0, y: 12 }, to: { opacity: 1, y: 0 }, delay: 400 });
  const art = useSpring({
    from: { opacity: 0, x: 24 },
    to: { opacity: 1, x: 0 },
    delay: 180,
    config: { tension: 200, friction: 26 },
  });

  const [ctaHover, ctaHoverApi] = useSpring(() => ({
    y: 0,
    config: { tension: 400, friction: 20 },
  }));

  return (
    <section className="mx-auto max-w-[1280px] px-4 pb-10 pt-10 sm:px-6 md:pb-16 md:pt-16 lg:px-10">
      <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-6">
        <div className="lg:col-span-7">
          <h1 className="mb-5 font-display text-[3.25rem] font-semibold leading-[0.92] tracking-tight sm:text-7xl lg:text-[5.5rem]">
            {trail.map((s, i) => (
              <animated.span key={WORDS[i]} style={s} className="block">
                {i === 1 ? (
                  <span className="inline-flex items-baseline gap-3 text-accent">
                    {WORDS[i]}
                    <Gust className="w-12 shrink-0 self-center text-kunyit sm:w-16" />
                  </span>
                ) : (
                  WORDS[i]
                )}
              </animated.span>
            ))}
          </h1>

          <animated.p
            style={sub}
            className="mb-8 max-w-[42ch] text-lg leading-relaxed text-ink-2 sm:text-xl"
          >
            Pesan makanan khas Indonesia. Kurirnya jalan, makanannya ga bakal dateng. Yang sampai
            cuma resepnya.
          </animated.p>

          <animated.div style={cta} className="flex flex-wrap items-center gap-3">
            <animated.div style={{ y: ctaHover.y }}>
              <Link
                href="/menu"
                onMouseEnter={() => ctaHoverApi.start({ y: -3 })}
                onMouseLeave={() => ctaHoverApi.start({ y: 0 })}
                className="inline-flex min-h-12 items-center gap-2 whitespace-nowrap rounded-full bg-accent px-7 py-3.5 text-base font-semibold text-on-accent active:scale-[0.98] sm:text-lg"
              >
                Mulai pesan
                <ArrowRight size={20} weight="bold" aria-hidden />
              </Link>
            </animated.div>
            <Link
              href="/resep"
              className="inline-flex min-h-12 items-center whitespace-nowrap rounded-full border border-line px-6 py-3.5 text-base font-medium text-ink transition-colors hover:bg-surface active:scale-[0.98] sm:text-lg"
            >
              Lihat resep
            </Link>
          </animated.div>
        </div>

        {/* Two real plates, overlapped and off-axis, so the hero has depth
            instead of a gradient blob. Decorative: the food itself is the
            subject of the pages these link out to, not of this composition. */}
        <animated.div style={art} className="relative lg:col-span-5">
          {foto[0] && (
            <div className="relative aspect-[5/4] overflow-hidden rounded-card bg-surface shadow-[0_24px_60px_-30px_rgba(33,26,22,0.55)]">
              <img
                src={foto[0].src}
                alt={foto[0].alt}
                fetchPriority="high"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          )}
          {foto[1] && (
            <div className="absolute -bottom-8 -left-4 hidden w-[46%] rotate-[-4deg] overflow-hidden rounded-card border-4 border-bg bg-surface shadow-[0_18px_40px_-24px_rgba(33,26,22,0.6)] sm:block lg:-left-10">
              <div className="relative aspect-square">
                <img
                  src={foto[1].src}
                  alt={foto[1].alt}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
            </div>
          )}
        </animated.div>
      </div>
    </section>
  );
}
