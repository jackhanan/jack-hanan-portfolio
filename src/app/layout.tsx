import type { Metadata } from 'next'
import './globals.css'
import Nav from '@/components/layout/Nav'
import Footer from '@/components/layout/Footer'
import PageTransition from '@/components/ui/PageTransition'

export const metadata: Metadata = {
  title: {
    default: 'Jack Hanan — Architecture',
    template: '%s — Jack Hanan',
  },
  description: 'Architecture student and designer. Portfolio of academic, research, and professional work.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <Nav />
        <PageTransition>
          <main>{children}</main>
        </PageTransition>
        <Footer />
      </body>
    </html>
  )
}
