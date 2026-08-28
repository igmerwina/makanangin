import Link from "next/link";
import type { Item } from "@/lib/types";

export default function ItemCard({ item }: { item: Item }) {
  return (
    <Link
      href={`/menu/${item.slug}`}
      className="flex flex-col gap-1 rounded-2xl border border-border bg-card p-4 hover:border-sambal transition-colors"
    >
      <span className="text-4xl" aria-hidden>
        {item.emoji}
      </span>
      <span className="font-display text-lg leading-tight">{item.nama}</span>
      <span className="text-sm text-muted">{item.daerah}</span>
      <div className="flex items-center justify-between mt-1">
        <span className="font-medium">Rp{item.harga.toLocaleString("id-ID")}</span>
        {item.pedas > 0 && <span aria-label={`Level pedas ${item.pedas}`}>{"🌶️".repeat(item.pedas)}</span>}
      </div>
    </Link>
  );
}
