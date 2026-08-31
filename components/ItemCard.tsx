"use client";

import Link from "next/link";
import { animated, useSpring } from "@react-spring/web";
import type { ItemIndex } from "@/lib/types";
import { gambarUntuk } from "@/lib/gambar";

export default function ItemCard({ item, delay = 0 }: { item: ItemIndex; delay?: number }) {
  const [hoverStyle, hoverApi] = useSpring(() => ({
    y: 0,
    scale: 1,
    rotate: 0,
    config: { tension: 400, friction: 22 },
  }));

  const [entranceStyle] = useSpring(() => ({
    from: { opacity: 0, y: 16, scale: 0.96 },
    to: { opacity: 1, y: 0, scale: 1 },
    delay,
    config: { tension: 280, friction: 24 },
  }));

  const foto = gambarUntuk(item.slug, "card");

  return (
    <animated.div style={entranceStyle}>
      <animated.div
        style={hoverStyle}
        onMouseEnter={() => hoverApi.start({ y: -6, scale: 1.03, rotate: -0.6 })}
        onMouseLeave={() => hoverApi.start({ y: 0, scale: 1, rotate: 0 })}
        onPointerDown={() => hoverApi.start({ scale: 0.97 })}
        onPointerUp={() => hoverApi.start({ y: -6, scale: 1.03 })}
      >
        <Link
          href={`/menu/${item.slug}`}
          className="flex flex-col overflow-hidden rounded-2xl bg-krem hover:ring-2 hover:ring-sambal/30 hover:shadow-lg hover:shadow-sambal/10 transition-all"
        >
          <div className="relative aspect-[4/3] bg-beige flex items-center justify-center">
            {foto ? (
              <img
                src={foto}
                alt={item.nama}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <span className="text-5xl" aria-hidden>
                {item.emoji}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-1 p-4">
            <span className="font-display text-lg leading-tight">{item.nama}</span>
            <span className="text-sm text-muted">{item.daerah}</span>
            <div className="flex items-center justify-between mt-1">
              <span className="font-medium">Rp{item.harga.toLocaleString("id-ID")}</span>
              {item.pedas > 0 && <span aria-label={`Level pedas ${item.pedas}`}>{"🌶️".repeat(item.pedas)}</span>}
            </div>
          </div>
        </Link>
      </animated.div>
    </animated.div>
  );
}
