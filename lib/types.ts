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
