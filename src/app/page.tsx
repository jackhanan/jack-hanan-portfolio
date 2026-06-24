import Hero from '@/components/home/Hero'
import FeaturedGrid from '@/components/home/FeaturedGrid'
import { getFeaturedProjects } from '@/lib/projects'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  let featured: import('@/types').Project[] = []
  try {
    featured = await getFeaturedProjects()
  } catch {
    // Render empty grid rather than crashing
  }
  return (
    <>
      <Hero />
      <FeaturedGrid projects={featured} />
    </>
  )
}
