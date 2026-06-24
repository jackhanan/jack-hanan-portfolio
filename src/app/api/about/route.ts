import { NextResponse } from 'next/server'
import { readAbout, writeAbout } from '@/lib/about'
import { isValidToken } from '@/lib/auth'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

function checkAuth() {
  const token = cookies().get('admin-token')?.value
  return isValidToken(token)
}

export async function GET() {
  const about = await readAbout()
  return NextResponse.json(about)
}

export async function PUT(request: Request) {
  if (!checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  await writeAbout(body)

  revalidatePath('/about')

  return NextResponse.json({ ok: true })
}
