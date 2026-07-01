'use client'

import { useState } from 'react'
import Lightbox from '@/components/ui/Lightbox'

interface Props {
  drawings: string[]
  projectTitle: string
}

export default function ProjectDrawings({ drawings, projectTitle }: Props) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  if (!drawings.length) return null

  return (
    <>
      <div className="space-y-16">
        {drawings.map((src, i) => (
          <figure
            key={src + i}
            className="w-full cursor-default"
            onClick={() => setLightboxIndex(i)}
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

      {lightboxIndex !== null && (
        <Lightbox
          images={drawings}
          index={lightboxIndex}
          alt={(i) => `${projectTitle} — drawing ${i + 1}`}
          onClose={() => setLightboxIndex(null)}
          onNav={setLightboxIndex}
        />
      )}
    </>
  )
}
