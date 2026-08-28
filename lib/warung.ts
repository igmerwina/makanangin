import warungList from "@/data/warung.json";
import type { Item } from "./types";

export interface Warung {
  nama: string;
  pulau: string;
  tagline: string;
}

const warung = warungList as Warung[];

export function warungUntuk(item: Item): Warung {
  return warung.find((w) => w.pulau === item.pulau) ?? warung[0];
}
