"use client";

import { Minus, Plus, Trash } from "@phosphor-icons/react";
import type { CartLine } from "@/lib/cart";
import { formatRupiah } from "@/lib/harga";
import { gambarUntuk } from "@/lib/gambar";

/** "Jumbo (+15k)" -> "Jumbo". The price delta is already folded into hargaSatuan. */
function labelOpsi(pilihan: string): string {
  return pilihan.replace(/\s*\(\+\d+k\)/, "");
}

function QtyButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-ink transition-all hover:bg-surface-2 active:scale-90 sm:h-9 sm:w-9"
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

  return (
    <li className="flex gap-4 border-b border-line py-5 last:border-b-0">
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-inner bg-surface sm:h-28 sm:w-28">
        {foto ? (
          <img
            src={foto}
            alt={line.nama}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center text-4xl" aria-hidden>
            {line.emoji}
          </span>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate font-display text-base font-semibold leading-tight text-ink">{line.nama}</p>
            {line.daerah && <p className="truncate text-xs text-ink-2">{line.daerah}</p>}
          </div>
          <button
            type="button"
            aria-label={`Hapus ${line.nama} dari keranjang`}
            onClick={onHapus}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink-2 transition-colors hover:bg-surface hover:text-accent"
          >
            <Trash size={17} weight="bold" aria-hidden />
          </button>
        </div>

        {line.opsiTerpilih.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {line.opsiTerpilih.map((p) => (
              <span key={p} className="rounded-full bg-surface px-2.5 py-1 text-[11px] font-medium text-ink-2">
                {labelOpsi(p)}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-3">
          <p className="tnum font-semibold text-ink">{formatRupiah(line.hargaSatuan)}</p>
          <div className="flex items-center gap-1 rounded-full border border-line p-1">
            <QtyButton label={`Kurangi ${line.nama}`} onClick={() => onUbah(line.qty - 1)}>
              <Minus size={15} weight="bold" aria-hidden />
            </QtyButton>
            <span className="tnum w-6 text-center text-sm font-semibold">{line.qty}</span>
            <QtyButton label={`Tambah ${line.nama}`} onClick={() => onUbah(line.qty + 1)}>
              <Plus size={15} weight="bold" aria-hidden />
            </QtyButton>
          </div>
        </div>
      </div>
    </li>
  );
}
