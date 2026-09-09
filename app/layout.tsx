import type { Metadata } from "next";
import { Bricolage_Grotesque, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import TopNav from "@/components/TopNav";
import BottomNav from "@/components/BottomNav";
import Footer from "@/components/Footer";
import { CartProvider } from "@/lib/CartProvider";
import MotionSetup from "@/components/MotionSetup";

const display = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
  axes: ["opsz"],
});

// Plus Jakarta Sans is drawn in Jakarta for Jakarta, which is about as
// on-brief as a body face gets for this site.
const jakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://makanangin.com"),
  title: {
    default: "Makan Angin",
    template: "%s · Makan Angin",
  },
  description: "Pesan makanan Indonesia. Makanannya ga bakal dateng. Resepnya iya.",
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "Makan Angin",
    title: "Makan Angin",
    description: "Pesan makanan Indonesia. Makanannya ga bakal dateng. Resepnya iya.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Makan Angin",
    description: "Pesan makanan Indonesia. Makanannya ga bakal dateng. Resepnya iya.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      data-theme="light"
      suppressHydrationWarning
      className={`${display.variable} ${jakarta.variable} h-full antialiased`}
    >
      <head>
        {/* Applies the remembered theme before first paint, otherwise a dark
            reader gets a white flash on every navigation. Light stays the
            default when nothing is stored. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(localStorage.getItem('makanangin:tema')==='dark'){document.documentElement.dataset.theme='dark'}}catch(e){}",
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <MotionSetup />
        <a
          href="#konten"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-on-accent"
        >
          Langsung ke konten
        </a>
        <CartProvider>
          <TopNav />
          <main
            id="konten"
            className="flex-1 pb-[calc(4.5rem+env(safe-area-inset-bottom))] md:pb-0"
          >
            {children}
          </main>
          <Footer />
          <BottomNav />
        </CartProvider>
      </body>
    </html>
  );
}
