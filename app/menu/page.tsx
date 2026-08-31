import { indexItems } from "@/lib/items";
import MenuBrowser from "./MenuBrowser";

export const metadata = { title: "Menu — Makan Angin" };

export default function MenuPage() {
  const items = indexItems();
  const jumlahPulau = new Set(items.map((i) => i.pulau)).size;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 lg:py-10">
      <p className="text-xs font-semibold tracking-[0.2em] uppercase text-sambal mb-2">Katalog Nusantara</p>
      <h1 className="font-display text-3xl md:text-4xl mb-1">Menu</h1>
      <p className="text-muted mb-6">
        {items.length} hidangan dari {jumlahPulau} pulau — pilih, pesan, relakan.
      </p>
      <MenuBrowser items={items} />
    </div>
  );
}
