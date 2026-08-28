import type { CartLine } from "./cart";

export interface Order {
  id: string;
  cart: CartLine[];
  subtotal: number;
  waktu: string; // ISO, distempel saat checkout (Date.now() dilarang di server component, aman di client)
}

const RIWAYAT_KEY = "makanangin:riwayat:v1";
const ORDER_AKTIF_KEY = "makanangin:order-aktif:v1";

export { RIWAYAT_KEY, ORDER_AKTIF_KEY };
