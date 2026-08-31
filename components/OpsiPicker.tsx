"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { animated, useSpring } from "@react-spring/web";
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
      className={`px-5 py-3 min-h-12 rounded-full border text-sm font-medium transition-colors duration-150 ${
        aktif
          ? "bg-sambal text-white border-sambal"
          : "border-border bg-krem text-tinta hover:border-sambal/40"
      }`}
    >
      {children}
    </animated.button>
  );
}

function HargaAnimasi({ value }: { value: number }) {
  const { n } = useSpring({ n: value, config: { tension: 200, friction: 24 } });
  return <animated.span>{n.to((v) => formatRupiah(Math.round(v)))}</animated.span>;
}

export default function OpsiPicker({ item }: { item: Item }) {
  const router = useRouter();
  const { tambah } = useCart();
  const [dipilih, setDipilih] = useState<Record<string, string[]>>(() =>
    Object.fromEntries(item.opsi.map((o) => [o.nama, o.multi ? [] : [o.pilihan[0]]]))
  );
  const [ditambahkan, setDitambahkan] = useState(false);

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
    ctaApi.start({
      to: [{ scale: 1.06 }, { scale: 1 }],
      config: { tension: 500, friction: 12 },
    });
    setTimeout(() => setDitambahkan(false), 1500);
  }

  return (
    <div>
      {item.opsi.map((opsi) => (
        <fieldset key={opsi.nama} className="mb-5">
          <legend className="text-xs font-semibold uppercase tracking-wider text-tinta/60 mb-2.5">
            {opsi.nama}
          </legend>
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

      <div className="sticky bottom-[calc(4rem+env(safe-area-inset-bottom))] md:bottom-0 md:static bg-background md:bg-transparent border-t md:border-0 border-border pt-3 md:pt-1 -mx-4 px-4 md:mx-0 md:px-0">
        <animated.button
          type="button"
          onClick={tambahKeKeranjang}
          style={{ scale: ctaStyle.scale, y: ctaStyle.y }}
          onMouseEnter={() => ctaApi.start({ y: -3 })}
          onMouseLeave={() => ctaApi.start({ y: 0 })}
          className="w-full flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 px-6 py-4 min-h-14 rounded-full bg-sambal text-white text-sm sm:text-base lg:text-lg font-semibold shadow-md hover:shadow-lg transition-shadow duration-200 text-center"
        >
          {ditambahkan ? (
            "Masuk keranjang ✓"
          ) : (
            <>
              <span className="inline-flex items-center gap-1.5">
                <span aria-hidden>🛒</span>
                Tambah ke Keranjang
              </span>
              <span className="opacity-90">
                · <HargaAnimasi value={total} />
              </span>
            </>
          )}
        </animated.button>
        {ditambahkan && (
          <button
            type="button"
            onClick={() => router.push("/keranjang")}
            className="w-full mt-2 text-sm text-center underline text-muted"
          >
            Lihat keranjang
          </button>
        )}
      </div>
    </div>
  );
}
