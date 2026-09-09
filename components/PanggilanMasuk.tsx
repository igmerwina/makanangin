"use client";

import { useEffect, useState } from "react";
import { animated, useSpring } from "@react-spring/web";
import { Phone, PhoneSlash } from "@phosphor-icons/react";
import alasanList from "@/data/alasan.json";

export default function PanggilanMasuk({
  kurirNama,
  kurirEmoji,
  onSelesai,
}: {
  kurirNama: string;
  kurirEmoji: string;
  onSelesai: () => void;
}) {
  const [alasan] = useState(() => alasanList[Math.floor(Math.random() * alasanList.length)]);
  const [diangkat, setDiangkat] = useState(false);

  useEffect(() => {
    navigator.vibrate?.(200);
  }, []);

  const overlay = useSpring({ from: { opacity: 0 }, to: { opacity: 1 } });

  // Ring pulse: it is a phone call, so the avatar breathes until it is answered.
  const ringing = useSpring({
    loop: !diangkat,
    from: { scale: 1 },
    to: async (next) => {
      await next({ scale: 1.14 });
      await next({ scale: 1 });
    },
    config: { duration: 500 },
  });

  const answered = useSpring({
    from: { opacity: 0, y: 20, scale: 0.94 },
    to: { opacity: 1, y: 0, scale: 1 },
    config: { tension: 260, friction: 20 },
  });

  return (
    <animated.div
      style={{ ...overlay, zIndex: 50 }}
      className="fixed inset-0 flex flex-col items-center justify-center bg-ink px-6 text-center text-bg"
    >
      {!diangkat ? (
        <>
          <p className="mb-3 text-sm text-bg/60">Panggilan masuk</p>
          <animated.span style={ringing} className="mb-4 inline-block text-7xl" aria-hidden>
            {kurirEmoji}
          </animated.span>
          <h1 className="mb-10 font-display text-2xl font-semibold text-bg">{kurirNama}</h1>
          <div className="flex gap-10">
            <button
              type="button"
              aria-label="Tolak panggilan"
              onClick={onSelesai}
              className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-on-accent transition-transform active:scale-90"
            >
              <PhoneSlash size={26} weight="fill" aria-hidden />
            </button>
            <button
              type="button"
              aria-label="Terima panggilan"
              onClick={() => setDiangkat(true)}
              className="flex h-16 w-16 items-center justify-center rounded-full bg-pandan text-bg transition-transform active:scale-90"
            >
              <Phone size={26} weight="fill" aria-hidden />
            </button>
          </div>
        </>
      ) : (
        <animated.div style={answered} className="flex flex-col items-center">
          <span className="mb-4 text-6xl" aria-hidden>
            {kurirEmoji}
          </span>
          <h1 className="mb-4 font-display text-xl font-semibold text-bg">{kurirNama}</h1>
          <p className="mb-10 max-w-sm leading-relaxed text-bg/90">
            &ldquo;Maaf kak, makanannya ga bisa dianter. {alasan}&rdquo;
          </p>
          <button
            type="button"
            onClick={onSelesai}
            className="min-h-12 rounded-full bg-bg px-7 py-3 font-semibold text-ink transition-transform active:scale-95"
          >
            Ya udah
          </button>
        </animated.div>
      )}
    </animated.div>
  );
}
