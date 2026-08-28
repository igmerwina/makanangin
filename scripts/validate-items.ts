import { allItems, validateItems } from "../lib/items";
import type { Item } from "../lib/types";

// self-check: validator must catch a broken item
const bad: Item[] = [
  {
    slug: "",
    nama: "",
    kategori: "makanan",
    tipe: "umum",
    daerah: "",
    pulau: "Jawa",
    harga: 0,
    emoji: "🍚",
    deskripsi: "",
    cerita: "pendek",
    pedas: 0,
    halal: true,
    tags: [],
    opsi: [],
    resep: { porsi: 1, waktu: "1 menit", sulit: "mudah", bahan: [], langkah: [] },
  },
];
const badErrors = validateItems(bad);
if (badErrors.length === 0) {
  console.error("validate-items self-check GAGAL: validator tidak menangkap item rusak");
  process.exit(1);
}

// real check: production data must be clean
const errors = validateItems(allItems());
if (errors.length > 0) {
  console.error(`items.json punya ${errors.length} masalah:\n` + errors.map((e) => `  - ${e}`).join("\n"));
  process.exit(1);
}

console.log(`OK: ${allItems().length} item lolos validasi.`);
