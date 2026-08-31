export type Kategori = "makanan" | "minuman" | "jajanan" | "kudapan";
export type Tipe = "umum" | "tradisional";

export interface Opsi {
  nama: string;
  pilihan: string[];
  multi?: boolean;
}

export interface Resep {
  porsi: number;
  waktu: string;
  sulit: "mudah" | "sedang" | "sulit";
  bahan: string[];
  langkah: string[];
  tips?: string;
}

export interface Item {
  slug: string;
  nama: string;
  kategori: Kategori;
  tipe: Tipe;
  daerah: string;
  pulau: string;
  harga: number;
  emoji: string;
  deskripsi: string;
  cerita: string;
  pedas: 0 | 1 | 2 | 3 | 4 | 5;
  halal: boolean;
  tags: string[];
  opsi: Opsi[];
  resep: Resep;
}

/**
 * Subset buat kartu katalog (ItemCard, MenuBrowser, daftar per-pulau, populer di beranda).
 * Sengaja ga bawa resep/cerita/deskripsi/opsi — komponennya "use client", jadi apa pun
 * yang ikut di sini kekirim ke browser di RSC payload walau ga pernah dirender.
 */
export type ItemIndex = Pick<
  Item,
  "slug" | "nama" | "emoji" | "daerah" | "pulau" | "harga" | "pedas" | "kategori" | "halal" | "tags"
>;
