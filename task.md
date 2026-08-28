# makanangin.com — Task

Aturan: kerjakan urut milestone. Satu task = satu commit kalau bisa. `[ ]` belum, `[x]` selesai.
Definition of Done tiap task: jalan di mobile (375px) **dan** desktop (1440px), tidak ada error konsol.

---

## M0 — Fondasi

### Setup
- [ ] `npx create-next-app@latest` — TypeScript, Tailwind, App Router, `src/` off, ESLint on
- [ ] Set `output: 'export'` di `next.config.js`
- [ ] Buat struktur folder: `app/`, `data/`, `lib/`, `components/`
- [ ] `.gitignore`, `README.md` singkat, git init + commit awal
- [ ] Deploy kosong ke Vercel/Cloudflare Pages, pastikan pipeline hidup sejak hari pertama

### Token desain
- [ ] `app/globals.css`: CSS variables warna (kunyit, sambal, pandan, gula aren, krem, tinta), radius, shadow
- [ ] Blok `@media (prefers-color-scheme: dark)` untuk semua token warna
- [ ] Pilih + pasang 2 font (display + sans) via `next/font`
- [ ] Extend `tailwind.config` agar token warna terpakai sebagai class
- [ ] Cek kontras teks utama vs latar ≥ 4.5:1 di terang & gelap

### Layout shell
- [ ] `components/BottomNav.tsx` — mobile only (`md:hidden`), 4 tab, ikon + label, tinggi ≥ 56px
- [ ] `components/TopNav.tsx` — desktop only (`hidden md:flex`), logo, link, badge keranjang
- [ ] `app/layout.tsx` — pasang kedua nav + `<main>` dengan padding bawah aman untuk bottom nav
- [ ] `components/Footer.tsx` — disclaimer parodi + link tentang
- [ ] Halaman `app/tentang/page.tsx` (statis, isi menyusul)

### Data awal
- [ ] Tulis tipe `types.ts` sesuai skema di plan.md §2
- [ ] `data/items.json` — 10 item contoh lengkap (termasuk resep + cerita), campur umum & tradisional
- [ ] `lib/items.ts` — loader + helper `getItem(slug)`, `allItems()`, `byPulau()`
- [ ] Validator build-time: script cek tiap item punya slug unik, resep, cerita, daerah — gagal build kalau tidak
- [ ] Satu self-check runnable untuk validator (assert-based, tanpa framework)

### Katalog v0
- [ ] `app/menu/page.tsx` — grid kartu; 1 kolom mobile, 3-4 kolom desktop
- [ ] `components/ItemCard.tsx` — emoji, nama, daerah, harga, chip pedas
- [ ] Buka di 375px dan 1440px, perbaiki yang jebol

**M0 selesai bila**: katalog 10 item tampil rapi di dua ukuran, sudah live di URL preview.

---

## M1 — Loop inti

### Filter & cari
- [ ] `lib/filter.ts` — filter murni (kategori, pulau, pedas, harga, halal) + pencarian teks (nama, daerah, tag)
- [ ] Self-check `lib/filter.test.ts` — assert hasil filter & pencarian
- [ ] `components/FilterBar.tsx` — chip scroll horizontal di mobile
- [ ] `components/FilterSidebar.tsx` — sidebar sticky di desktop
- [ ] Sinkronkan filter aktif ke query string agar bisa di-share/back
- [ ] Input pencarian dengan debounce, tombol clear, state kosong ("Ga ada. Coba 'soto'.")

### Detail item
- [ ] `app/menu/[slug]/page.tsx` + `generateStaticParams`
- [ ] `components/OpsiPicker.tsx` — radio untuk pilihan tunggal, checkbox untuk multi
- [ ] Hitung harga dinamis dari opsi terpilih
- [ ] Tombol "Tambah ke keranjang" sticky di bawah (mobile)
- [ ] Desktop: tampil sebagai dialog dua kolom di atas katalog, URL tetap berubah (intercepting route atau state modal)
- [ ] Blok cerita asal daerah + link ke `/daerah/[pulau]`
- [ ] Metadata + OpenGraph per item

### Keranjang
- [ ] `lib/cart.ts` — add / remove / ubah qty / total; fungsi murni
- [ ] Self-check `lib/cart.test.ts` — assert total, item dengan opsi berbeda dihitung terpisah
- [ ] `lib/storage.ts` — baca/tulis `localStorage` aman (try/catch, SSR guard, versi skema)
- [ ] `CartProvider` context + hook `useCart()`
- [ ] `app/keranjang/page.tsx` (mobile: halaman penuh)
- [ ] `components/CartDrawer.tsx` (desktop: drawer kanan)
- [ ] Rincian biaya: subtotal, ongkir fiktif, biaya absurd acak dari daftar tetap
- [ ] State kosong keranjang + CTA balik ke menu

### Checkout palsu
- [ ] `app/checkout/page.tsx`
- [ ] Form kartu demo: semua input `disabled`, nilai prefilled, badge "KARTU DEMO"
- [ ] Alamat pengantaran prefilled lucu, boleh diganti (teks bebas, tidak disimpan ke mana pun)
- [ ] Disclaimer besar di atas tombol bayar
- [ ] Tombol "Bayar" → simpan order ke localStorage → redirect `/kurir`
- [ ] Layout dua kolom desktop, satu kolom mobile

### Kurir & panggilan
- [ ] `data/kurir.json` — nama, emoji, kecepatan, kalimat khas
- [ ] `data/alasan.json` — ≥ 25 alasan gagal antar
- [ ] `app/kurir/page.tsx` — peta doodle SVG/CSS, kurir bergerak sepanjang path, ETA mundur
- [ ] Durasi animasi 20-35 detik, ada tombol "Lewati"
- [ ] `prefers-reduced-motion`: lewati animasi, langsung ke panggilan
- [ ] `components/PanggilanMasuk.tsx` — full-screen mirip panggilan HP, avatar, tombol terima/tolak
- [ ] Alasan acak + tombol "Ya udah" → layar konsolasi
- [ ] Desktop: kartu panggilan terpusat, bukan full-screen mentah

### Konsolasi + resep
- [ ] `components/LayarKonsolasi.tsx` — "Makanan ga dateng. Tapi resepnya buat kamu."
- [ ] Tampilkan resep tiap item di keranjang + total uang yang "dihemat"
- [ ] Tombol: Lihat resep lengkap / Pesan lagi / Bagikan
- [ ] `app/resep/[slug]/page.tsx` — bahan, langkah, tips, waktu, porsi
- [ ] `app/resep/page.tsx` — index resep, bisa dicari
- [ ] Resep: akordeon di mobile, dua kolom (bahan sticky) di desktop

**M1 selesai bila**: dari beranda sampai layar resep bisa dijalani tanpa jalan buntu, di mobile dan desktop.

---

## M2 — Konten

- [ ] Template penulisan item (deskripsi, cerita, resep) — tetapkan panjang & nada
- [ ] Daftar 80 item + provinsi asal, cek 34 provinsi terwakili
- [ ] Tulis 50 makanan (umum + tradisional)
- [ ] Tulis 15 minuman
- [ ] Tulis 15 jajanan/kudapan
- [ ] Uji tiap resep secara logika: bahan konsisten dengan langkah, urutan masuk akal, satuan jelas
- [ ] `data/warung.json` — 8-12 warung fiktif, tiap item dipetakan ke warung
- [ ] Halaman `app/daerah/[pulau]/page.tsx` — daftar item per pulau + narasi singkat
- [ ] Jalankan validator konten; nol pelanggaran

**M2 selesai bila**: `items.json` 80 item, tidak ada field wajib kosong, validator lolos.

---

## M3 — Poles

### Riwayat & share
- [ ] `app/riwayat/page.tsx` — daftar order lalu, total hemat, tombol hapus riwayat
- [ ] `lib/share.ts` — encode isi keranjang ke URL (base64/compact), decode di load
- [ ] Halaman share: buka URL → keranjang terisi, banner "Ini pesanan dari temanmu"
- [ ] Batasi panjang URL; kalau kepanjangan, potong + beri tahu

### SEO
- [ ] Metadata default + per-rute
- [ ] JSON-LD `Recipe` di tiap halaman resep
- [ ] `sitemap.xml` + `robots.txt` di build
- [ ] OG image (statis dulu, satu desain; per-item kalau sempat)

### Aksesibilitas
- [ ] Navigasi keyboard penuh: katalog, opsi, keranjang, panggilan
- [ ] Focus ring terlihat di semua kontrol
- [ ] `aria-label` pada tombol ikon; `aria-live` untuk perubahan keranjang
- [ ] Dialog/drawer: focus trap + tutup pakai Esc
- [ ] Cek dengan screen reader sekali, perbaiki yang kacau

### Performa
- [ ] Pecah data: index katalog ringan, resep dimuat per rute
- [ ] Audit bundle; buang dependency yang tidak terpakai
- [ ] Lighthouse mobile & desktop ≥ 90 semua kategori
- [ ] Uji di jaringan lambat (throttle 4G)

### Uji lintas perangkat
- [ ] Safari iOS, Chrome Android, Chrome/Safari/Firefox desktop
- [ ] Cek safe-area iPhone (bottom nav vs home indicator)
- [ ] Cek 320px (layar tersempit) tidak jebol

**M3 selesai bila**: Lighthouse ≥ 90, keyboard-only bisa selesaikan loop.

---

## M4 — Rilis

- [ ] Isi halaman Tentang: premis, disclaimer, kredit, kontak
- [ ] Review teks legal: tidak ada klaim menyesatkan
- [ ] Pasang domain makanangin.com + HTTPS
- [ ] Cek 404 punya halaman sendiri
- [ ] Uji akhir loop penuh di production
- [ ] Umumkan

---

## M5 — Nanti (jangan sentuh sebelum M4 live)

- [ ] "Pesan Angin" — order acak satu klik
- [ ] Promo kilat berputar 60-90 detik
- [ ] Streak & badge
- [ ] Tray patungan (butuh backend — pertimbangkan ulang)
- [ ] Suara kurir (TTS/rekaman)
- [ ] Blog / artikel kuliner daerah
- [ ] Versi bahasa Inggris
- [ ] Katalog 200+ item
