import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/providers/SessionProvider";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import CartDrawer from "@/components/ui/CartDrawer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BigAss SHOP - Premium Flagship Gear & Tech",
  description:
    "Explore the pinnacle of minimalist hardware, high-performance tech, and stories at BigAss SHOP.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-black text-[#f5f5f7]">
        <SessionProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <CartDrawer />
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
