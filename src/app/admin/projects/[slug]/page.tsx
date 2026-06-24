import { notFound } from 'next/navigation'
import { getProject } from '@/lib/projects'
import ProjectEditor from '@/components/admin/ProjectEditor'

export const revalidate = 0

export default async function EditProjectPage({ params }: { params: { slug: string } }) {
  const project = await getProject(params.slug)
  if (!project) notFound()
  return <ProjectEditor initial={project} />
}
