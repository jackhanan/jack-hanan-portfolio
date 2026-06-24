import { NextResponse } from 'next/server'
import { readProjects, writeProjects, slugify } from '@/lib/projects'
import { isValidToken } from '@/lib/auth'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import type { Project } from '@/types'

function checkAuth() {
  const token = cookies().get('admin-token')?.value
  return isValidToken(token)
}

export async function GET() {
  const projects = await readProjects()
  return NextResponse.json(projects)
}

export async function POST(request: Request) {
  if (!checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const projects = await readProjects()

  const id = slugify(body.title || 'untitled')
  const newProject: Project = {
    id,
    title: body.title ?? 'Untitled Project',
    year: body.year ?? new Date().getFullYear(),
    category: body.category ?? 'Academic',
    description: body.description ?? '',
    heroImage: body.heroImage ?? '',
    gallery: body.gallery ?? [],
    featured: body.featured ?? false,
    order: projects.length,
    visible: body.visible ?? false,
  }

  projects.push(newProject)
  await writeProjects(projects)

  revalidatePath('/projects')
  revalidatePath('/')

  return NextResponse.json(newProject, { status: 201 })
}

export async function PUT(request: Request) {
  if (!checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body: Project[] = await request.json()
  await writeProjects(body)

  revalidatePath('/projects')
  revalidatePath('/')

  return NextResponse.json({ ok: true })
}
