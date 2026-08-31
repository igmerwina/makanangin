import assert from "node:assert";
import { tambahKeCart, ubahQty, hapusDariCart, subtotalCart } from "../lib/cart";
import { deltaHarga, hitungTotal } from "../lib/harga";

const nasgor = { slug: "nasi-goreng", nama: "Nasi Goreng", emoji: "🍚", daerah: "Nasional", harga: 20000 };

// harga.ts
assert.strictEqual(deltaHarga("Jumbo (+8k)"), 8000);
assert.strictEqual(deltaHarga("Biasa"), 0);
assert.strictEqual(hitungTotal(20000, ["Jumbo (+8k)", "Telur ceplok"]), 28000);

// item sama, opsi beda -> baris terpisah
let cart = tambahKeCart([], nasgor, ["Biasa"]);
cart = tambahKeCart(cart, nasgor, ["Jumbo (+8k)"]);
assert.strictEqual(cart.length, 2, "opsi beda harus jadi baris terpisah");

// item sama, opsi sama -> qty nambah, bukan baris baru
cart = tambahKeCart(cart, nasgor, ["Biasa"]);
assert.strictEqual(cart.length, 2, "opsi sama harus gabung ke baris yang ada");
assert.strictEqual(cart.find((l) => l.opsiTerpilih.includes("Biasa"))?.qty, 2);

// subtotal
assert.strictEqual(subtotalCart(cart), 20000 * 2 + 28000 * 1);

// ubah qty ke 0 = hapus baris
const idBiasa = cart.find((l) => l.opsiTerpilih.includes("Biasa"))!.id;
cart = ubahQty(cart, idBiasa, 0);
assert.strictEqual(cart.length, 1);

// hapus eksplisit
const idJumbo = cart[0].id;
cart = hapusDariCart(cart, idJumbo);
assert.strictEqual(cart.length, 0);

console.log("OK: cart.ts lolos semua assert.");
