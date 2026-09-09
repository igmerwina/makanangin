import Link from "next/link";
import Gust from "@/components/Gust";

export const metadata = { title: "Halaman ga ketemu" };

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <Gust className="mx-auto mb-6 w-20 text-kunyit" />
      <p className="tnum font-display text-5xl font-semibold text-accent">404</p>
      <h1 className="mt-3 font-display text-3xl font-semibold">Halaman ini kebawa angin</h1>
      <p className="mx-auto mt-3 max-w-[36ch] text-ink-2">
        Alamatnya ga ada di sini. Mungkin salah ketik, mungkin memang ga pernah ada.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/menu"
          className="min-h-12 rounded-full bg-accent px-7 py-3.5 font-semibold text-on-accent transition-transform duration-150 hover:-translate-y-px active:translate-y-0"
        >
          Mulai pesan
        </Link>
        <Link
          href="/"
          className="min-h-12 rounded-full border border-line px-6 py-3.5 font-medium text-ink transition-colors hover:bg-surface"
        >
          Ke beranda
        </Link>
      </div>
    </div>
  );
}
