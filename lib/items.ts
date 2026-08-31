import raw from "@/data/items.json";
import type { Item, ItemIndex } from "./types";

const items = raw as Item[];
const INDEX_KEYS: (keyof ItemIndex)[] = [
  "slug",
  "nama",
  "emoji",
  "daerah",
  "pulau",
  "harga",
  "pedas",
  "kategori",
  "halal",
  "tags",
];

function toIndex(item: Item): ItemIndex {
  const out = {} as ItemIndex;
  for (const k of INDEX_KEYS) (out as any)[k] = item[k];
  return out;
}

export function allItems(): Item[] {
  return items;
}

export function getItem(slug: string): Item | undefined {
  return items.find((i) => i.slug === slug);
}

export function byPulau(pulau: string): Item[] {
  return items.filter((i) => i.pulau === pulau);
}

/** Buat kartu katalog — pass ini ke komponen client, bukan allItems()/byPulau(). */
export function indexItems(): ItemIndex[] {
  return items.map(toIndex);
}

export function indexByPulau(pulau: string): ItemIndex[] {
  return items.filter((i) => i.pulau === pulau).map(toIndex);
}

export function getIndexItem(slug: string): ItemIndex | undefined {
  const item = getItem(slug);
  return item ? toIndex(item) : undefined;
}

/** Throws with a readable message if any item is missing required content. Called at build time. */
export function validateItems(list: Item[] = items): string[] {
  const errors: string[] = [];
  const seenSlugs = new Set<string>();

  for (const item of list) {
    const where = item.slug || item.nama || "(tanpa slug)";
    if (!item.slug) errors.push(`${where}: slug kosong`);
    else if (seenSlugs.has(item.slug)) errors.push(`${item.slug}: slug duplikat`);
    else seenSlugs.add(item.slug);

    if (!item.nama) errors.push(`${where}: nama kosong`);
    if (!item.daerah) errors.push(`${where}: daerah kosong`);
    if (!item.deskripsi) errors.push(`${where}: deskripsi kosong`);
    if (!item.cerita || item.cerita.length < 20) errors.push(`${where}: cerita kosong/terlalu pendek`);
    if (!item.resep) {
      errors.push(`${where}: resep kosong`);
    } else {
      if (!item.resep.bahan?.length) errors.push(`${where}: resep.bahan kosong`);
      if (!item.resep.langkah?.length) errors.push(`${where}: resep.langkah kosong`);
    }
  }

  return errors;
}
