/**
 * Upload an image file directly from the browser to Cloudinary (bypasses Next.js
 * body size limits). Falls back to /api/upload for local dev when the public env
 * vars are not set.
 *
 * Requires these environment variables in production:
 *   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
 *   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
 */
export async function uploadFile(file: File, folder: string): Promise<string> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

  if (cloudName && uploadPreset) {
    return uploadDirect(file, cloudName, uploadPreset, folder)
  }

  // Local dev fallback — uses /api/upload which saves to the filesystem
  return uploadViaServer(file, folder)
}

async function uploadDirect(
  file: File,
  cloudName: string,
  uploadPreset: string,
  folder: string
): Promise<string> {
  const fd = new FormData()
  fd.append('file', file)
  fd.append('upload_preset', uploadPreset)
  fd.append('folder', `portfolio/${folder}`)

  let res: Response
  try {
    res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: fd,
    })
  } catch {
    throw new Error('Network error — could not reach Cloudinary.')
  }

  let data: Record<string, unknown> = {}
  try { data = await res.json() } catch { /* empty */ }

  if (!res.ok) {
    const msg = (data.error as { message?: string })?.message ?? `Cloudinary error ${res.status}`
    throw new Error(msg)
  }

  return data.secure_url as string
}

async function uploadViaServer(file: File, slug: string): Promise<string> {
  const fd = new FormData()
  fd.append('file', file)
  fd.append('slug', slug)

  let res: Response
  try {
    res = await fetch('/api/upload', { method: 'POST', body: fd })
  } catch {
    throw new Error('Network error — could not reach the upload API.')
  }

  let data: Record<string, unknown> = {}
  const contentType = res.headers.get('content-type') ?? ''
  if (contentType.includes('application/json')) {
    try { data = await res.json() } catch { /* empty */ }
  } else {
    const text = await res.text().catch(() => '')
    if (!res.ok) throw new Error(`Upload failed (${res.status}): ${text.slice(0, 120)}`)
  }

  if (!res.ok) {
    throw new Error((data.error as string) ?? `Upload failed (${res.status})`)
  }

  return data.url as string
}
