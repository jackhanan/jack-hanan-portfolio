import type { Metadata } from 'next'
import './globals.css'
import Nav from '@/components/layout/Nav'
import Footer from '@/components/layout/Footer'
import PageTransition from '@/components/ui/PageTransition'
import CustomCursor from '@/components/ui/CustomCursor'
import BackToTop from '@/components/ui/BackToTop'

export const metadata: Metadata = {
  title: {
    default: 'Jack Hanan — Portfolio',
    template: '%s — Jack Hanan',
  },
  description: 'Architecture student and designer. Portfolio of academic, research, and professional work.',
  openGraph: {
    title: 'Jack Hanan — Portfolio',
    description: 'Architecture student and designer. Portfolio of academic, research, and professional work.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jack Hanan — Portfolio',
    description: 'Architecture student and designer. Portfolio of academic, research, and professional work.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <CustomCursor />
        <Nav />
        <PageTransition>
          <main>{children}</main>
        </PageTransition>
        <Footer />
        <BackToTop />
      </body>
    </html>
  )
}
