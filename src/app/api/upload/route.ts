import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { isValidToken } from '@/lib/auth'
import { cookies } from 'next/headers'

function checkAuth() {
  const token = cookies().get('admin-token')?.value
  return isValidToken(token)
}

export async function POST(request: Request) {
  if (!checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await request.formData()
  const file = formData.get('file') as File | null
  const slug = (formData.get('slug') as string) || 'misc'

  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })

  const ext = file.name.split('.').pop() ?? 'jpg'
  const filename = `${Date.now()}.${ext}`

  // Always write to public/uploads so Next.js can serve the files statically.
  // On Railway, mount your volume at /app/public/uploads (or use DATA_DIR for data files
  // and keep uploads in public/ which Railway persists if the volume covers /app/public).
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', slug)
  await mkdir(uploadDir, { recursive: true })

  const bytes = await file.arrayBuffer()
  await writeFile(path.join(uploadDir, filename), Buffer.from(bytes))

  return NextResponse.json({ url: `/uploads/${slug}/${filename}` })
}
