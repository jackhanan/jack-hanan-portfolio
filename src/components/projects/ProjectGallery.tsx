import Image from 'next/image'

interface Props {
  images: string[]
  projectTitle: string
}

export default function ProjectGallery({ images, projectTitle }: Props) {
  if (!images.length) return null

  return (
    <section className="mt-16">
      <div className="columns-1 sm:columns-2 lg:columns-2 gap-4 space-y-4">
        {images.map((src, i) => (
          <div key={i} className="break-inside-avoid relative overflow-hidden bg-charcoal/5">
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
  )
}
