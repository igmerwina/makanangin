"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { readStorage, writeStorage } from "./storage";
import { tambahKeCart, ubahQty, hapusDariCart, subtotalCart, type CartLine } from "./cart";

const CART_KEY = "makanangin:keranjang:v1";

interface CartContextValue {
  cart: CartLine[];
  tambah: (item: { slug: string; nama: string; emoji: string; harga: number }, opsi: string[], qty?: number) => void;
  ubah: (id: string, qty: number) => void;
  hapus: (id: string) => void;
  kosongkan: () => void;
  subtotal: number;
  jumlahItem: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setCart(readStorage(CART_KEY, []));
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) writeStorage(CART_KEY, cart);
  }, [cart, loaded]);

  const value: CartContextValue = {
    cart,
    tambah: (item, opsi, qty = 1) => setCart((c) => tambahKeCart(c, item, opsi, qty)),
    ubah: (id, qty) => setCart((c) => ubahQty(c, id, qty)),
    hapus: (id) => setCart((c) => hapusDariCart(c, id)),
    kosongkan: () => setCart([]),
    subtotal: subtotalCart(cart),
    jumlahItem: cart.reduce((n, l) => n + l.qty, 0),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart harus dipakai di dalam <CartProvider>");
  return ctx;
}
