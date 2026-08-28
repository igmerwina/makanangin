"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import kurirList from "@/data/kurir.json";
import PanggilanMasuk from "@/components/PanggilanMasuk";
import { useCart } from "@/lib/CartProvider";

const DURASI_MS = 22000;

export default function KurirPage() {
  const router = useRouter();
  const { kosongkan } = useCart();
  const [kurir] = useState(() => kurirList[Math.floor(Math.random() * kurirList.length)]);
  const [fase, setFase] = useState<"jalan" | "panggilan">("jalan");
  const [sisaDetik, setSisaDetik] = useState(Math.ceil(DURASI_MS / 1000));

  // order sudah tersimpan sebelum sampai sini (lihat /checkout) — aman dikosongkan sekarang
  useEffect(() => {
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
      <h1 className="font-display text-2xl mb-2">{kurir.nama} lagi di jalan</h1>
      <p className="text-muted mb-10">Estimasi tiba {sisaDetik} detik lagi</p>

      <div className="relative h-16 border-b-2 border-dashed border-border mb-10 overflow-hidden">
        <span
          className="absolute text-4xl motion-safe:animate-[jalan_22s_linear_forwards]"
          style={{ bottom: 4 }}
          aria-hidden
        >
          {kurir.emoji}
        </span>
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
