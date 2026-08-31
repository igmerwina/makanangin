"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import kurirList from "@/data/kurir.json";
import PanggilanMasuk from "@/components/PanggilanMasuk";
import Gust from "@/components/Gust";
import { useCart } from "@/lib/CartProvider";

const DURASI_MS = 22000;

export default function KurirPage() {
  const router = useRouter();
  const { kosongkan } = useCart();
  // kurir default deterministik dulu, diacak SETELAH mount — Math.random() di initializer
  // bikin HTML hasil prerender beda sama render pertama klien (hydration mismatch).
  const [kurir, setKurir] = useState(kurirList[0]);
  const [fase, setFase] = useState<"jalan" | "panggilan">("jalan");
  const [sisaDetik, setSisaDetik] = useState(Math.ceil(DURASI_MS / 1000));

  // order sudah tersimpan sebelum sampai sini (lihat /checkout) — aman dikosongkan sekarang
  useEffect(() => {
    setKurir(kurirList[Math.floor(Math.random() * kurirList.length)]);
    kosongkan();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      setFase("panggilan");
      return;
    }
    const habis = setTimeout(() => setFase("panggilan"), DURASI_MS);
    const tick = setInterval(() => setSisaDetik((s) => Math.max(0, s - 1)), 1000);
    return () => {
      clearTimeout(habis);
      clearInterval(tick);
    };
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
    <div className="max-w-xl mx-auto px-4 py-16 text-center">
      <p className="text-xs font-semibold tracking-[0.2em] uppercase text-sambal mb-2">Pesanan diantar</p>
      <h1 className="font-display text-3xl mb-2">{kurir.nama} lagi di jalan</h1>
      <p className="text-muted mb-10">Estimasi tiba {sisaDetik} detik lagi</p>

      <div className="relative rounded-3xl bg-krem px-4 pt-14 pb-6 mb-10 overflow-hidden">
        {/* jalan */}
        <div className="relative h-16">
          <div className="absolute inset-x-0 bottom-0 h-3 rounded-full bg-beige" aria-hidden />
          <div
            className="absolute inset-x-4 bottom-[5px] h-0.5 border-b-2 border-dashed border-white"
            aria-hidden
          />
          <span
            className="absolute text-4xl motion-safe:animate-[jalan_22s_linear_forwards]"
            style={{ bottom: 10 }}
            aria-hidden
          >
            <Gust className="inline-block w-7 mr-1 -mb-1 text-kunyit opacity-70" />
            {kurir.emoji}
          </span>
        </div>
      </div>

      <button type="button" onClick={() => setFase("panggilan")} className="text-sm underline text-muted">
        Lewati
      </button>

      <style>{`
        @keyframes jalan {
          from { left: 0%; }
          to { left: calc(100% - 2.5rem); }
        }
      `}</style>
    </div>
  );
}
