import gambarMap from "@/data/gambar.json";

interface Gambar {
  card: string; // ~320px wide — item cards, list thumbnails
  hero: string; // ~800px wide — item detail page
}

const map = gambarMap as Record<string, Gambar>;

/** Real food photo for an item (Wikimedia Commons), or null if none was found — caller falls back to emoji. */
export function gambarUntuk(slug: string, size: "card" | "hero" = "card"): string | null {
  return map[slug]?.[size] ?? null;
}
