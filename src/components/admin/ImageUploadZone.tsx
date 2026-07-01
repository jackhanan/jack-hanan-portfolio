'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { uploadFile } from '@/lib/uploadHelpers'

interface Props {
  currentImage: string
  slug: string
  onUpload: (url: string) => void
  label?: string
}

export default function ImageUploadZone({ currentImage, slug, onUpload, label = 'Hero Image' }: Props) {
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [urlInput, setUrlInput] = useState('')
  const [showUrlInput, setShowUrlInput] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleUpload(file: File) {
    setUploading(true)
    setError(null)
    try {
      const url = await uploadFile(file, slug)
      onUpload(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleUpload(file)
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handleUpload(file)
    // Reset so the same file can be re-selected if needed
    e.target.value = ''
  }

  function handleUrlSubmit() {
    const trimmed = urlInput.trim()
    if (!trimmed) return
    onUpload(trimmed)
    setUrlInput('')
    setShowUrlInput(false)
    setError(null)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs tracking-widest uppercase text-[#888882] font-sans">{label}</p>
        <button
          type="button"
          onClick={() => { setShowUrlInput((v) => !v); setError(null) }}
          className="text-xs text-[#6B7C9B] hover:text-[#8A9BB8] font-sans transition-colors cursor-pointer"
        >
          {showUrlInput ? 'Upload file instead' : 'Paste URL instead'}
        </button>
      </div>

      {showUrlInput ? (
        <div className="flex gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()}
            placeholder="https://res.cloudinary.com/… or any image URL"
            className="flex-1 bg-[#1A1A18] border border-[#2A2A28] text-[#E8E8E4] text-sm font-sans px-3 py-2.5 rounded focus:outline-none focus:border-[#6B7C9B] transition-colors duration-200 placeholder-[#555550]"
          />
          <button
            type="button"
            onClick={handleUrlSubmit}
            className="text-xs tracking-widest uppercase font-sans text-[#111110] bg-[#E8E8E4] hover:bg-[#6B7C9B] hover:text-white px-4 py-2.5 rounded transition-colors duration-150 cursor-pointer whitespace-nowrap"
          >
            Use URL
          </button>
        </div>
      ) : (
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
              <Image src={currentImage} alt="Current image" fill className="object-cover" unoptimized />
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
      )}

      {error && (
        <p className="mt-2 text-xs text-red-400 font-sans break-all">{error}</p>
      )}

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
