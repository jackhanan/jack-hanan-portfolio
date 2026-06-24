import { readProjects } from '@/lib/projects'
import DashboardClient from '@/components/admin/DashboardClient'

export const revalidate = 0

export default async function DashboardPage() {
  const projects = await readProjects()
  return <DashboardClient initial={projects} />
}
