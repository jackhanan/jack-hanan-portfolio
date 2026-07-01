'use client'

import { useEffect, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'

interface Props {
  images: string[]
  index: number
  alt: (i: number) => string
  onClose: () => void
  onNav: (i: number) => void
}

export default function Lightbox({ images, index, alt, onClose, onNav }: Props) {
  const total = images.length
  const touchStartX = useRef<number | null>(null)

  const prev = useCallback(() => onNav((index - 1 + total) % total), [index, total, onNav])
  const next = useCallback(() => onNav((index + 1) % total), [index, total, onNav])

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    },
    [onClose, prev, next]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [handleKey])

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX
  }
  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(dx) > 40) dx < 0 ? next() : prev()
    touchStartX.current = null
  }

  const btnStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    color: 'rgba(255,255,255,0.75)',
    cursor: 'pointer',
    padding: '1rem',
    lineHeight: 0,
  }

  return createPortal(
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.9)',
      }}
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Counter */}
      <div style={{ position: 'absolute', top: '1rem', left: '1.25rem', color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem', letterSpacing: '0.08em', fontFamily: 'sans-serif' }}>
        {index + 1} / {total}
      </div>

      {/* Close */}
      <button
        onClick={onClose}
        aria-label="Close lightbox"
        style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', lineHeight: 0 }}
      >
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
          <path d="M6 6l16 16M22 6L6 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      {/* Prev chevron */}
      {total > 1 && (
        <button onClick={(e) => { e.stopPropagation(); prev() }} aria-label="Previous image" style={{ ...btnStyle, left: 0 }}>
          <svg width="24" height="40" viewBox="0 0 24 40" fill="none" aria-hidden="true">
            <path d="M18 4L4 20l14 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}

      {/* Image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={images[index]}
        alt={alt(index)}
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '90vw', maxHeight: '90vh', width: 'auto', height: 'auto', objectFit: 'contain', display: 'block' }}
      />

      {/* Next chevron */}
      {total > 1 && (
        <button onClick={(e) => { e.stopPropagation(); next() }} aria-label="Next image" style={{ ...btnStyle, right: 0 }}>
          <svg width="24" height="40" viewBox="0 0 24 40" fill="none" aria-hidden="true">
            <path d="M6 4l14 16-14 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}
    </div>,
    document.body
  )
}
