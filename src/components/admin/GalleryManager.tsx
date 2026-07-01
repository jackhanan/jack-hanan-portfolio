'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { uploadFile } from '@/lib/uploadHelpers'

interface Props {
  images: string[]
  slug: string
  onChange: (images: string[]) => void
}

export default function GalleryManager({ images, slug, onChange }: Props) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null)
  const [urlInput, setUrlInput] = useState('')
  const [showUrlInput, setShowUrlInput] = useState(false)
  const dragIdx = useRef<number | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  async function uploadFiles(files: FileList) {
    setUploading(true)
    setError(null)
    const uploaded: string[] = []
    try {
      for (const file of Array.from(files)) {
        const url = await uploadFile(file, slug)
        uploaded.push(url)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
    if (uploaded.length > 0) onChange([...images, ...uploaded])
  }

  function addUrl() {
    const trimmed = urlInput.trim()
    if (!trimmed) return
    onChange([...images, trimmed])
    setUrlInput('')
    setError(null)
  }

  function removeImage(idx: number) {
    onChange(images.filter((_, i) => i !== idx))
  }

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
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs tracking-widest uppercase text-[#888882] font-sans">Gallery</p>
        <button
          type="button"
          onClick={() => { setShowUrlInput((v) => !v); setError(null) }}
          className="text-xs text-[#6B7C9B] hover:text-[#8A9BB8] font-sans transition-colors cursor-pointer"
        >
          {showUrlInput ? 'Upload files instead' : 'Add by URL instead'}
        </button>
      </div>

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
              <Image src={src} alt={`Gallery image ${i + 1}`} fill className="object-cover" unoptimized />
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

      {/* URL input mode */}
      {showUrlInput ? (
        <div className="flex gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addUrl()}
            placeholder="https://res.cloudinary.com/… or any image URL"
            className="flex-1 bg-[#1A1A18] border border-[#2A2A28] text-[#E8E8E4] text-sm font-sans px-3 py-2.5 rounded focus:outline-none focus:border-[#6B7C9B] transition-colors duration-200 placeholder-[#555550]"
          />
          <button
            type="button"
            onClick={addUrl}
            className="text-xs tracking-widest uppercase font-sans text-[#111110] bg-[#E8E8E4] hover:bg-[#6B7C9B] hover:text-white px-4 py-2.5 rounded transition-colors duration-150 cursor-pointer whitespace-nowrap"
          >
            Add
          </button>
        </div>
      ) : (
        /* File drop zone */
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
      )}

      {error && (
        <p className="mt-2 text-xs text-red-400 font-sans break-all">{error}</p>
      )}

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
