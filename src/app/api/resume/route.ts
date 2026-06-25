import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { isValidToken } from '@/lib/auth'
import { getRedis } from '@/lib/redis'

const KEY = 'resume_pdf'

// Public — serves the stored PDF
export async function GET() {
  const redis = getRedis()
  if (!redis) {
    return new NextResponse('Resume not available', { status: 404 })
  }

  try {
    const b64 = await redis.get<string>(KEY)
    if (!b64) {
      return new NextResponse('No resume uploaded', { status: 404 })
    }

    const buffer = Buffer.from(b64, 'base64')

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="Jack_Hanan_Resume.pdf"',
        'Content-Length': String(buffer.byteLength),
        'Cache-Control': 'no-store',
      },
    })
  } catch (err) {
    console.error('[api/resume] GET error:', err)
    return new NextResponse('Error retrieving resume', { status: 500 })
  }
}

// Admin only — stores a base64-encoded PDF
export async function PUT(request: Request) {
  const token = cookies().get('admin-token')?.value
  if (!isValidToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { base64: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (!body.base64) {
    return NextResponse.json({ error: 'Missing base64 field' }, { status: 400 })
  }

  const redis = getRedis()
  if (!redis) {
    return NextResponse.json({ error: 'Redis is not configured' }, { status: 500 })
  }

  try {
    console.log('[api/resume] Storing PDF, base64 length:', body.base64.length)
    await redis.set(KEY, body.base64)
    console.log('[api/resume] PDF stored successfully')
    return NextResponse.json({ ok: true, url: '/api/resume' })
  } catch (err) {
    console.error('[api/resume] PUT error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
