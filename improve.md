# Makan Angin — Daftar Perbaikan

Hasil audit repo + inspeksi output build (`out/`) per commit `5623804`.
Urut prioritas: dampak nyata ke user dibagi effort.

Legenda effort: **S** = < 1 jam · **M** = 1-3 jam · **L** = > 3 jam

---

## P1 — Payload katalog 5x lebih besar dari yang dibutuhkan

**Status:** bug perf nyata, terukur
**Effort:** M
**Dampak:** semua pengunjung, terutama HP dengan koneksi lambat

### Masalah

Halaman katalog cuma butuh 10 field per item, tapi yang dikirim ke browser adalah objek `Item` utuh — termasuk `resep` (bahan + langkah + tips) yang ga pernah dirender di situ.

Ukuran terukur dari `out/`:

| Halaman | Ukuran HTML |
|---|---|
| `out/menu.html` | 196 KB |
| `out/resep.html` | 139 KB |
| `out/daerah/Jawa.html` | 114 KB |
| `out/index.html` | 34 KB |

Kalau `data/items.json` dipecah jadi index ringan:

```
items.json full : 97 KB
index ringan    : 17 KB   (82% lebih kecil)
  - resep saja  : 51 KB   (52% dari total — ini biang keroknya)
  - cerita saja : 12 KB
```

### Akar masalah

`components/ItemCard.tsx` adalah `"use client"` dan nerima prop `item: Item` (objek penuh). Semua yang dilempar ke client component akan di-serialize ke RSC payload, walau ga dipakai buat render.

Jalur kebocorannya:

- [app/menu/page.tsx:8](app/menu/page.tsx) — `<MenuBrowser items={allItems()} />`, `MenuBrowser` client component, 80 item penuh ikut
- [app/daerah/[pulau]/page.tsx:23](app/daerah/[pulau]/page.tsx) — `byPulau(pulau)` → `ItemCard` per item
- [app/page.tsx](app/page.tsx) — 8 item populer, dampak kecil tapi jalur sama

Field yang **beneran dipakai**:

- `ItemCard`: `slug`, `nama`, `emoji`, `daerah`, `harga`, `pedas`
- `MenuBrowser` (filter + cari): + `kategori`, `pulau`, `halal`, `tags`

Field yang **ga pernah dipakai** di katalog: `resep`, `cerita`, `deskripsi`, `opsi`, `tipe`.

### Rencana fix

1. Tambah tipe `ItemIndex` di `lib/types.ts` — subset 10 field di atas.
2. `lib/items.ts`: tambah `indexItems()` yang map `Item[]` → `ItemIndex[]`. `items.json` tetap satu file (ga usah dipecah fisik — Next.js tree-shake ga bantu di sini, yang penting apa yang di-*pass* ke client).
3. Ganti tipe prop `ItemCard` dan `MenuBrowser` dari `Item` → `ItemIndex`.
4. Rute yang butuh data penuh (`/menu/[slug]`, `/resep/[slug]`) tetap pakai `getItem()` — server component, ga kena serialisasi.

### Verifikasi

```bash
pnpm run build && ls -la out/menu.html
# target: < 60 KB (dari 196 KB)
grep -c "langkah" out/menu.html   # target: 0
```

---

## P2 — Ga ada `sitemap.xml` dan `robots.txt`

**Status:** hilang
**Effort:** S
**Dampak:** SEO — 180 halaman statis ga ke-index optimal

Halaman resep sengaja dibikin buat SEO (udah ada `Recipe` JSON-LD di [app/resep/[slug]/page.tsx:24](app/resep/[slug]/page.tsx)), tapi ga ada sitemap yang nunjukin ke crawler.

**Fix:** `app/sitemap.ts` + `app/robots.ts` (API bawaan Next.js, keduanya jalan di static export).

```ts
// app/sitemap.ts — kira-kira
export default function sitemap() {
  const base = "https://makanangin.com";
  return [
    { url: base, priority: 1 },
    { url: `${base}/menu` },
    { url: `${base}/resep` },
    ...allItems().map((i) => ({ url: `${base}/resep/${i.slug}` })),
    ...allItems().map((i) => ({ url: `${base}/menu/${i.slug}` })),
  ];
}
```

**Catatan:** butuh domain final dulu. Kalau belum fix, taruh di env var biar ga hardcode.

---

## P3 — Ga ada OG image

**Status:** hilang sebagian
**Effort:** S (statis) / M (per-item)
**Dampak:** semua link yang di-share ke WA/Twitter/Slack tampil polos

Yang udah ada: `/menu/[slug]` pass `images` dari foto Wikimedia ([app/menu/[slug]/page.tsx:24](app/menu/[slug]/page.tsx)).
Yang belum: beranda, `/menu`, `/resep`, `/resep/[slug]`, `/daerah/*` — semua ga ada gambar preview.

**Fix minimum:** satu `app/opengraph-image.tsx` (Next.js generate PNG saat build) buat semua rute yang belum punya.
**Fix bagus:** per-resep pakai foto item + judul di-overlay.

---

## P4 — 6 halaman ketinggalan redesign

**Status:** inkonsistensi visual
**Effort:** M per halaman
**Dampak:** kerasa banget di checkout — user baru lewat keranjang yang udah bagus terus mendarat di halaman gaya lama

Yang udah di-redesign: beranda, `/menu/[slug]`, `/keranjang`.
Yang masih pakai bahasa visual M1 (container sempit, card lama, hierarki lemah):

| Halaman | Container sekarang | Catatan |
|---|---|---|
| [app/checkout/page.tsx](app/checkout/page.tsx) | `max-w-xl` | **paling prioritas** — lanjutan langsung dari keranjang |
| [app/riwayat/page.tsx](app/riwayat/page.tsx) | `max-w-xl` | ga ada foto item sama sekali, cuma teks |
| [app/pesanan-selesai/page.tsx](app/pesanan-selesai/page.tsx) | `max-w-xl` | ini klimaks lelucon situsnya, harusnya paling niat |
| [app/resep/page.tsx](app/resep/page.tsx) | `max-w-4xl` | index resep, thumbnail masih kecil (56px) |
| [app/resep/[slug]/page.tsx](app/resep/[slug]/page.tsx) | `max-w-4xl` | ga ada foto hidangan sama sekali di halaman resepnya |
| [app/tentang/page.tsx](app/tentang/page.tsx) | `max-w-2xl` | isinya masih placeholder "Isi lengkap nyusul" |

**Catatan khusus `/resep/[slug]`:** aneh — halaman resep ga nampilin foto makanannya padahal fotonya udah ada di `data/gambar.json`. Perbaikan paling murah dengan dampak visual paling besar di sini.

---

## P5 — Aksesibilitas

**Effort:** S untuk semua item di bawah

### 5a. Focus ring bawaan browser kurang kontras di tombol merah

Kabar baik: **ga ada** `outline-none` di codebase, jadi focus ring bawaan browser masih jalan — keyboard user ga sepenuhnya kehilangan jejak.
Masalahnya: ring default (biru/hitam tipis) hampir ga keliatan di atas tombol `bg-sambal` (merah pekat).

**Fix:** satu aturan global di `app/globals.css`:

```css
:focus-visible {
  outline: 2px solid var(--color-tinta);
  outline-offset: 2px;
}
```

### 5b. Ga ada `aria-live` buat perubahan keranjang

Konfirmasi 0 hasil di seluruh repo. Tambah item ke keranjang ga diumumkan sama sekali ke screen reader — user cuma "denger" hening padahal state berubah.

**Fix:** region `aria-live="polite"` di `CartProvider` atau `layout.tsx` yang nyebut "{nama} masuk keranjang, total {n} item".

### 5c. `aria-label` belum merata

Udah ada di: `CartItemCard` (2), `PanggilanMasuk` (2), `checkout` (3), `ItemCard` (1), `menu/[slug]` (1).
Belum dicek/kemungkinan kurang: tombol ikon di `OpsiPicker`, `BottomNav`, tombol "Lewati" di `kurir`.

### 5d. Safe-area iPhone

[app/layout.tsx:35](app/layout.tsx) pakai `pb-16` mati buat clearance bottom nav — ga hitung home indicator iPhone. Nav berpotensi ketiban.

**Fix:**

```css
padding-bottom: calc(4rem + env(safe-area-inset-bottom));
```

---

## P6 — Belum pernah diuji sama sekali

**Effort:** M
**Status:** unknown, bukan "aman"

Ga ada satupun dari ini yang pernah dijalanin:

- **320px** (layar tersempit) — paling berisiko: grid keranjang, qty stepper, tombol CTA yang teksnya panjang
- **Safari iOS / Chrome Android** — semua verifikasi selama ini pakai Chromium desktop di browser pane
- **Throttle 4G** — relevan banget mengingat P1 di atas
- **Lighthouse** — target plan.md ≥ 90 semua kategori, angka sekarang: belum tahu
- **Screen reader** — belum pernah sekalipun

Jangan anggap "belum ketemu bug" = "ga ada bug". Ini murni belum dites.

---

## P7 — Fitur yang direncanakan tapi belum ada

### 7a. Share keranjang lewat URL (M3)

`lib/share.ts` belum ada. Tombol "Bagikan" di layar konsolasi udah sengaja di-skip waktu M1 karena nunggu ini.
Rencana asli: encode isi keranjang ke URL (base64/compact), decode pas load, banner "Ini pesanan dari temanmu".

### 7b. Deploy (M0, satu-satunya sisa M0)

Masih cuma di GitHub, belum live. Butuh keputusan: Vercel atau Cloudflare Pages. `output: 'export'` udah siap buat dua-duanya.

### 7c. Isi halaman Tentang (M4)

Masih placeholder. Disclaimer parodi udah ada di footer + checkout, tapi halaman Tentang-nya sendiri belum diisi.

---

## Urutan yang disarankan

```
P1  (payload)        → dampak ke semua user, angkanya jelas
P5a + 5d (a11y)      → murah, rusaknya nyata
P4  (checkout dulu)  → inkonsistensi paling kerasa
P4  (/resep/[slug])  → murah, dampak visual besar
P2 + P3 (SEO)        → butuh domain final dulu
P6  (testing)        → sebelum rilis
P7b (deploy)         → penutup
```

## Yang sengaja TIDAK masuk daftar

- **Pivot ke "app buat orang diet"** — udah dinilai, kesimpulan: bagus sebagai sudut copy/marketing, bukan pivot produk. Nyerempet klaim kesehatan yang ga bisa didukung situs statis tanpa akun/notifikasi.
- **Video YouTube per item** — udah dicoba, scraping ke-block 403, mirror Invidious publik mati semua, ga ada API key. Sekarang link keluar ke pencarian. Bisa di-upgrade kalau ada API key: tinggal ganti isi `lib/video.ts`.
- **7 item tanpa foto** — `gulai-ikan-patin`, `gulai-tepek-ikan`, `juhu-singkah`, `nasi-bekepor`, `sinonggi`, `ikan-kuah-kuning-maluku`, `es-timun-serut`. Hidangan daerah niche, ga ada di Wikimedia Commons. Fallback emoji jalan. Mending kosong daripada salah foto.
