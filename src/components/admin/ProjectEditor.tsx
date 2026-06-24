'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ImageUploadZone from './ImageUploadZone'
import GalleryManager from './GalleryManager'
import Toggle from '@/components/ui/Toggle'
import type { Project } from '@/types'

interface Props {
  initial: Project
  isNew?: boolean
}

const CATEGORIES = ['Academic', 'Professional', 'Research', 'Personal']

export default function ProjectEditor({ initial, isNew = false }: Props) {
  const [project, setProject] = useState<Project>(initial)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [saved, setSaved] = useState(false)
  const router = useRouter()

  function update<K extends keyof Project>(key: K, value: Project[K]) {
    setProject((p) => ({ ...p, [key]: value }))
    setSaved(false)
  }

  async function handleSave() {
    setSaving(true)
    const method = isNew ? 'POST' : 'PUT'
    const url = isNew ? '/api/projects' : `/api/projects/${initial.id}`

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(project),
    })

    if (res.ok) {
      setSaved(true)
      if (isNew) {
        const created = await res.json()
        router.push(`/admin/projects/${created.id}`)
      }
    }
    setSaving(false)
  }

  async function handleDelete() {
    if (!confirm(`Delete "${project.title}"? This cannot be undone.`)) return
    setDeleting(true)
    await fetch(`/api/projects/${initial.id}`, { method: 'DELETE' })
    router.push('/admin/dashboard')
  }

  const inputClass =
    'w-full bg-[#1A1A18] border border-[#2A2A28] text-[#E8E8E4] text-sm font-sans px-3 py-2.5 rounded focus:outline-none focus:border-[#6B7C9B] transition-colors duration-200 placeholder-[#555550]'
  const labelClass = 'block text-xs tracking-widest uppercase text-[#888882] font-sans mb-1.5'

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-lg text-[#E8E8E4] font-sans">
          {isNew ? 'New Project' : project.title || 'Edit Project'}
        </h1>
        <div className="flex items-center gap-3">
          {saved && <span className="text-xs text-green-400 font-sans">Saved</span>}
          {!isNew && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="text-xs text-red-400 hover:text-red-300 font-sans px-3 py-1.5 border border-red-400/30 hover:border-red-300/40 rounded transition-colors duration-150 cursor-pointer disabled:opacity-50"
            >
              {deleting ? 'Deleting…' : 'Delete'}
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="text-xs tracking-widest uppercase font-sans text-[#111110] bg-[#E8E8E4] hover:bg-[#6B7C9B] hover:text-white px-5 py-2 rounded transition-colors duration-150 cursor-pointer disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className={labelClass}>Title</label>
          <input
            id="title"
            type="text"
            value={project.title}
            onChange={(e) => update('title', e.target.value)}
            className={inputClass}
            placeholder="Project title"
          />
        </div>

        {/* Year + Category */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="year" className={labelClass}>Year</label>
            <input
              id="year"
              type="number"
              value={project.year}
              onChange={(e) => update('year', Number(e.target.value))}
              className={inputClass}
              min={2000}
              max={2099}
            />
          </div>
          <div>
            <label htmlFor="category" className={labelClass}>Category</label>
            <select
              id="category"
              value={project.category}
              onChange={(e) => update('category', e.target.value)}
              className={inputClass}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className={labelClass}>Description</label>
          <textarea
            id="description"
            rows={8}
            value={project.description}
            onChange={(e) => update('description', e.target.value)}
            className={`${inputClass} resize-y`}
            placeholder="Project description… (separate paragraphs with a blank line)"
          />
        </div>

        {/* Hero image */}
        <ImageUploadZone
          currentImage={project.heroImage}
          slug={project.id || 'new'}
          onUpload={(url) => update('heroImage', url)}
        />

        {/* Gallery */}
        <GalleryManager
          images={project.gallery}
          slug={project.id || 'new'}
          onChange={(imgs) => update('gallery', imgs)}
        />

        {/* Toggles */}
        <div className="flex items-center gap-8 pt-2">
          <Toggle
            checked={project.visible}
            onChange={(v) => update('visible', v)}
            label="Visible on site"
            id="visible"
          />
          <Toggle
            checked={project.featured}
            onChange={(v) => update('featured', v)}
            label="Featured on homepage"
            id="featured"
          />
        </div>
      </div>
    </div>
  )
}
