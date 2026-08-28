import type { Item, Kategori } from "./types";

export interface Filters {
  kategori?: Kategori;
  pulau?: string;
  halal?: boolean;
  cari?: string;
}

export function terapkanFilter(items: Item[], f: Filters): Item[] {
  return items.filter((item) => {
    if (f.kategori && item.kategori !== f.kategori) return false;
    if (f.pulau && item.pulau !== f.pulau) return false;
    if (f.halal && !item.halal) return false;
    if (f.cari) {
      const q = f.cari.toLowerCase();
      const cocok =
        item.nama.toLowerCase().includes(q) ||
        item.daerah.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q));
      if (!cocok) return false;
    }
    return true;
  });
}
