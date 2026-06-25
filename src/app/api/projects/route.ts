import { NextResponse } from 'next/server'
import { readProjects, writeProjects, slugify } from '@/lib/projects'
import { isValidToken } from '@/lib/auth'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import type { Project } from '@/types'

function checkAuth() {
  const token = cookies().get('admin-token')?.value
  const valid = isValidToken(token)
  if (!valid) console.log('[api/projects] Auth failed — token:', token ? 'present but wrong' : 'missing')
  return valid
}

export async function GET() {
  try {
    const projects = await readProjects()
    return NextResponse.json(projects)
  } catch (err) {
    console.error('[api/projects] GET error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

export async function POST(request: Request) {
  if (!checkAuth()) {
    return NextResponse.json({ error: 'Unauthorized — check admin cookie' }, { status: 401 })
  }

  let body
  try {
    body = await request.json()
  } catch (err) {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  try {
    console.log('[api/projects] Creating project:', body.title)
    console.log('[api/projects] UPSTASH_REDIS_REST_URL set:', !!process.env.UPSTASH_REDIS_REST_URL)
    console.log('[api/projects] UPSTASH_REDIS_REST_TOKEN set:', !!process.env.UPSTASH_REDIS_REST_TOKEN)

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
      drawings: body.drawings ?? [],
      featured: body.featured ?? false,
      order: projects.length,
      visible: body.visible ?? false,
    }

    projects.push(newProject)
    await writeProjects(projects)
    revalidatePath('/projects')
    revalidatePath('/')
    console.log('[api/projects] Created:', id)
    return NextResponse.json(newProject, { status: 201 })
  } catch (err) {
    console.error('[api/projects] POST error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  if (!checkAuth()) {
    return NextResponse.json({ error: 'Unauthorized — check admin cookie' }, { status: 401 })
  }

  let body: Project[]
  try {
    body = await request.json()
  } catch (err) {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  try {
    console.log('[api/projects] Reordering', body.length, 'projects')
    await writeProjects(body)
    revalidatePath('/projects')
    revalidatePath('/')
    console.log('[api/projects] Reorder saved')
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[api/projects] PUT error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
