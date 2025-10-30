// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ✅ UPDATED METADATA - iBORROW SYSTEM
export const metadata: Metadata = {
  title: "I-Borrow ILKKM",
  description: "Sistem peminjaman barang ICT ILKKM Johor Bahru",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // ✅ UBAH BAHASA KE "ms" (Malaysia)
    <html lang="ms">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}