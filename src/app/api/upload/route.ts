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

// Upload to Cloudinary via unsigned upload preset — no SDK needed.
// Set CLOUDINARY_CLOUD_NAME and CLOUDINARY_UPLOAD_PRESET in Railway Variables.
// In Cloudinary dashboard: Settings → Upload → Upload presets → Add unsigned preset.
async function uploadToCloudinary(file: File, folder: string): Promise<string> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME!
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET!

  const fd = new FormData()
  fd.append('file', file)
  fd.append('upload_preset', uploadPreset)
  fd.append('folder', `portfolio/${folder}`)

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: 'POST', body: fd }
  )

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Cloudinary error ${res.status}: ${text}`)
  }

  const data = await res.json()
  return data.secure_url as string
}

// Local filesystem fallback — only works in local dev (Railway filesystem is ephemeral).
async function uploadToFilesystem(file: File, slug: string): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
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

  // Validate it's an image
  if (!file.type.startsWith('image/')) {
    return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 })
  }

  // Cap at 10 MB
  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: 'File too large (max 10 MB)' }, { status: 400 })
  }

  const useCloudinary =
    !!process.env.CLOUDINARY_CLOUD_NAME && !!process.env.CLOUDINARY_UPLOAD_PRESET

  console.log('[api/upload] slug:', slug, '| file:', file.name, '| size:', file.size)
  console.log('[api/upload] storage:', useCloudinary ? 'Cloudinary' : 'filesystem (local only)')

  try {
    const url = useCloudinary
      ? await uploadToCloudinary(file, slug)
      : await uploadToFilesystem(file, slug)

    console.log('[api/upload] saved to:', url)
    return NextResponse.json({ url })
  } catch (err) {
    console.error('[api/upload] Upload error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
