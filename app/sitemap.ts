import type { MetadataRoute } from "next";
import { allItems } from "@/lib/items";

export const dynamic = "force-static";

// TODO: ganti kalau domain final beda dari makanangin.com
const BASE = "https://makanangin.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const items = allItems();
  const pulauSet = new Set(items.map((i) => i.pulau));

  const statis: MetadataRoute.Sitemap = [
    { url: BASE, priority: 1 },
    { url: `${BASE}/menu`, priority: 0.9 },
    { url: `${BASE}/resep`, priority: 0.9 },
    { url: `${BASE}/tentang`, priority: 0.3 },
  ];

  const menuPages = items.map((i) => ({ url: `${BASE}/menu/${i.slug}`, priority: 0.7 }));
  const resepPages = items.map((i) => ({ url: `${BASE}/resep/${i.slug}`, priority: 0.8 }));
  const daerahPages = Array.from(pulauSet).map((p) => ({ url: `${BASE}/daerah/${p}`, priority: 0.5 }));

  return [...statis, ...menuPages, ...resepPages, ...daerahPages];
}
