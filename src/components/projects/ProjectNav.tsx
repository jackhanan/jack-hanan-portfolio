import Image from 'next/image'
import Link from 'next/link'
import type { Project } from '@/types'

interface Props {
  prev: Project | null
  next: Project | null
}

function NavCard({ project, label }: { project: Project; label: string }) {
  return (
    <Link href={`/projects/${project.id}`} className="group flex flex-col gap-3">
      <p className="text-xs tracking-widest uppercase text-mid font-sans">{label}</p>
      {project.heroImage && (
        <div className="relative overflow-hidden bg-charcoal/5 aspect-[4/3]">
          <Image
            src={project.heroImage}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
        </div>
      )}
      <p className="font-serif text-lg font-light text-charcoal group-hover:text-accent transition-colors duration-200">
        {project.title}
      </p>
    </Link>
  )
}

export default function ProjectNav({ prev, next }: Props) {
  if (!prev && !next) return null

  return (
    <div className="max-w-site mx-auto px-6 lg:px-12 mt-20 mb-16">
      <div className="arch-rule pt-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div>{prev && <NavCard project={prev} label="Previous" />}</div>
          <div className="sm:text-right flex flex-col items-start sm:items-end">
            {next && <NavCard project={next} label="Next" />}
          </div>
        </div>
      </div>
    </div>
  )
}
