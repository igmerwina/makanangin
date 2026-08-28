import assert from "node:assert";
import { terapkanFilter } from "../lib/filter";
import { allItems } from "../lib/items";

const items = allItems();

assert.ok(terapkanFilter(items, { kategori: "makanan" }).every((i) => i.kategori === "makanan"));
assert.ok(terapkanFilter(items, { pulau: "Jawa" }).every((i) => i.pulau === "Jawa"));
assert.ok(terapkanFilter(items, { cari: "rendang" }).some((i) => i.slug === "rendang"));
assert.ok(terapkanFilter(items, { cari: "sumatera barat" }).some((i) => i.slug === "rendang"), "cari cocok ke daerah");
assert.strictEqual(terapkanFilter(items, { cari: "zzz-ga-ada" }).length, 0);

console.log("OK: filter.ts lolos semua assert.");
