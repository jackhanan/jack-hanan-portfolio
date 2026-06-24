import Link from 'next/link'
import ProjectGrid from '@/components/projects/ProjectGrid'
import type { Project } from '@/types'

interface Props {
  projects: Project[]
}

export default function FeaturedGrid({ projects }: Props) {
  return (
    <section className="px-6 lg:px-12 max-w-site mx-auto pb-24">
      <div className="flex items-baseline justify-between mb-10 arch-rule pt-10">
        <h2 className="font-serif text-2xl font-light tracking-tight text-charcoal">
          Selected Work
        </h2>
        <Link
          href="/projects"
          className="text-xs tracking-widest uppercase text-mid hover:text-charcoal transition-colors duration-200 font-sans"
        >
          All Projects
        </Link>
      </div>
      <ProjectGrid projects={projects} columns={3} />
    </section>
  )
}
