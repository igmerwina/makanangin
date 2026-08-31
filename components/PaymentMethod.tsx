"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

type Metode = "kartu" | "ovo" | "gopay" | "dana" | "qris" | "mandiri" | "bni" | "bri";

// OVO/GoPay/DANA: ga ada logo resmi berlisensi bebas di mana pun (dicek — Wikimedia Commons
// kosong buat ketiganya, beda dari logo bank/QRIS di bawah yang beneran public domain/CC0).
// Motif situs jelas dompet digital, warna dekat brand-nya, tapi bukan reproduksi logo asli.
const EWALLET: { id: Metode; nama: string; warna: string }[] = [
  { id: "ovo", nama: "OVO", warna: "#4C0A81" },
  { id: "gopay", nama: "GoPay", warna: "#00880C" },
  { id: "dana", nama: "DANA", warna: "#118EEA" },
];

// Logo asli, public domain / CC0 dari Wikimedia Commons.
const BANK: { id: Metode; nama: string; logo: string }[] = [
  { id: "mandiri", nama: "Mandiri", logo: "/logo/mandiri.svg" },
  { id: "bni", nama: "BNI", logo: "/logo/bni.svg" },
  { id: "bri", nama: "BRI", logo: "/logo/bri.svg" },
];

function MetodeChip({
  aktif,
  onClick,
  children,
}: {
  aktif: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={aktif}
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-2.5 min-h-11 rounded-xl border text-sm font-medium transition-colors ${
        aktif ? "border-sambal bg-white ring-2 ring-sambal/30" : "border-border bg-white hover:border-sambal/40"
      }`}
    >
      {children}
    </button>
  );
}

export default function PaymentMethod({ total }: { total: number }) {
  const [metode, setMetode] = useState<Metode>("kartu");
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

  useEffect(() => {
    if (metode !== "qris") return;
    let batal = false;
    const teks = `MAKANANGIN.COM QRIS PALSU — situs parodi, bukan pembayaran asli, Rp${total}`;
    QRCode.toDataURL(teks, { width: 220, margin: 1, color: { dark: "#171717", light: "#ffffff" } })
      .then((url) => !batal && setQrDataUrl(url))
      .catch(() => {});
    return () => {
      batal = true;
    };
  }, [metode, total]);

  return (
    <div>
      <div role="radiogroup" aria-label="Metode pembayaran" className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
        <MetodeChip aktif={metode === "kartu"} onClick={() => setMetode("kartu")}>
          💳 Kartu
        </MetodeChip>
        {EWALLET.map((w) => (
          <MetodeChip key={w.id} aktif={metode === w.id} onClick={() => setMetode(w.id)}>
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: w.warna }} aria-hidden />
            {w.nama}
          </MetodeChip>
        ))}
        <MetodeChip aktif={metode === "qris"} onClick={() => setMetode("qris")}>
          <span aria-hidden>▦</span> QRIS
        </MetodeChip>
        {BANK.map((b) => (
          <MetodeChip key={b.id} aktif={metode === b.id} onClick={() => setMetode(b.id)}>
            <img src={b.logo} alt="" aria-hidden className="h-4 w-auto shrink-0" />
            {b.nama}
          </MetodeChip>
        ))}
      </div>

      <div className="rounded-2xl bg-krem p-5">
        {metode === "kartu" && (
          <>
            <p className="text-xs font-semibold mb-3 inline-block px-2.5 py-1 rounded-full bg-kunyit text-tinta">
              KARTU DEMO
            </p>
            <div className="space-y-3">
              <input
                disabled
                value="4242 4242 4242 4242"
                aria-label="Nomor kartu (demo, tidak bisa diisi)"
                className="w-full px-4 py-3 rounded-xl border border-border bg-white text-muted"
              />
              <div className="flex gap-3">
                <input
                  disabled
                  value="12/29"
                  aria-label="Masa berlaku (demo)"
                  className="w-1/2 px-4 py-3 rounded-xl border border-border bg-white text-muted"
                />
                <input
                  disabled
                  value="123"
                  aria-label="CVV (demo)"
                  className="w-1/2 px-4 py-3 rounded-xl border border-border bg-white text-muted"
                />
              </div>
            </div>
          </>
        )}

        {(metode === "ovo" || metode === "gopay" || metode === "dana") && (
          <>
            {(() => {
              const w = EWALLET.find((x) => x.id === metode)!;
              return (
                <>
                  <span
                    className="text-xs font-semibold mb-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-white"
                    style={{ background: w.warna }}
                  >
                    {w.nama} PALSU
                  </span>
                  <input
                    disabled
                    value="0812-3456-7890"
                    aria-label={`Nomor ${w.nama} (demo, tidak bisa diisi)`}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-white text-muted"
                  />
                </>
              );
            })()}
          </>
        )}

        {metode === "qris" && (
          <>
            <p className="text-xs font-semibold mb-3 inline-block px-2.5 py-1 rounded-full bg-kunyit text-tinta">
              QRIS PALSU
            </p>
            <div className="flex flex-col items-center bg-white rounded-xl p-4">
              {qrDataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element -- data: URL, next/image ga relevan
                <img src={qrDataUrl} alt="Kode QRIS palsu — cuma dekorasi, ga ngarah ke mana-mana" width={180} height={180} />
              ) : (
                <div className="w-[180px] h-[180px] rounded-lg bg-krem animate-pulse" aria-hidden />
              )}
              <p className="text-xs text-muted mt-3 text-center max-w-[220px]">
                Discan pun cuma nunjukin tulisan "situs parodi" — ga ngarah ke rekening atau aplikasi mana pun.
              </p>
            </div>
          </>
        )}

        {(metode === "mandiri" || metode === "bni" || metode === "bri") && (
          <>
            {(() => {
              const b = BANK.find((x) => x.id === metode)!;
              return (
                <>
                  <div className="flex items-center gap-2 mb-3">
                    <img src={b.logo} alt={b.nama} className="h-5 w-auto" />
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-kunyit text-tinta">
                      VA PALSU
                    </span>
                  </div>
                  <input
                    disabled
                    value={`8808 ${b.nama.length}${b.id.length}12 3456`}
                    aria-label={`Nomor virtual account ${b.nama} (demo, tidak bisa diisi)`}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-white text-muted"
                  />
                </>
              );
            })()}
          </>
        )}
      </div>

      <p className="text-xs text-muted mt-3">
        Ini bukan pembayaran asli, apa pun metodenya. Ga ada uang, nomor, atau kode yang diproses
        ke mana pun. Situs parodi — baca{" "}
        <a href="/tentang" className="underline">
          selengkapnya
        </a>
        .
      </p>
    </div>
  );
}
