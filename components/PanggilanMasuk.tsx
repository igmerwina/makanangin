"use client";

import { useEffect, useState } from "react";
import { animated, useSpring } from "@react-spring/web";
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

  const ringing = useSpring({
    loop: !diangkat,
    from: { scale: 1 },
    to: async (next) => {
      await next({ scale: 1.15 });
      await next({ scale: 1 });
    },
    config: { duration: 500 },
  });

  const answered = useSpring({
    from: { opacity: 0, y: 20, scale: 0.9 },
    to: { opacity: 1, y: 0, scale: 1 },
    config: { tension: 260, friction: 20 },
  });

  return (
    <animated.div
      style={overlay}
      className="fixed inset-0 z-50 bg-tinta text-white flex flex-col items-center justify-center px-6 text-center"
    >
      {!diangkat ? (
        <>
          <p className="text-sm text-white/60 mb-2">Panggilan masuk</p>
          <animated.span style={ringing} className="text-7xl mb-3 inline-block" aria-hidden>
            {kurirEmoji}
          </animated.span>
          <h1 className="font-display text-2xl mb-8">{kurirNama}</h1>
          <div className="flex gap-8">
            <button
              type="button"
              aria-label="Tolak panggilan"
              onClick={onSelesai}
              className="w-16 h-16 rounded-full bg-red-600 text-2xl active:scale-90 transition-transform"
            >
              ✕
            </button>
            <button
              type="button"
              aria-label="Terima panggilan"
              onClick={() => setDiangkat(true)}
              className="w-16 h-16 rounded-full bg-pandan text-2xl active:scale-90 transition-transform"
            >
              ✓
            </button>
          </div>
        </>
      ) : (
        <animated.div style={answered} className="flex flex-col items-center">
          <span className="text-6xl mb-4" aria-hidden>
            {kurirEmoji}
          </span>
          <h1 className="font-display text-xl mb-3">{kurirNama}</h1>
          <p className="max-w-sm mb-8">
            &ldquo;Maaf kak, makanannya ga bisa dianter. {alasan}&rdquo;
          </p>
          <button
            type="button"
            onClick={onSelesai}
            className="px-6 py-3 min-h-11 rounded-full bg-white text-tinta font-medium active:scale-95 transition-transform"
          >
            Ya udah
          </button>
        </animated.div>
      )}
    </animated.div>
  );
}
