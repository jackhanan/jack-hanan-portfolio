'use client'

import { useEffect, useState } from 'react'

export default function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    function onScroll() { setVisible(window.scrollY > 400) }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
      style={{
        position: 'fixed',
        bottom: '6rem',
        right: '2rem',
        zIndex: 9000,
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '0.5rem',
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
        transition: 'opacity 300ms ease',
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
