import type { Metadata } from 'next'
import { getVisibleProjects } from '@/lib/projects'
import ProjectGrid from '@/components/projects/ProjectGrid'
import FadeIn from '@/components/ui/FadeIn'

export const metadata: Metadata = { title: 'Projects' }
export const dynamic = 'force-dynamic'

export default async function ProjectsPage() {
  let projects: import('@/types').Project[] = []
  try {
    projects = await getVisibleProjects()
  } catch {
    // Render empty grid rather than crashing
  }

  return (
    <div className="pt-24 md:pt-32 pb-16 md:pb-24 px-6 lg:px-12 max-w-site mx-auto">
      <FadeIn>
        <div className="flex items-baseline justify-between mb-12 arch-rule pt-8">
          <h1 className="font-serif text-headline font-light text-charcoal">Projects</h1>
          <p className="text-xs text-mid font-sans tracking-wide">{projects.length} works</p>
        </div>
      </FadeIn>
      <FadeIn delay={100}>
        <ProjectGrid projects={projects} columns={3} />
      </FadeIn>
    </div>
  )
}
