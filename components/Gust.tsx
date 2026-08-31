/** Gust mark — garis hembusan angin gaya komik. Motif tanda-tangan situs: dipakai di hero,
 *  kurir, dan layar konsolasi. Warna ikut `currentColor` biar bisa di-tint via text-*. */
export default function Gust({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 32" fill="none" aria-hidden className={className}>
      <path
        d="M2 8 H38 a6 6 0 1 0 -6 -6"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path d="M10 16 H54" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path
        d="M4 24 H44 a5 5 0 1 1 -5 5"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
