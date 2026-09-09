"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { animated, useSpring } from "@react-spring/web";
import { Check } from "@phosphor-icons/react";
import type { Item } from "@/lib/types";
import { useCart } from "@/lib/CartProvider";
import { hitungTotal, formatRupiah } from "@/lib/harga";

function ChipButton({
  aktif,
  onClick,
  children,
}: {
  aktif: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  const [style, api] = useSpring(() => ({ scale: 1, config: { tension: 500, friction: 24 } }));
  return (
    <animated.button
      type="button"
      aria-pressed={aktif}
      onClick={onClick}
      onPointerDown={() => api.start({ scale: 0.94 })}
      onPointerUp={() => api.start({ scale: 1 })}
      onPointerLeave={() => api.start({ scale: 1 })}
      style={style}
      className={`min-h-12 rounded-full border px-5 py-3 text-sm font-medium transition-colors duration-150 ${
        aktif
          ? "border-accent bg-accent text-on-accent"
          : "border-line text-ink hover:border-accent/50 hover:bg-surface"
      }`}
    >
      {children}
    </animated.button>
  );
}

function HargaAnimasi({ value }: { value: number }) {
  const { n } = useSpring({ n: value, config: { tension: 200, friction: 24 } });
  return <animated.span className="tnum">{n.to((v) => formatRupiah(Math.round(v)))}</animated.span>;
}

export default function OpsiPicker({ item }: { item: Item }) {
  const router = useRouter();
  const { tambah } = useCart();
  const [dipilih, setDipilih] = useState<Record<string, string[]>>(() =>
    Object.fromEntries(item.opsi.map((o) => [o.nama, o.multi ? [] : [o.pilihan[0]]]))
  );
  const [ditambahkan, setDitambahkan] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const semuaTerpilih = Object.values(dipilih).flat();
  const total = hitungTotal(item.harga, semuaTerpilih);

  const [ctaStyle, ctaApi] = useSpring(() => ({ scale: 1, y: 0, config: { tension: 400, friction: 20 } }));

  function pilihTunggal(namaOpsi: string, pilihan: string) {
    setDipilih((d) => ({ ...d, [namaOpsi]: [pilihan] }));
  }

  function toggleMulti(namaOpsi: string, pilihan: string) {
    setDipilih((d) => {
      const current = d[namaOpsi] ?? [];
      const next = current.includes(pilihan) ? current.filter((p) => p !== pilihan) : [...current, pilihan];
      return { ...d, [namaOpsi]: next };
    });
  }

  function tambahKeKeranjang() {
    tambah(item, semuaTerpilih);
    setDitambahkan(true);
    ctaApi.start({ to: [{ scale: 1.04 }, { scale: 1 }], config: { tension: 500, friction: 12 } });
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setDitambahkan(false), 1800);
  }

  return (
    <div>
      {item.opsi.map((opsi) => (
        <fieldset key={opsi.nama} className="mb-6">
          <legend className="mb-2.5 text-sm font-semibold text-ink">{opsi.nama}</legend>
          <div className="flex flex-wrap gap-2.5">
            {opsi.pilihan.map((p) => {
              const aktif = (dipilih[opsi.nama] ?? []).includes(p);
              return (
                <ChipButton
                  key={p}
                  aktif={aktif}
                  onClick={() => (opsi.multi ? toggleMulti(opsi.nama, p) : pilihTunggal(opsi.nama, p))}
                >
                  {p}
                </ChipButton>
              );
            })}
          </div>
        </fieldset>
      ))}

      <div className="sticky bottom-[calc(4.5rem+env(safe-area-inset-bottom))] -mx-4 border-t border-line bg-bg px-4 pb-3 pt-3 md:static md:mx-0 md:border-0 md:bg-transparent md:px-0 md:pb-0">
        <animated.button
          type="button"
          onClick={tambahKeKeranjang}
          style={{ scale: ctaStyle.scale, y: ctaStyle.y }}
          onMouseEnter={() => ctaApi.start({ y: -2 })}
          onMouseLeave={() => ctaApi.start({ y: 0 })}
          className="flex min-h-14 w-full items-center justify-center gap-3 whitespace-nowrap rounded-full bg-accent px-6 py-4 text-base font-semibold text-on-accent sm:text-lg"
        >
          {ditambahkan ? (
            <>
              <Check size={20} weight="bold" aria-hidden />
              Masuk keranjang
            </>
          ) : (
            <>
              <span>Tambah ke keranjang</span>
              <span className="opacity-75" aria-hidden>
                /
              </span>
              <HargaAnimasi value={total} />
            </>
          )}
        </animated.button>
        <p aria-live="polite" className="sr-only">
          {ditambahkan ? `${item.nama} masuk keranjang` : ""}
        </p>
        {ditambahkan && (
          <button
            type="button"
            onClick={() => router.push("/keranjang")}
            className="mt-2 w-full py-2 text-center text-sm font-medium text-ink-2 underline underline-offset-2 hover:text-accent"
          >
            Lihat keranjang
          </button>
        )}
      </div>
    </div>
  );
}
