'use client'

import { useEffect, useCallback } from 'react'

interface Props {
  src: string
  alt: string
  onClose: () => void
}

export default function Lightbox({ src, alt, onClose }: Props) {
  const handleKey = useCallback(
    (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() },
    [onClose]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [handleKey])

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 p-4 md:p-8"
      onClick={onClose}
    >
      {/* X button */}
      <button
        onClick={onClose}
        aria-label="Close lightbox"
        className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors duration-150 cursor-pointer"
      >
        <svg className="w-7 h-7" viewBox="0 0 28 28" fill="none" aria-hidden="true">
          <path d="M6 6l16 16M22 6L6 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      {/* Image — stop propagation so clicking the image itself doesn't close */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        onClick={(e) => e.stopPropagation()}
        className="max-w-full max-h-full w-auto h-auto object-contain"
        style={{ maxHeight: 'calc(100vh - 4rem)' }}
      />
    </div>
  )
}
