'use client'

import { useState } from 'react'
import Lightbox from '@/components/ui/Lightbox'

interface Props {
  drawings: string[]
  projectTitle: string
}

export default function ProjectDrawings({ drawings, projectTitle }: Props) {
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null)

  if (!drawings.length) return null

  return (
    <>
      <div className="space-y-16">
        {drawings.map((src, i) => (
          <figure
            key={src + i}
            className="w-full cursor-zoom-in"
            onClick={() => setLightbox({ src, alt: `${projectTitle} — drawing ${i + 1}` })}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={`${projectTitle} — drawing ${i + 1}`}
              className="w-full h-auto block"
              loading="eager"
            />
          </figure>
        ))}
      </div>

      {lightbox && (
        <Lightbox src={lightbox.src} alt={lightbox.alt} onClose={() => setLightbox(null)} />
      )}
    </>
  )
}
