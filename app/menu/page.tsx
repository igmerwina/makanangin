import { allItems } from "@/lib/items";
import ItemCard from "@/components/ItemCard";

export default function MenuPage() {
  const items = allItems();

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="font-display text-2xl md:text-3xl mb-4">Menu</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item) => (
          <ItemCard key={item.slug} item={item} />
        ))}
      </div>
    </div>
  );
}
