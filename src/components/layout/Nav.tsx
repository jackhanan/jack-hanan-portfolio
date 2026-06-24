import { getVisibleProjects } from '@/lib/projects'
import NavClient from './NavClient'

export default async function Nav() {
  const projects = await getVisibleProjects()
  return <NavClient projects={projects} />
}
