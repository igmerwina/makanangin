"use client";

import { animated, useSpring } from "@react-spring/web";
import type { CartLine } from "@/lib/cart";
import { formatRupiah } from "@/lib/harga";
import { gambarUntuk } from "@/lib/gambar";

/** "Jumbo (+15k)" -> "Jumbo" — the price delta is already folded into hargaSatuan. */
function labelOpsi(pilihan: string): string {
  return pilihan.replace(/\s*\(\+\d+k\)/, "");
}

function QtyButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="w-9 h-9 sm:w-8 sm:h-8 min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 shrink-0 rounded-full flex items-center justify-center text-tinta hover:bg-white active:scale-90 transition-all"
    >
      {children}
    </button>
  );
}

export default function CartItemCard({
  line,
  onUbah,
  onHapus,
}: {
  line: CartLine;
  onUbah: (qty: number) => void;
  onHapus: () => void;
}) {
  const foto = gambarUntuk(line.slug, "card");
  const [style, api] = useSpring(() => ({ y: 0, config: { tension: 400, friction: 26 } }));

  return (
    <animated.li
      style={style}
      onMouseEnter={() => api.start({ y: -2 })}
      onMouseLeave={() => api.start({ y: 0 })}
      className="flex gap-4 rounded-2xl bg-krem/60 hover:bg-krem p-3 sm:p-4 transition-colors"
    >
      <div className="relative w-20 h-20 sm:w-28 sm:h-28 shrink-0 rounded-2xl overflow-hidden bg-white flex items-center justify-center">
        {foto ? (
          <img
            src={foto}
            alt={line.nama}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <span className="text-4xl" aria-hidden>
            {line.emoji}
          </span>
        )}
      </div>

      <div className="flex-1 min-w-0 flex flex-col">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="font-semibold text-tinta leading-tight truncate">{line.nama}</p>
            {line.daerah && <p className="text-xs text-muted truncate">{line.daerah}</p>}
          </div>
          <button
            type="button"
            aria-label={`Hapus ${line.nama} dari keranjang`}
            onClick={onHapus}
            className="shrink-0 text-xs text-muted hover:text-sambal transition-colors underline-offset-2 hover:underline"
          >
            🗑 Hapus
          </button>
        </div>

        {line.opsiTerpilih.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {line.opsiTerpilih.map((p) => (
              <span key={p} className="text-[11px] font-medium text-tinta/70 bg-beige rounded-full px-2 py-0.5">
                {labelOpsi(p)}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto pt-2 flex flex-wrap items-center justify-between gap-2">
          <p className="font-semibold text-tinta">{formatRupiah(line.hargaSatuan)}</p>
          <div className="flex items-center gap-1 bg-white rounded-full border border-border px-1 py-1">
            <QtyButton label={`Kurangi ${line.nama}`} onClick={() => onUbah(line.qty - 1)}>
              −
            </QtyButton>
            <span className="w-6 text-center text-sm font-semibold tabular-nums">{line.qty}</span>
            <QtyButton label={`Tambah ${line.nama}`} onClick={() => onUbah(line.qty + 1)}>
              +
            </QtyButton>
          </div>
        </div>
      </div>
    </animated.li>
  );
}
