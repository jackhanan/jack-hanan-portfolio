'use client'

import { useState, useRef } from 'react'

interface Props {
  currentUrl: string
  onUpload: (url: string) => void
}

export default function PdfUploadZone({ currentUrl, onUpload }: Props) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  async function uploadFile(file: File) {
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setError('Please select a PDF file')
      return
    }
    setUploading(true)
    setError(null)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('slug', 'resume')
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? `Upload failed (${res.status})`)
      } else {
        onUpload(data.url)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error')
    } finally {
      setUploading(false)
    }
  }

  const filename = currentUrl
    ? decodeURIComponent(currentUrl.split('/').pop() ?? currentUrl).replace(/\?.*$/, '')
    : null

  return (
    <div>
      <p className="text-xs tracking-widest uppercase text-[#888882] font-sans mb-2">Resume PDF</p>

      {currentUrl && (
        <div className="flex items-center gap-3 mb-3 px-3 py-2.5 bg-[#1A1A18] border border-[#2A2A28] rounded">
          <svg className="w-4 h-4 text-[#6B7C9B] shrink-0" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M9 1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V5L9 1z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 1v4h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <a
            href={currentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[#6B7C9B] hover:text-[#8A9BB8] font-sans truncate transition-colors"
            title={currentUrl}
          >
            {filename ?? 'Current resume'}
          </a>
          <span className="text-xs text-[#555550] font-sans ml-auto shrink-0">Current</span>
        </div>
      )}

      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault()
          const file = e.dataTransfer.files[0]
          if (file) uploadFile(file)
        }}
        className="border border-dashed border-[#333330] hover:border-[#555550] rounded p-6 text-center cursor-pointer transition-colors duration-200"
      >
        {uploading ? (
          <p className="text-sm text-[#888882] font-sans">Uploading…</p>
        ) : (
          <div className="space-y-1">
            <p className="text-sm text-[#555550] font-sans">
              {currentUrl ? 'Drag a new PDF to replace, or click to browse' : 'Drag PDF here or click to upload'}
            </p>
            <p className="text-xs text-[#444440] font-sans">PDF only · max 20 MB</p>
          </div>
        )}
      </div>

      {error && <p className="mt-2 text-xs text-red-400 font-sans">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        className="sr-only"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadFile(f) }}
      />
    </div>
  )
}
