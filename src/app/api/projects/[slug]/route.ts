import { NextResponse } from 'next/server'
import { readProjects, writeProjects } from '@/lib/projects'
import { isValidToken } from '@/lib/auth'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

function checkAuth() {
  const token = cookies().get('admin-token')?.value
  const valid = isValidToken(token)
  if (!valid) console.log('[api/projects/slug] Auth failed — token:', token ? 'present but wrong' : 'missing')
  return valid
}

export async function GET(_: Request, { params }: { params: { slug: string } }) {
  try {
    const projects = await readProjects()
    const project = projects.find((p) => p.id === params.slug)
    if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(project)
  } catch (err) {
    console.error(`[api/projects/${params.slug}] GET error:`, err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { slug: string } }) {
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
    console.log(`[api/projects/${params.slug}] Updating project`)
    console.log('[api/projects/slug] UPSTASH_REDIS_REST_URL set:', !!process.env.UPSTASH_REDIS_REST_URL)
    console.log('[api/projects/slug] UPSTASH_REDIS_REST_TOKEN set:', !!process.env.UPSTASH_REDIS_REST_TOKEN)

    const projects = await readProjects()
    const idx = projects.findIndex((p) => p.id === params.slug)
    if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    projects[idx] = { ...projects[idx], ...body, id: params.slug }
    await writeProjects(projects)

    revalidatePath('/projects')
    revalidatePath(`/projects/${params.slug}`)
    revalidatePath('/')
    console.log(`[api/projects/${params.slug}] Update saved`)
    return NextResponse.json(projects[idx])
  } catch (err) {
    console.error(`[api/projects/${params.slug}] PUT error:`, err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

export async function DELETE(_: Request, { params }: { params: { slug: string } }) {
  if (!checkAuth()) {
    return NextResponse.json({ error: 'Unauthorized — check admin cookie' }, { status: 401 })
  }

  try {
    console.log(`[api/projects/${params.slug}] Deleting project`)
    const projects = await readProjects()
    const filtered = projects.filter((p) => p.id !== params.slug)
    await writeProjects(filtered)

    revalidatePath('/projects')
    revalidatePath('/')
    console.log(`[api/projects/${params.slug}] Deleted`)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error(`[api/projects/${params.slug}] DELETE error:`, err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
