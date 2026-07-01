/**
 * Safely POST a file to /api/upload and return { url } or throw with a human-readable message.
 * Handles non-JSON responses (e.g. proxy-level 413 "Request Entity Too Large") gracefully.
 */
export async function uploadFile(file: File, slug: string): Promise<string> {
  const fd = new FormData()
  fd.append('file', file)
  fd.append('slug', slug)

  let res: Response
  try {
    res = await fetch('/api/upload', { method: 'POST', body: fd })
  } catch {
    throw new Error('Network error — could not reach the upload API.')
  }

  // Safely parse JSON — a proxy-level error (e.g. 413) may return plain text
  let data: Record<string, unknown> = {}
  const contentType = res.headers.get('content-type') ?? ''
  if (contentType.includes('application/json')) {
    try { data = await res.json() } catch { /* leave data empty */ }
  } else {
    const text = await res.text()
    if (!res.ok) {
      throw new Error(`Upload failed (${res.status}): ${text.slice(0, 120)}`)
    }
  }

  if (!res.ok) {
    throw new Error((data.error as string) ?? `Upload failed (${res.status})`)
  }

  return data.url as string
}
