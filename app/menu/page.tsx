import { allItems } from "@/lib/items";
import MenuBrowser from "./MenuBrowser";

export default function MenuPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="font-display text-2xl md:text-3xl mb-4">Menu</h1>
      <MenuBrowser items={allItems()} />
    </div>
  );
}
