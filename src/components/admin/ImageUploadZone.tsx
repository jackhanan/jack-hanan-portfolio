'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'

interface Props {
  currentImage: string
  slug: string
  onUpload: (url: string) => void
  label?: string
}

export default function ImageUploadZone({ currentImage, slug, onUpload, label = 'Hero Image' }: Props) {
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function uploadFile(file: File) {
    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    fd.append('slug', slug)

    const res = await fetch('/api/upload', { method: 'POST', body: fd })
    const data = await res.json()
    onUpload(data.url)
    setUploading(false)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) uploadFile(file)
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) uploadFile(file)
  }

  return (
    <div>
      <p className="text-xs tracking-widest uppercase text-[#888882] font-sans mb-2">{label}</p>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded cursor-pointer transition-colors duration-200 ${
          dragging ? 'border-[#6B7C9B] bg-[#6B7C9B]/10' : 'border-[#333330] hover:border-[#555550]'
        }`}
      >
        {currentImage ? (
          <div className="relative aspect-video overflow-hidden rounded">
            <Image src={currentImage} alt="Current hero" fill className="object-cover" />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
              <p className="text-xs text-white font-sans tracking-wide">Replace image</p>
            </div>
          </div>
        ) : (
          <div className="aspect-video flex flex-col items-center justify-center gap-2 text-[#555550]">
            {uploading ? (
              <p className="text-sm font-sans">Uploading…</p>
            ) : (
              <>
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 16V8M8 12l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <rect x="2" y="2" width="20" height="20" rx="2" stroke="currentColor" strokeWidth="1.5" />
                </svg>
                <p className="text-sm font-sans">Drag & drop or click to upload</p>
              </>
            )}
          </div>
        )}

        {uploading && currentImage && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded">
            <p className="text-sm text-white font-sans">Uploading…</p>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={handleChange}
      />
    </div>
  )
}
