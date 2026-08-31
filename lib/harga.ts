/** Pilihan opsi kadang punya embel-embel harga: "Jumbo (+10k)". Ini ekstrak angkanya. */
export function deltaHarga(pilihan: string): number {
  const m = pilihan.match(/\(\+(\d+)k\)/);
  return m ? Number(m[1]) * 1000 : 0;
}

export function hitungTotal(hargaDasar: number, terpilih: string[]): number {
  return terpilih.reduce((total, p) => total + deltaHarga(p), hargaDasar);
}

export function formatRupiah(n: number): string {
  return `Rp${n.toLocaleString("id-ID")}`;
}

const UNIT_PER_KATEGORI: Record<string, string> = {
  makanan: "per porsi",
  minuman: "per gelas",
  jajanan: "per porsi",
  kudapan: "per porsi",
};

/** Satuan harga berdasarkan kategori — bukan per-item, cuma konvensi kasar biar harga ga polos. */
export function unitLabel(kategori: string): string {
  return UNIT_PER_KATEGORI[kategori] ?? "per porsi";
}
