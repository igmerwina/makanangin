"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Item } from "@/lib/types";
import { useCart } from "@/lib/CartProvider";
import { hitungTotal, formatRupiah } from "@/lib/harga";

export default function OpsiPicker({ item }: { item: Item }) {
  const router = useRouter();
  const { tambah } = useCart();
  const [dipilih, setDipilih] = useState<Record<string, string[]>>(() =>
    Object.fromEntries(item.opsi.map((o) => [o.nama, o.multi ? [] : [o.pilihan[0]]]))
  );
  const [ditambahkan, setDitambahkan] = useState(false);

  const semuaTerpilih = Object.values(dipilih).flat();
  const total = hitungTotal(item.harga, semuaTerpilih);

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
    setTimeout(() => setDitambahkan(false), 1500);
  }

  return (
    <div>
      {item.opsi.map((opsi) => (
        <fieldset key={opsi.nama} className="mb-5">
          <legend className="font-medium mb-2">{opsi.nama}</legend>
          <div className="flex flex-wrap gap-2">
            {opsi.pilihan.map((p) => {
              const aktif = (dipilih[opsi.nama] ?? []).includes(p);
              return (
                <button
                  key={p}
                  type="button"
                  aria-pressed={aktif}
                  onClick={() => (opsi.multi ? toggleMulti(opsi.nama, p) : pilihTunggal(opsi.nama, p))}
                  className={`px-4 py-2 min-h-11 rounded-full border text-sm ${
                    aktif ? "bg-sambal text-white border-sambal" : "border-border bg-card"
                  }`}
                >
                  {p}
                </button>
              );
            })}
          </div>
        </fieldset>
      ))}

      <div className="sticky bottom-16 md:bottom-0 md:static bg-background md:bg-transparent border-t md:border-0 border-border pt-3 md:pt-0 -mx-4 px-4 md:mx-0 md:px-0">
        <button
          type="button"
          onClick={tambahKeKeranjang}
          className="w-full md:w-auto px-6 py-3 min-h-11 rounded-full bg-sambal text-white font-medium"
        >
          {ditambahkan ? "Masuk keranjang ✓" : `Tambah ke keranjang · ${formatRupiah(total)}`}
        </button>
        {ditambahkan && (
          <button
            type="button"
            onClick={() => router.push("/keranjang")}
            className="ml-0 mt-2 md:mt-0 md:ml-3 text-sm underline block md:inline"
          >
            Lihat keranjang
          </button>
        )}
      </div>
    </div>
  );
}
