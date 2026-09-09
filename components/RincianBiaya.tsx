import { BIAYA_RINDU, ONGKIR, formatRupiah, totalPesanan } from "@/lib/harga";

function Baris({ label, nilai }: { label: string; nilai: number }) {
  return (
    <div className="flex justify-between">
      <span className="text-ink-2">{label}</span>
      <span className="tnum font-medium text-ink">{formatRupiah(nilai)}</span>
    </div>
  );
}

/** Rincian biaya yang sama persis di keranjang dan checkout. */
export default function RincianBiaya({ subtotal, labelTotal }: { subtotal: number; labelTotal: string }) {
  return (
    <>
      <div className="mb-4 space-y-2 text-sm">
        <Baris label="Subtotal" nilai={subtotal} />
        <Baris label="Ongkir" nilai={ONGKIR} />
        <Baris label="Biaya rindu kampung" nilai={BIAYA_RINDU} />
      </div>
      <div className="mb-1 flex items-baseline justify-between border-t border-line pt-4">
        <span className="font-medium text-ink">{labelTotal}</span>
        <span className="tnum font-display text-2xl font-semibold text-ink">
          {formatRupiah(totalPesanan(subtotal))}
        </span>
      </div>
    </>
  );
}
