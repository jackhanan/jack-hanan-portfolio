import Link from 'next/link'
import Image from 'next/image'
import type { Project } from '@/types'

interface Props {
  project: Project
  priority?: boolean
}

export default function ProjectCard({ project, priority = false }: Props) {
  return (
    <Link
      href={`/projects/${project.id}`}
      className="project-card group block cursor-pointer"
    >
      {/* Image container — 4:3 aspect */}
      <div className="relative overflow-hidden bg-charcoal/5 aspect-[4/3]">
        {project.heroImage ? (
          <Image
            src={project.heroImage}
            alt={project.title}
            fill
            className="project-card-img object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={priority}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-charcoal/8 to-charcoal/3 flex items-end p-4">
            <span className="text-xs text-mid/60 tracking-wide font-sans">{project.category}</span>
          </div>
        )}

        {/* Hover overlay with title */}
        <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/60 transition-colors duration-500 ease-arch flex items-end">
          <div className="p-5 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400 ease-arch">
            <p className="font-serif text-title font-light text-white">{project.title}</p>
            <p className="text-xs text-white/70 mt-1 font-sans tracking-wide">
              {project.year} — {project.category}
            </p>
          </div>
        </div>
      </div>

      {/* Below-image metadata */}
      <div className="mt-3">
        <h3 className="font-serif text-xl font-light text-charcoal group-hover:text-accent transition-colors duration-200">
          {project.title}
        </h3>
        <p className="text-xs text-mid mt-1 font-sans tracking-wide">
          {project.year} &nbsp;·&nbsp; {project.category}
        </p>
      </div>
    </Link>
  )
}
