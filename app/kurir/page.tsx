"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import kurirList from "@/data/kurir.json";
import PanggilanMasuk from "@/components/PanggilanMasuk";
import Gust from "@/components/Gust";
import { useCart } from "@/lib/CartProvider";

const DURASI_MIN_MS = 6000;
const DURASI_MAX_MS = 10000;

export default function KurirPage() {
  const router = useRouter();
  const { kosongkan } = useCart();
  // kurir default deterministik dulu, diacak SETELAH mount. Math.random() di initializer
  // bikin HTML hasil prerender beda sama render pertama klien (hydration mismatch).
  const [kurir, setKurir] = useState(kurirList[0]);
  const [fase, setFase] = useState<"jalan" | "panggilan">("jalan");
  // null sampai diundi: durasi ganda sebagai penanda "sudah mount", jadi baris
  // estimasi dan animasi jalannya baru dirender setelah angkanya pasti.
  const [durasiMs, setDurasiMs] = useState<number | null>(null);
  const [sisaDetik, setSisaDetik] = useState(0);

  // order sudah tersimpan sebelum sampai sini (lihat /checkout), aman dikosongkan sekarang
  useEffect(() => {
    setKurir(kurirList[Math.floor(Math.random() * kurirList.length)]);
    kosongkan();

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      setFase("panggilan");
      return;
    }

    const ms =
      DURASI_MIN_MS + Math.floor(Math.random() * (DURASI_MAX_MS - DURASI_MIN_MS + 1));
    setDurasiMs(ms);
    setSisaDetik(Math.ceil(ms / 1000));

    const habis = setTimeout(() => setFase("panggilan"), ms);
    const tick = setInterval(() => setSisaDetik((s) => Math.max(0, s - 1)), 1000);
    return () => {
      clearTimeout(habis);
      clearInterval(tick);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (fase === "panggilan") {
    return (
      <PanggilanMasuk
        kurirNama={kurir.nama}
        kurirEmoji={kurir.emoji}
        onSelesai={() => router.push("/pesanan-selesai")}
      />
    );
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center">
      <h1 className="font-display text-4xl font-semibold sm:text-5xl">{kurir.nama} lagi di jalan</h1>
      <p className="tnum mt-3 min-h-6 text-ink-2" aria-live="polite">
        {durasiMs !== null && `Estimasi tiba ${sisaDetik} detik lagi`}
      </p>

      <div className="my-12 rounded-card bg-surface px-5 pb-6 pt-16">
        <div className="relative h-16">
          <div className="absolute inset-x-0 bottom-0 h-3 rounded-full bg-surface-2" aria-hidden />
          <div className="absolute inset-x-4 bottom-[5px] h-0.5 border-b-2 border-dashed border-bg" aria-hidden />
          {/* Full-width track: 100% of its own width is the road, so a single
              transform carries the courier from kerb to kerb. The walk lasts
              exactly as long as the countdown, so it lands as the phone rings.
              Reduced motion never reaches here, the effect skips straight to
              the call. */}
          {durasiMs !== null && (
            <div
              className="absolute inset-x-0 bottom-2.5"
              style={{ animation: `jalan ${durasiMs}ms linear forwards` }}
              aria-hidden
            >
              <span className="inline-flex w-12 items-center text-4xl">
                <Gust className="mr-1 w-7 shrink-0 text-kunyit opacity-70" />
                {kurir.emoji}
              </span>
            </div>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={() => setFase("panggilan")}
        className="min-h-11 rounded-full border border-line px-5 py-2.5 text-sm font-medium text-ink-2 transition-colors hover:bg-surface hover:text-ink"
      >
        Lewati
      </button>
    </div>
  );
}
