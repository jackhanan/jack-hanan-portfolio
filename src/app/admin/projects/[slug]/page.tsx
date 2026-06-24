import { notFound } from 'next/navigation'
import { getProject } from '@/lib/projects'
import ProjectEditor from '@/components/admin/ProjectEditor'

export const dynamic = 'force-dynamic'

export default async function EditProjectPage({ params }: { params: { slug: string } }) {
  let project = null
  try {
    project = await getProject(params.slug)
  } catch {
    // Fall through to notFound
  }
  if (!project) notFound()
  return <ProjectEditor initial={project} />
}
