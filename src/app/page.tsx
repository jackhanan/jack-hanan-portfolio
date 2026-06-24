import Hero from '@/components/home/Hero'
import FeaturedGrid from '@/components/home/FeaturedGrid'
import { getFeaturedProjects } from '@/lib/projects'

export const revalidate = 0

export default async function HomePage() {
  const featured = await getFeaturedProjects()
  return (
    <>
      <Hero />
      <FeaturedGrid projects={featured} />
    </>
  )
}
