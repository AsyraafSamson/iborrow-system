import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'

export const metadata: Metadata = {
  title: 'I-Borrow ILKKM',
  description: 'Sistem peminjaman barang ICT ILKKM Johor Bahru',
  icons: { icon: '/icon.svg' },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ms">
      <body className="antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  )
}
