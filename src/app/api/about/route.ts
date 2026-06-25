import { NextResponse } from 'next/server'
import { readAbout, writeAbout } from '@/lib/about'
import { isValidToken } from '@/lib/auth'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

function checkAuth() {
  const token = cookies().get('admin-token')?.value
  const valid = isValidToken(token)
  if (!valid) console.log('[api/about] Auth failed — token:', token ? 'present but wrong' : 'missing')
  return valid
}

export async function GET() {
  try {
    const about = await readAbout()
    return NextResponse.json(about)
  } catch (err) {
    console.error('[api/about] GET error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  if (!checkAuth()) {
    return NextResponse.json({ error: 'Unauthorized — check admin cookie' }, { status: 401 })
  }

  let body
  try {
    body = await request.json()
  } catch (err) {
    console.error('[api/about] Failed to parse request body:', err)
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  try {
    console.log('[api/about] Writing about data...')
    console.log('[api/about] UPSTASH_REDIS_REST_URL set:', !!process.env.UPSTASH_REDIS_REST_URL)
    console.log('[api/about] UPSTASH_REDIS_REST_TOKEN set:', !!process.env.UPSTASH_REDIS_REST_TOKEN)
    await writeAbout(body)
    revalidatePath('/about')
    console.log('[api/about] Write successful')
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[api/about] Write error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
