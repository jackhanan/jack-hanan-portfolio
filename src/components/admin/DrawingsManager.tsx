'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'

interface Props {
  images: string[]
  slug: string
  onChange: (images: string[]) => void
}

export default function DrawingsManager({ images, slug, onChange }: Props) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [urlInput, setUrlInput] = useState('')
  const [showUrlInput, setShowUrlInput] = useState(false)
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null)
  const dragIdx = useRef<number | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  async function uploadFiles(files: FileList) {
    setUploading(true)
    setError(null)
    const uploaded: string[] = []
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData()
        fd.append('file', file)
        fd.append('slug', `${slug}-drawings`)
        const res = await fetch('/api/upload', { method: 'POST', body: fd })
        const data = await res.json()
        if (!res.ok) {
          setError(data.error ?? `Upload failed (${res.status})`)
          break
        }
        uploaded.push(data.url)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error during upload')
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

  function handleDragStart(idx: number) { dragIdx.current = idx }
  function handleDragEnter(idx: number) { setDragOverIdx(idx) }
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
        <p className="text-xs tracking-widest uppercase text-[#888882] font-sans">Drawings</p>
        <button
          type="button"
          onClick={() => { setShowUrlInput((v) => !v); setError(null) }}
          className="text-xs text-[#6B7C9B] hover:text-[#8A9BB8] font-sans transition-colors cursor-pointer"
        >
          {showUrlInput ? 'Upload files instead' : 'Add by URL instead'}
        </button>
      </div>

      {/* Stacked full-width previews */}
      {images.length > 0 && (
        <div className="space-y-3 mb-4">
          {images.map((src, i) => (
            <div
              key={src + i}
              draggable
              onDragStart={() => handleDragStart(i)}
              onDragEnter={() => handleDragEnter(i)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => e.preventDefault()}
              className={`relative w-full bg-[#222220] rounded overflow-hidden group cursor-grab ${
                dragOverIdx === i ? 'ring-2 ring-[#6B7C9B]' : ''
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`Drawing ${i + 1}`}
                className="w-full h-auto block"
              />
              <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                <div className="w-6 h-6 bg-black/60 text-white text-xs rounded flex items-center justify-center" title="Drag to reorder">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path d="M2 4h10M2 7h10M2 10h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
                <button
                  onClick={() => removeImage(i)}
                  className="w-6 h-6 bg-red-500 text-white text-xs rounded flex items-center justify-center cursor-pointer"
                  aria-label={`Remove drawing ${i + 1}`}
                >
                  ×
                </button>
              </div>
              <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                <span className="text-[10px] text-white/70 bg-black/50 px-1.5 py-0.5 rounded font-sans">
                  Drawing {i + 1}
                </span>
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
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); uploadFiles(e.dataTransfer.files) }}
          className="border border-dashed border-[#333330] hover:border-[#555550] rounded p-6 text-center cursor-pointer transition-colors duration-200"
        >
          {uploading ? (
            <p className="text-sm text-[#888882] font-sans">Uploading…</p>
          ) : (
            <div className="space-y-1">
              <p className="text-sm text-[#555550] font-sans">
                Drag drawings here or click to add
              </p>
              <p className="text-xs text-[#444440] font-sans">
                Plans, sections, elevations — displayed full-width on the project page
              </p>
            </div>
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
