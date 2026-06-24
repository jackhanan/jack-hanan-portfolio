'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'

interface Props {
  images: string[]
  slug: string
  onChange: (images: string[]) => void
}

export default function GalleryManager({ images, slug, onChange }: Props) {
  const [uploading, setUploading] = useState(false)
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null)
  const dragIdx = useRef<number | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  async function uploadFiles(files: FileList) {
    setUploading(true)
    const uploaded: string[] = []
    for (const file of Array.from(files)) {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('slug', slug)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      uploaded.push(data.url)
    }
    onChange([...images, ...uploaded])
    setUploading(false)
  }

  function removeImage(idx: number) {
    onChange(images.filter((_, i) => i !== idx))
  }

  // Drag-to-reorder thumbnails
  function handleDragStart(idx: number) {
    dragIdx.current = idx
  }

  function handleDragEnter(idx: number) {
    setDragOverIdx(idx)
  }

  function handleDragEnd() {
    if (dragIdx.current === null || dragOverIdx === null) return
    const reordered = [...images]
    const [moved] = reordered.splice(dragIdx.current, 1)
    reordered.splice(dragOverIdx, 0, moved)
    onChange(reordered)
    dragIdx.current = null
    setDragOverIdx(null)
  }

  return (
    <div>
      <p className="text-xs tracking-widest uppercase text-[#888882] font-sans mb-3">Gallery</p>

      {/* Thumbnails */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-4">
          {images.map((src, i) => (
            <div
              key={src + i}
              draggable
              onDragStart={() => handleDragStart(i)}
              onDragEnter={() => handleDragEnter(i)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => e.preventDefault()}
              className={`relative aspect-square overflow-hidden bg-[#222220] rounded cursor-grab group ${
                dragOverIdx === i ? 'ring-2 ring-[#6B7C9B]' : ''
              }`}
            >
              <Image src={src} alt={`Gallery image ${i + 1}`} fill className="object-cover" />
              <button
                onClick={() => removeImage(i)}
                className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150 cursor-pointer"
                aria-label={`Remove image ${i + 1}`}
              >
                ×
              </button>
              <div className="absolute bottom-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M2 4h10M2 7h10M2 10h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Drop zone for new images */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault()
          uploadFiles(e.dataTransfer.files)
        }}
        className="border border-dashed border-[#333330] hover:border-[#555550] rounded p-6 text-center cursor-pointer transition-colors duration-200"
      >
        {uploading ? (
          <p className="text-sm text-[#888882] font-sans">Uploading…</p>
        ) : (
          <p className="text-sm text-[#555550] font-sans">
            Drag images here or click to add to gallery
          </p>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="sr-only"
        onChange={(e) => e.target.files && uploadFiles(e.target.files)}
      />
    </div>
  )
}
