import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { isValidToken } from '@/lib/auth'
import { cookies } from 'next/headers'

function checkAuth() {
  const token = cookies().get('admin-token')?.value
  const valid = isValidToken(token)
  if (!valid) console.log('[api/upload] Auth failed — token:', token ? 'present but wrong' : 'missing')
  return valid
}

// Images → /image/upload, PDFs/raw files → /raw/upload
async function uploadToCloudinary(file: File, folder: string, isPdf: boolean): Promise<string> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME!
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET!
  const resourceType = isPdf ? 'raw' : 'image'

  const fd = new FormData()
  fd.append('file', file)
  fd.append('upload_preset', uploadPreset)
  fd.append('folder', `portfolio/${folder}`)

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
    { method: 'POST', body: fd }
  )

  const contentType = res.headers.get('content-type') ?? ''
  if (!res.ok) {
    const body = contentType.includes('application/json')
      ? JSON.stringify((await res.json().catch(() => ({}))))
      : await res.text().catch(() => '')
    throw new Error(`Cloudinary error ${res.status}: ${body.slice(0, 200)}`)
  }

  const data = await res.json()
  return data.secure_url as string
}

// Local filesystem fallback — only works in local dev (Railway filesystem is ephemeral).
async function uploadToFilesystem(file: File, slug: string): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'bin'
  const filename = `${Date.now()}.${ext}`
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', slug)
  await mkdir(uploadDir, { recursive: true })
  const bytes = await file.arrayBuffer()
  await writeFile(path.join(uploadDir, filename), Buffer.from(bytes))
  return `/uploads/${slug}/${filename}`
}

export async function POST(request: Request) {
  if (!checkAuth()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let formData: FormData
  try {
    formData = await request.formData()
  } catch (err) {
    console.error('[api/upload] Failed to parse form data:', err)
    return NextResponse.json({ error: 'Invalid multipart form data' }, { status: 400 })
  }

  const file = formData.get('file') as File | null
  const slug = (formData.get('slug') as string | null) || 'misc'

  if (!file || file.size === 0) {
    return NextResponse.json({ error: 'No file received' }, { status: 400 })
  }

  const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
  const isImage = file.type.startsWith('image/')

  if (!isImage && !isPdf) {
    return NextResponse.json({ error: 'Only image or PDF files are allowed' }, { status: 400 })
  }

  // Cap images at 10 MB, PDFs at 20 MB
  const maxSize = isPdf ? 20 * 1024 * 1024 : 10 * 1024 * 1024
  if (file.size > maxSize) {
    return NextResponse.json({ error: `File too large (max ${isPdf ? '20' : '10'} MB)` }, { status: 400 })
  }

  const useCloudinary =
    !!process.env.CLOUDINARY_CLOUD_NAME && !!process.env.CLOUDINARY_UPLOAD_PRESET

  console.log('[api/upload] slug:', slug, '| file:', file.name, '| size:', file.size, '| pdf:', isPdf)
  console.log('[api/upload] storage:', useCloudinary ? 'Cloudinary' : 'filesystem (local only)')

  try {
    const url = useCloudinary
      ? await uploadToCloudinary(file, slug, isPdf)
      : await uploadToFilesystem(file, slug)

    console.log('[api/upload] saved to:', url)
    return NextResponse.json({ url })
  } catch (err) {
    console.error('[api/upload] Upload error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
