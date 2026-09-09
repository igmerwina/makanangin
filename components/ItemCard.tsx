"use client";

import Link from "next/link";
import { animated, useSpring } from "@react-spring/web";
import { Pepper } from "@phosphor-icons/react";
import type { ItemIndex } from "@/lib/types";
import { gambarUntuk } from "@/lib/gambar";
import { formatRupiah } from "@/lib/harga";

/** No card chrome: the photograph is the card. Name, region and price sit on
 *  the page background underneath it, which keeps a grid of these from
 *  reading as a wall of identical beige boxes. */
export default function ItemCard({ item, delay = 0 }: { item: ItemIndex; delay?: number }) {
  const [hover, hoverApi] = useSpring(() => ({
    y: 0,
    zoom: 1,
    config: { tension: 340, friction: 26 },
  }));

  const [entrance] = useSpring(() => ({
    from: { opacity: 0, y: 14 },
    to: { opacity: 1, y: 0 },
    delay,
    config: { tension: 280, friction: 24 },
  }));

  const foto = gambarUntuk(item.slug, "card");

  return (
    <animated.div style={entrance}>
      <animated.div
        style={{ y: hover.y }}
        onMouseEnter={() => hoverApi.start({ y: -4, zoom: 1.05 })}
        onMouseLeave={() => hoverApi.start({ y: 0, zoom: 1 })}
        onPointerDown={() => hoverApi.start({ y: 0 })}
      >
        <Link href={`/menu/${item.slug}`} className="group block">
          <div className="relative aspect-[4/3] overflow-hidden rounded-card bg-surface">
            {foto ? (
              <animated.img
                src={foto}
                alt={item.nama}
                loading="lazy"
                decoding="async"
                style={{ scale: hover.zoom }}
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <span className="absolute inset-0 flex items-center justify-center text-5xl" aria-hidden>
                {item.emoji}
              </span>
            )}
          </div>

          <div className="px-1 pt-3">
            <p className="font-display text-lg font-semibold leading-tight text-ink transition-colors group-hover:text-accent">
              {item.nama}
            </p>
            <p className="mt-0.5 text-sm text-ink-2">{item.daerah}</p>
            <div className="mt-2 flex items-center justify-between gap-2">
              <span className="tnum text-sm font-semibold text-ink">{formatRupiah(item.harga)}</span>
              {item.pedas > 0 && (
                <span
                  className="tnum inline-flex items-center gap-1 text-xs font-medium text-accent"
                  aria-label={`Level pedas ${item.pedas} dari 5`}
                >
                  <Pepper size={14} weight="fill" aria-hidden />
                  {item.pedas}
                </span>
              )}
            </div>
          </div>
        </Link>
      </animated.div>
    </animated.div>
  );
}
