export const metadata = { title: "Tentang — Makan Angin" };

export default function TentangPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10 lg:py-16">
      <p className="text-xs font-semibold tracking-[0.2em] uppercase text-sambal mb-2">Tentang</p>
      <h1 className="font-display text-3xl sm:text-4xl text-tinta mb-6">Makan Angin</h1>

      <div className="space-y-5 text-base leading-relaxed text-foreground/80">
        <p>
          Makan Angin situs parodi. Kamu pesan makanan Indonesia, bayar pakai kartu demo, kurir
          jalan — terus dia telepon bilang makanannya ga bakal dateng.
        </p>
        <p>
          Ga ada makanan asli. Ga ada pembayaran asli. Ga ada akun. Ga ada data kartu yang
          diminta atau disimpan, di mana pun — semua data checkout cuma tampilan, ga pernah
          diproses atau dikirim ke mana pun. Yang kamu dapet beneran cuma resep dan cerita asal
          daerahnya, buat 80 hidangan dari 34 provinsi.
        </p>

        <div className="rounded-2xl bg-krem p-5">
          <h2 className="font-display text-lg text-tinta mb-2">Yang beneran jalan</h2>
          <ul className="space-y-1.5 text-sm">
            <li>✓ Katalog 80 hidangan asli Indonesia, lengkap dengan resep</li>
            <li>✓ Keranjang, filter, pencarian — semuanya nyata</li>
            <li>✓ Riwayat pesanan disimpan di HP kamu sendiri (localStorage), ga di server kami</li>
          </ul>
        </div>

        <div className="rounded-2xl bg-krem p-5">
          <h2 className="font-display text-lg text-tinta mb-2">Yang ga jalan (sengaja)</h2>
          <ul className="space-y-1.5 text-sm">
            <li>✕ Ga ada pembayaran — form kartu di checkout <em>disabled</em>, ga bisa diisi data asli</li>
            <li>✕ Ga ada pengiriman — kurir cuma animasi, makanannya emang ga pernah dateng</li>
            <li>✕ Ga ada akun/login — ga ada yang perlu didaftarin</li>
          </ul>
        </div>

        <p>
          Kenapa dibikin? Karena craving kadang cuma butuh dilihat, dibayangin, terus dilupain —
          atau, kalau niat, beneran dimasak sendiri. Semua resep di situs ini ditulis ulang, bukan
          disalin dari situs lain.
        </p>
      </div>
    </div>
  );
}
