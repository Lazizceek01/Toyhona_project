import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-display" });

export const metadata: Metadata = {
  title: "Royal Palace",
  description: "Royal Palace to'yxona — premium zallar, bron va boshqaruv"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz">
      <body className={`${inter.variable} ${playfair.variable} font-body bg-[#f4efe7] text-stone-900 antialiased`}>
        <div className="min-h-screen bg-[linear-gradient(180deg,#f8f4ed_0%,#f4efe7_42%,#f5f1eb_100%)]">
          <header className="sticky top-0 z-50 border-b border-stone-200/80 bg-white/90 backdrop-blur-xl">
            <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
              <Link href="/" className="font-display text-xl tracking-[0.24em] text-stone-900">
                ROYAL PALACE
              </Link>
              <div className="hidden items-center gap-2 text-sm font-medium text-stone-700 md:flex">
                <Link href="/" className="rounded-full px-4 py-2 transition hover:bg-stone-100">
                  Asosiy
                </Link>
                <Link href="/halls" className="rounded-full px-4 py-2 transition hover:bg-stone-100">
                  Zallar
                </Link>
                <Link href="/booking" className="rounded-full px-4 py-2 transition hover:bg-stone-100">
                  Bron
                </Link>
                <Link href="/#contact" className="rounded-full px-4 py-2 transition hover:bg-stone-100">
                  Aloqa
                </Link>
              </div>
              <Link href="/booking" className="rounded-full bg-stone-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-stone-800">
                Bron qilish
              </Link>
            </nav>
          </header>

          <main>{children}</main>

          <footer className="bg-stone-900 text-stone-200">
            <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
              <div>
                <p className="font-display text-3xl tracking-[0.18em] text-amber-200">ROYAL PALACE</p>
                <p className="mt-4 max-w-md text-sm leading-7 text-stone-400">
                  To&apos;y marosimlari, banketlar va premium tadbirlar uchun zamonaviy boshqaruv va nafis interyer tajribasi.
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-amber-200">Sahifalar</p>
                <ul className="mt-4 space-y-2 text-sm text-stone-400">
                  <li><Link href="/" className="transition hover:text-white">Asosiy</Link></li>
                  <li><Link href="/halls" className="transition hover:text-white">Zallar</Link></li>
                  <li><Link href="/booking" className="transition hover:text-white">Bron qilish</Link></li>
                </ul>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-amber-200">Aloqa</p>
                <ul className="mt-4 space-y-2 text-sm text-stone-400">
                  <li>Toshkent, O&apos;zbekiston</li>
                  <li>+998 90 000 00 00</li>
                  <li>hello@royalpalace.uz</li>
                </ul>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
