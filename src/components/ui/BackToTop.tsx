'use client'

import { useEffect, useRef, useState } from 'react'

const DEFAULT_BOTTOM = 24

export default function BackToTop() {
  const [visible, setVisible] = useState(false)
  const [bottom, setBottom] = useState(DEFAULT_BOTTOM)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    function update() {
      setVisible(window.scrollY > 400)

      const footer = document.querySelector('footer')
      if (!footer) return

      const footerRect = footer.getBoundingClientRect()
      const viewportH = window.innerHeight

      if (footerRect.top < viewportH) {
        // Footer is partially in view — push button above it with 16px gap
        const overlap = viewportH - footerRect.top
        setBottom(DEFAULT_BOTTOM + overlap + 16)
      } else {
        setBottom(DEFAULT_BOTTOM)
      }
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update, { passive: true })
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  return (
    <button
      ref={buttonRef}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
      style={{
        position: 'fixed',
        bottom,
        right: '2rem',
        zIndex: 9000,
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '0.5rem',
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
        transition: 'opacity 300ms ease, bottom 150ms ease',
        color: '#6B6B66',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '2px',
        lineHeight: 1,
      }}
    >
      <svg width="20" height="14" viewBox="0 0 20 14" fill="none" aria-hidden="true">
        <path d="M4 10l6-6 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '9px', letterSpacing: '0.12em', fontWeight: 400 }}>
        TOP
      </span>
    </button>
  )
}
