import { readProjects } from '@/lib/projects'
import DashboardClient from '@/components/admin/DashboardClient'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  let projects: import('@/types').Project[] = []
  try {
    projects = await readProjects()
  } catch {
    // Render empty list; admin can still create new projects
  }
  return <DashboardClient initial={projects} />
}
