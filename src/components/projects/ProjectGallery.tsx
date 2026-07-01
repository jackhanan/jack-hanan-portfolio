'use client'

import { useState } from 'react'
import Image from 'next/image'
import Lightbox from '@/components/ui/Lightbox'

interface Props {
  images: string[]
  projectTitle: string
}

export default function ProjectGallery({ images, projectTitle }: Props) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  if (!images.length) return null

  return (
    <>
      <section className="mt-16">
        <div className="columns-1 sm:columns-2 lg:columns-2 gap-4 space-y-4">
          {images.map((src, i) => (
            <div
              key={i}
              className="break-inside-avoid relative overflow-hidden bg-charcoal/5 cursor-default"
              onClick={() => setLightboxIndex(i)}
            >
              <Image
                src={src}
                alt={`${projectTitle} — image ${i + 1}`}
                width={1200}
                height={900}
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </section>

      {lightboxIndex !== null && (
        <Lightbox
          images={images}
          index={lightboxIndex}
          alt={(i) => `${projectTitle} — image ${i + 1}`}
          onClose={() => setLightboxIndex(null)}
          onNav={setLightboxIndex}
        />
      )}
    </>
  )
}
