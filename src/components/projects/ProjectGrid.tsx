import ProjectCard from './ProjectCard'
import type { Project } from '@/types'

interface Props {
  projects: Project[]
  columns?: 2 | 3
}

export default function ProjectGrid({ projects, columns = 3 }: Props) {
  const gridClass =
    columns === 2
      ? 'grid-cols-1 sm:grid-cols-2'
      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'

  return (
    <div className={`grid ${gridClass} gap-x-8 gap-y-10`}>
      {projects.map((project, i) => (
        <ProjectCard key={project.id} project={project} priority={i < 2} index={i} />
      ))}
    </div>
  )
}
