'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Fade in on mount / route change
    const t = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(t)
  }, [pathname])

  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transition: 'opacity 400ms ease',
      }}
    >
      {children}
    </div>
  )
}
