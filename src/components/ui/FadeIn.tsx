'use client'

import { useEffect, useRef, useState } from 'react'

interface Props {
  children: React.ReactNode
  delay?: number
  className?: string
  /** How far to drift upward from (px). Defaults to 20. */
  drift?: number
}

export default function FadeIn({ children, delay = 0, className = '', drift = 20 }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisible(true)
            observer.disconnect()
          }
        },
        { threshold: 0.08 }
      )
      if (ref.current) observer.observe(ref.current)
      return () => observer.disconnect()
    }, delay)
    return () => clearTimeout(timer)
  }, [delay])

  return (
    <div
      ref={ref}
      className={`transition-[opacity,transform] duration-[800ms] ease-arch ${className}`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : `translateY(${drift}px)`,
      }}
    >
      {children}
    </div>
  )
}
