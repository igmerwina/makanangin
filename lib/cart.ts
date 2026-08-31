import { hitungTotal } from "./harga";

export interface CartLine {
  id: string; // slug + opsi terpilih, di-hash jadi id baris unik
  slug: string;
  nama: string;
  emoji: string;
  daerah: string;
  hargaSatuan: number; // sudah termasuk delta opsi
  opsiTerpilih: string[];
  qty: number;
}

export function lineId(slug: string, opsiTerpilih: string[]): string {
  return `${slug}::${[...opsiTerpilih].sort().join(",")}`;
}

export function tambahKeCart(
  cart: CartLine[],
  item: { slug: string; nama: string; emoji: string; daerah: string; harga: number },
  opsiTerpilih: string[],
  qty = 1
): CartLine[] {
  const id = lineId(item.slug, opsiTerpilih);
  const existing = cart.find((l) => l.id === id);
  if (existing) {
    return cart.map((l) => (l.id === id ? { ...l, qty: l.qty + qty } : l));
  }
  return [
    ...cart,
    {
      id,
      slug: item.slug,
      nama: item.nama,
      emoji: item.emoji,
      daerah: item.daerah,
      hargaSatuan: hitungTotal(item.harga, opsiTerpilih),
      opsiTerpilih,
      qty,
    },
  ];
}

export function ubahQty(cart: CartLine[], id: string, qty: number): CartLine[] {
  if (qty <= 0) return cart.filter((l) => l.id !== id);
  return cart.map((l) => (l.id === id ? { ...l, qty } : l));
}

export function hapusDariCart(cart: CartLine[], id: string): CartLine[] {
  return cart.filter((l) => l.id !== id);
}

export function subtotalCart(cart: CartLine[]): number {
  return cart.reduce((sum, l) => sum + l.hargaSatuan * l.qty, 0);
}
