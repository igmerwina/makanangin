import type { Metadata } from "next";
import { Fredoka, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import TopNav from "@/components/TopNav";
import BottomNav from "@/components/BottomNav";
import Footer from "@/components/Footer";
import { CartProvider } from "@/lib/CartProvider";

const fredoka = Fredoka({
  variable: "--font-display",
  subsets: ["latin"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Makan Angin",
  description: "Pesan makanan Indonesia. Makanannya ga bakal dateng. Resepnya iya.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      className={`${fredoka.variable} ${jakarta.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <CartProvider>
          <TopNav />
          <main className="flex-1 pb-16 md:pb-0">{children}</main>
          <Footer />
          <BottomNav />
        </CartProvider>
      </body>
    </html>
  );
}
