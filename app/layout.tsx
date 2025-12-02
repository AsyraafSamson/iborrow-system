import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'I-Borrow ILKKM',
  description: 'Sistem peminjaman barang ICT ILKKM Johor Bahru',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ms">
      <body className="antialiased">{children}</body>
    </html>
  )
}
