'use client'

import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const dot = dotRef.current
    if (!dot) return

    let entered = false

    function move(e: MouseEvent) {
      // First move after re-entry: snap position with no opacity transition,
      // then immediately reveal. Achieved by disabling transition on position
      // entirely — only opacity ever transitions.
      dot!.style.left = e.clientX - 4 + 'px'
      dot!.style.top  = e.clientY - 4 + 'px'
      if (!entered) {
        entered = true
        dot!.style.opacity = '1'
      }
    }

    function leave() {
      entered = false
      dot!.style.opacity = '0'
    }

    document.addEventListener('mousemove', move)
    document.addEventListener('mouseleave', leave)

    return () => {
      document.removeEventListener('mousemove', move)
      document.removeEventListener('mouseleave', leave)
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
        backgroundColor: '#fff',
        mixBlendMode: 'difference',
        pointerEvents: 'none',
        zIndex: 99999,
        opacity: 0,
        // Only opacity transitions — position is always instant
        transition: 'opacity 150ms ease',
      }}
    />
  )
}
