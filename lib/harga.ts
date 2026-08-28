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
