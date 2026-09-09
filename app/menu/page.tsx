import { indexItems } from "@/lib/items";
import MenuBrowser from "./MenuBrowser";

export const metadata = { title: "Menu" };

export default function MenuPage() {
  const items = indexItems();
  const jumlahPulau = new Set(items.map((i) => i.pulau)).size;

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
      <h1 className="font-display text-4xl font-semibold sm:text-5xl">Menu</h1>
      <p className="mt-2 max-w-[52ch] text-ink-2">
        {items.length} hidangan dari {jumlahPulau} pulau. Pilih, pesan, relakan.
      </p>
      <MenuBrowser items={items} />
    </div>
  );
}
