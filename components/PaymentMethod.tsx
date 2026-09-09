"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { CreditCard, QrCode } from "@phosphor-icons/react";

type Metode = "kartu" | "ovo" | "gopay" | "dana" | "qris" | "mandiri" | "bni" | "bri";

// OVO/GoPay/DANA: there is no freely licensed official mark for any of the three
// (checked; Wikimedia Commons has nothing, unlike the bank and QRIS marks below,
// which really are public domain). So the brand colour appears only on the fake
// badge inside the panel, never as a stand-in logo.
const EWALLET: { id: Metode; nama: string; warna: string }[] = [
  { id: "ovo", nama: "OVO", warna: "#4C0A81" },
  { id: "gopay", nama: "GoPay", warna: "#00880C" },
  { id: "dana", nama: "DANA", warna: "#118EEA" },
];

// Real marks, public domain / CC0 from Wikimedia Commons.
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
      className={`flex min-h-11 items-center justify-center gap-2 rounded-full border px-3 py-2.5 text-sm font-medium transition-colors ${
        aktif ? "border-accent bg-accent-soft text-accent" : "border-line text-ink-2 hover:bg-surface hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}

function FieldPalsu({ label, value }: { label: string; value: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-ink-2">{label}</span>
      <input
        disabled
        value={value}
        readOnly
        className="tnum w-full rounded-full border border-line bg-bg px-4 py-3 text-ink-2"
      />
    </label>
  );
}

/** Every panel is labelled as fake, in the payment brand's own colour when it
 *  has one, so nobody can mistake this checkout for a real one. */
function BadgePalsu({ children, warna }: { children: React.ReactNode; warna?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
        warna ? "text-white" : "bg-surface-2 text-ink"
      }`}
      style={warna ? { background: warna } : undefined}
    >
      {children}
    </span>
  );
}

export default function PaymentMethod({ total }: { total: number }) {
  const [metode, setMetode] = useState<Metode>("kartu");
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

  useEffect(() => {
    if (metode !== "qris") return;
    let batal = false;
    const teks = `MAKANANGIN.COM QRIS PALSU. Situs parodi, bukan pembayaran asli. Rp${total}`;
    QRCode.toDataURL(teks, { width: 220, margin: 1, color: { dark: "#171717", light: "#ffffff" } })
      .then((url) => !batal && setQrDataUrl(url))
      .catch(() => {});
    return () => {
      batal = true;
    };
  }, [metode, total]);

  const wallet = EWALLET.find((w) => w.id === metode);
  const bank = BANK.find((b) => b.id === metode);

  return (
    <div>
      <div role="radiogroup" aria-label="Metode pembayaran" className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <MetodeChip aktif={metode === "kartu"} onClick={() => setMetode("kartu")}>
          <CreditCard size={17} weight="bold" aria-hidden />
          Kartu
        </MetodeChip>
        {EWALLET.map((w) => (
          <MetodeChip key={w.id} aktif={metode === w.id} onClick={() => setMetode(w.id)}>
            {w.nama}
          </MetodeChip>
        ))}
        <MetodeChip aktif={metode === "qris"} onClick={() => setMetode("qris")}>
          <QrCode size={17} weight="bold" aria-hidden />
          QRIS
        </MetodeChip>
        {BANK.map((b) => (
          <MetodeChip key={b.id} aktif={metode === b.id} onClick={() => setMetode(b.id)}>
            <img src={b.logo} alt="" aria-hidden className="h-4 w-auto shrink-0" />
            {b.nama}
          </MetodeChip>
        ))}
      </div>

      <div className="rounded-card bg-surface p-5">
        {metode === "kartu" && (
          <>
            <BadgePalsu>Kartu demo</BadgePalsu>
            <div className="mt-4 space-y-3">
              <FieldPalsu label="Nomor kartu" value="4242 4242 4242 4242" />
              <div className="flex gap-3">
                <div className="w-1/2">
                  <FieldPalsu label="Masa berlaku" value="12/29" />
                </div>
                <div className="w-1/2">
                  <FieldPalsu label="CVV" value="123" />
                </div>
              </div>
            </div>
          </>
        )}

        {wallet && (
          <>
            <BadgePalsu warna={wallet.warna}>{wallet.nama} palsu</BadgePalsu>
            <div className="mt-4">
              <FieldPalsu label={`Nomor ${wallet.nama}`} value="0812-3456-7890" />
            </div>
          </>
        )}

        {metode === "qris" && (
          <>
            <BadgePalsu>QRIS palsu</BadgePalsu>
            <div className="mt-4 flex flex-col items-center rounded-inner bg-white p-4">
              {qrDataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element -- data: URL, next/image ga relevan
                <img
                  src={qrDataUrl}
                  alt="Kode QRIS palsu. Cuma dekorasi, ga ngarah ke mana-mana."
                  width={180}
                  height={180}
                />
              ) : (
                <div className="h-[180px] w-[180px] animate-pulse rounded-inner bg-surface-2" aria-hidden />
              )}
              <p className="mt-3 max-w-[220px] text-center text-xs text-ink-2">
                Discan pun cuma nunjukin tulisan “situs parodi”. Ga ngarah ke rekening atau aplikasi
                mana pun.
              </p>
            </div>
          </>
        )}

        {bank && (
          <>
            <div className="flex items-center gap-2">
              <img src={bank.logo} alt={bank.nama} className="h-5 w-auto" />
              <BadgePalsu>Virtual account palsu</BadgePalsu>
            </div>
            <div className="mt-4">
              <FieldPalsu
                label={`Nomor virtual account ${bank.nama}`}
                value={`8808 ${bank.nama.length}${bank.id.length}12 3456`}
              />
            </div>
          </>
        )}
      </div>

      <p className="mt-3 text-xs leading-relaxed text-ink-2">
        Ini bukan pembayaran asli, apa pun metodenya. Ga ada uang, nomor, atau kode yang diproses ke
        mana pun.{" "}
        <a href="/tentang" className="underline underline-offset-2 hover:text-accent">
          Baca selengkapnya
        </a>
        .
      </p>
    </div>
  );
}
