// Resolve a real food photo per item from Wikipedia (id -> en fallback), store as data/gambar.json.
// Public, freely-licensed Commons images, compressed via a proper resized thumbnail (never a
// full-res original — those can be tens of MB).
//
// Two-step resolution per item:
//  1. Wikipedia page summary API -> find which Commons file is the lead image.
//  2. Commons imageinfo API with iiurlwidth -> get a thumb URL Wikimedia has actually generated
//     and will serve (arbitrary widths like ".../480px-Foo.jpg" 400 unless MediaWiki generated
//     that exact size first — this step forces the generation and returns a URL that works).
import items from "../data/items.json" with { type: "json" };
import fs from "node:fs";
import path from "node:path";

const OUT = path.join(process.cwd(), "data", "gambar.json");
const FORCE = process.argv.includes("--force");
type Gambar = { card: string; hero: string };
const existing: Record<string, Gambar> = FORCE || !fs.existsSync(OUT) ? {} : JSON.parse(fs.readFileSync(OUT, "utf-8"));

const UA = "makanangin.com/0.1 (https://github.com/P93694-dev/makanangin; content-fetch script)";
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function getJson(url: string): Promise<any | null> {
  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await fetch(url, { headers: { "User-Agent": UA } });
    if (res.status === 429) {
      await sleep(2000 * (attempt + 1));
      continue;
    }
    if (!res.ok) return null;
    return res.json();
  }
  return null;
}

/** Find the Commons file title Wikipedia uses as this page's lead image. */
async function leadImageFile(title: string, lang: "id" | "en"): Promise<string | null> {
  const url = `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
  const data = await getJson(url);
  await sleep(250);
  if (!data || data.type === "disambiguation") return null;
  const src: string | undefined = data.originalimage?.source ?? data.thumbnail?.source;
  if (!src) return null;
  // Both fields are thumb-style URLs (".../commons/thumb/a/ab/File.jpg/640px-File.jpg") — the
  // real filename is the segment right before the "NNNpx-File.jpg" one, not the last segment.
  const parts = src.split("?")[0].split("/");
  const sizedIdx = parts.findIndex((p) => /^\d+px-/.test(p));
  const filename = sizedIdx > 0 ? parts[sizedIdx - 1] : parts[parts.length - 1];
  return decodeURIComponent(filename);
}

/** Ask Commons to actually generate (and hand back a working URL for) a thumb at this width. */
async function thumbUrl(filename: string, width: number): Promise<string | null> {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(
    `File:${filename}`
  )}&prop=imageinfo&iiprop=url&iiurlwidth=${width}&format=json`;
  const data = await getJson(url);
  await sleep(250);
  const pages = data?.query?.pages;
  if (!pages) return null;
  const page: any = Object.values(pages)[0];
  return page?.imageinfo?.[0]?.thumburl ?? null;
}

// Wikipedia article titles are sentence case ("Nasi goreng"), not Title Case ("Nasi Goreng") —
// this is why a plain nama lookup misses. Try sentence case too before giving up.
function sentenceCase(s: string): string {
  return s
    .split(" ")
    .map((w, i) => (i === 0 ? w : w.toLowerCase()))
    .join(" ");
}

// Manual title overrides: either the plain nama doesn't resolve, or it resolves to the WRONG
// (non-Indonesian / generic) dish and needs a title that lands on the right Commons photo.
const OVERRIDES: Record<string, string> = {
  "es-timun-serut": "Timun serut",
  "kue-rangi": "Kue rangi",
  "juhu-singkah": "Umbut rotan",
  "gulai-tepek-ikan": "Tepek ikan",
  "kepiting-soka-tarakan": "Soft shell crab",
  "air-guraka": "Wedang jahe",
  "sarabba": "Wedang jahe",
  "ikan-bakar-manokwari": "Ikan bakar",
  "ikan-kuah-kuning-maluku": "Ikan kuah kuning",
  "gohu-ikan": "Gohu ikan",
  "se-i-sapi": "Se'i",
  "gonggong-rebus": "Gonggong",
  "bubur-pedas-sambas": "Bubur pedas",
  "nasi-liwet-solo": "Nasi liwet",
  "sate-ayam-madura": "Sate ayam",
  "es-pisang-ijo": "Pisang ijo",
};

// Cases where Wikipedia's own lead image is wrong/mismatched for the dish — bypass title lookup
// entirely and point straight at a verified correct Commons filename.
const DIRECT_FILE: Record<string, string> = {
  "nasi-goreng": "Nasi goreng indonesia.jpg",
};

let filled = 0;
let skipped = 0;
let failed: string[] = [];

for (const item of items as { slug: string; nama: string }[]) {
  if (existing[item.slug]) {
    skipped++;
    continue;
  }

  let filename: string | null = DIRECT_FILE[item.slug] ?? null;
  if (!filename) {
    const titles = OVERRIDES[item.slug]
      ? [OVERRIDES[item.slug]]
      : [item.nama, sentenceCase(item.nama)].filter((t, i, arr) => arr.indexOf(t) === i);
    for (const title of titles) {
      for (const lang of ["id", "en"] as const) {
        filename = await leadImageFile(title, lang);
        if (filename) break;
      }
      if (filename) break;
    }
  }

  if (!filename) {
    failed.push(item.slug);
    continue;
  }

  const [card, hero] = await Promise.all([thumbUrl(filename, 320), thumbUrl(filename, 800)]);
  if (!card || !hero) {
    failed.push(item.slug);
    continue;
  }

  existing[item.slug] = { card, hero };
  filled++;
  process.stdout.write(".");
}

fs.writeFileSync(OUT, JSON.stringify(existing, null, 2) + "\n");
console.log(`\nfilled ${filled}, skipped (cached) ${skipped}, failed ${failed.length}`);
if (failed.length) console.log("no image found:", failed.join(", "));
