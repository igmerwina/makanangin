import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <h1 className="font-display text-4xl md:text-5xl text-sambal mb-4">Makan Angin</h1>
      <p className="text-lg mb-8">
        Pesan makanan Indonesia. Bayar demo. Kurir jalan. Makanannya ga bakal dateng — resepnya
        iya.
      </p>
      <Link
        href="/menu"
        className="inline-block px-6 py-3 rounded-full bg-sambal text-white font-medium"
      >
        Mulai pesan
      </Link>
    </div>
  );
}
