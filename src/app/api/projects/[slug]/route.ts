import { NextResponse } from 'next/server'
import { readProjects, writeProjects } from '@/lib/projects'
import { isValidToken } from '@/lib/auth'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

function checkAuth() {
  const token = cookies().get('admin-token')?.value
  return isValidToken(token)
}

export async function GET(_: Request, { params }: { params: { slug: string } }) {
  const projects = await readProjects()
  const project = projects.find((p) => p.id === params.slug)
  if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(project)
}

export async function PUT(request: Request, { params }: { params: { slug: string } }) {
  if (!checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const projects = await readProjects()
  const idx = projects.findIndex((p) => p.id === params.slug)
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  projects[idx] = { ...projects[idx], ...body, id: params.slug }
  await writeProjects(projects)

  revalidatePath('/projects')
  revalidatePath(`/projects/${params.slug}`)
  revalidatePath('/')

  return NextResponse.json(projects[idx])
}

export async function DELETE(_: Request, { params }: { params: { slug: string } }) {
  if (!checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const projects = await readProjects()
  const filtered = projects.filter((p) => p.id !== params.slug)
  await writeProjects(filtered)

  revalidatePath('/projects')
  revalidatePath('/')

  return NextResponse.json({ ok: true })
}
