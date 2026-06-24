import { getVisibleProjects } from '@/lib/projects'
import NavClient from './NavClient'
import type { Project } from '@/types'

export default async function Nav() {
  let projects: Project[] = []
  try {
    projects = await getVisibleProjects()
  } catch {
    // Render with empty project list rather than breaking the page
  }
  return <NavClient projects={projects} />
}
