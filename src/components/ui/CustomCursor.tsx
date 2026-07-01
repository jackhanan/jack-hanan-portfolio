'use client'

import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const dot = dotRef.current
    if (!dot) return

    let x = -100, y = -100
    let raf: number

    function move(e: MouseEvent) {
      x = e.clientX
      y = e.clientY
    }
    function hide() {
      x = -100; y = -100
    }

    function tick() {
      if (dot) dot.style.transform = `translate(${x}px, ${y}px)`
      raf = requestAnimationFrame(tick)
    }

    document.addEventListener('mousemove', move)
    document.addEventListener('mouseleave', hide)
    raf = requestAnimationFrame(tick)

    return () => {
      document.removeEventListener('mousemove', move)
      document.removeEventListener('mouseleave', hide)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: 8,
        height: 8,
        borderRadius: '50%',
        backgroundColor: '#1C1C1A',
        pointerEvents: 'none',
        zIndex: 99999,
        transform: 'translate(-100px, -100px)',
        marginLeft: -4,
        marginTop: -4,
        transition: 'transform 80ms linear',
        // Only shown on devices with a fine pointer (mouse)
      }}
    />
  )
}
