import ProjectEditor from '@/components/admin/ProjectEditor'
import type { Project } from '@/types'

const blank: Project = {
  id: 'new',
  title: '',
  year: new Date().getFullYear(),
  category: 'Academic',
  description: '',
  heroImage: '',
  gallery: [],
  featured: false,
  order: 999,
  visible: false,
}

export default function NewProjectPage() {
  return <ProjectEditor initial={blank} isNew />
}
