'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ImageUploadZone from './ImageUploadZone'
import PdfUploadZone from './PdfUploadZone'
import type { AboutData, EducationEntry } from '@/types'

interface Props {
  initial: AboutData
}

export default function AboutEditor({ initial }: Props) {
  const [data, setData] = useState<AboutData>(initial)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  function update<K extends keyof AboutData>(key: K, value: AboutData[K]) {
    setData((d) => ({ ...d, [key]: value }))
    setSaved(false)
    setError(null)
  }

  function updateSkills(raw: string) {
    update('skills', raw.split('\n').map((s) => s.trim()).filter(Boolean))
  }

  function updateSoftware(raw: string) {
    update('software', raw.split('\n').map((s) => s.trim()).filter(Boolean))
  }

  function updateEducation(idx: number, field: keyof EducationEntry, value: string) {
    const edu = data.education.map((e, i) => i === idx ? { ...e, [field]: value } : e)
    update('education', edu)
  }

  function addEducation() {
    update('education', [...data.education, { institution: '', degree: '', year: '' }])
  }

  function removeEducation(idx: number) {
    update('education', data.education.filter((_, i) => i !== idx))
  }

  async function handleSave() {
    setSaving(true)
    setSaved(false)
    setError(null)
    try {
      const res = await fetch('/api/about', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (res.ok) {
        setSaved(true)
        router.refresh()
      } else {
        setError(json.error ?? `Server error ${res.status}`)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error — could not reach server')
    } finally {
      setSaving(false)
    }
  }

  const inputClass =
    'w-full bg-[#1A1A18] border border-[#2A2A28] text-[#E8E8E4] text-sm font-sans px-3 py-2.5 rounded focus:outline-none focus:border-[#6B7C9B] transition-colors duration-200 placeholder-[#555550]'
  const labelClass = 'block text-xs tracking-widest uppercase text-[#888882] font-sans mb-1.5'

  const SaveButton = ({ label = 'Save' }: { label?: string }) => (
    <button
      onClick={handleSave}
      disabled={saving}
      className="text-xs tracking-widest uppercase font-sans text-[#111110] bg-[#E8E8E4] hover:bg-[#6B7C9B] hover:text-white px-5 py-2 rounded transition-colors duration-150 cursor-pointer disabled:opacity-50"
    >
      {saving ? 'Saving…' : label}
    </button>
  )

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-lg text-[#E8E8E4] font-sans">About Page</h1>
        <div className="flex items-center gap-3">
          {saved && <span className="text-xs text-green-400 font-sans">Saved</span>}
          {error && <span className="text-xs text-red-400 font-sans max-w-xs truncate" title={error}>{error}</span>}
          <SaveButton />
        </div>
      </div>

      {/* Full error banner — visible when error is long */}
      {error && (
        <div className="mb-6 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded text-xs text-red-400 font-sans break-all">
          <span className="font-medium">Save failed:</span> {error}
        </div>
      )}

      <div className="space-y-6">
        {/* Homepage hero fields */}
        <div className="space-y-4 pb-4 border-b border-[#2A2A28]">
          <p className="text-xs tracking-widest uppercase text-[#888882] font-sans">Homepage Hero</p>
          <div>
            <label htmlFor="heroEyebrow" className={labelClass}>Eyebrow text</label>
            <input
              id="heroEyebrow"
              type="text"
              value={data.heroEyebrow ?? ''}
              onChange={(e) => update('heroEyebrow', e.target.value)}
              className={inputClass}
              placeholder="Architecture Student / Designer"
            />
          </div>
          <div>
            <label htmlFor="heroName" className={labelClass}>Name / Headline</label>
            <input
              id="heroName"
              type="text"
              value={data.heroName ?? ''}
              onChange={(e) => update('heroName', e.target.value)}
              className={inputClass}
              placeholder="Jack Hanan"
            />
          </div>
          <div>
            <label htmlFor="heroTagline" className={labelClass}>Tagline</label>
            <textarea
              id="heroTagline"
              rows={3}
              value={data.heroTagline ?? ''}
              onChange={(e) => update('heroTagline', e.target.value)}
              className={`${inputClass} resize-y`}
              placeholder="Based in Melbourne. Interested in…"
            />
          </div>
        </div>

        {/* Photo */}
        <ImageUploadZone
          currentImage={data.photo}
          slug="profile"
          onUpload={(url) => update('photo', url)}
          label="Profile Photo"
        />

        {/* Resume PDF — stored in Redis separately, served via /api/resume */}
        <PdfUploadZone
          hasResume={!!initial.resumeUrl || initial.resumeUrl === '/api/resume'}
          onUploaded={() => update('resumeUrl', '/api/resume')}
        />

        {/* Bio */}
        <div>
          <label htmlFor="bio" className={labelClass}>Bio</label>
          <textarea
            id="bio"
            rows={6}
            value={data.bio}
            onChange={(e) => update('bio', e.target.value)}
            className={`${inputClass} resize-y`}
            placeholder="Separate paragraphs with a blank line"
          />
        </div>

        {/* Email + LinkedIn + Based In */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="email" className={labelClass}>Email</label>
            <input
              id="email"
              type="email"
              value={data.email}
              onChange={(e) => update('email', e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="linkedin" className={labelClass}>LinkedIn URL</label>
            <input
              id="linkedin"
              type="url"
              value={data.linkedin}
              onChange={(e) => update('linkedin', e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
        <div>
          <label htmlFor="basedIn" className={labelClass}>Based In</label>
          <input
            id="basedIn"
            type="text"
            value={data.basedIn ?? ''}
            onChange={(e) => update('basedIn', e.target.value)}
            placeholder="e.g. Melbourne, Australia"
            className={inputClass}
          />
        </div>

        {/* Skills */}
        <div>
          <label htmlFor="skills" className={labelClass}>Skills (one per line)</label>
          <textarea
            id="skills"
            rows={6}
            value={data.skills.join('\n')}
            onChange={(e) => updateSkills(e.target.value)}
            className={`${inputClass} resize-y`}
          />
        </div>

        {/* Software */}
        <div>
          <label htmlFor="software" className={labelClass}>Software (one per line)</label>
          <textarea
            id="software"
            rows={6}
            value={data.software.join('\n')}
            onChange={(e) => updateSoftware(e.target.value)}
            className={`${inputClass} resize-y`}
          />
        </div>

        {/* Education */}
        <div>
          <p className={labelClass}>Education</p>
          <div className="space-y-3">
            {data.education.map((edu, i) => (
              <div key={i} className="grid grid-cols-[1fr_1fr_auto_auto] gap-2 items-center">
                <input
                  type="text"
                  value={edu.degree}
                  onChange={(e) => updateEducation(i, 'degree', e.target.value)}
                  className={inputClass}
                  placeholder="Degree"
                />
                <input
                  type="text"
                  value={edu.institution}
                  onChange={(e) => updateEducation(i, 'institution', e.target.value)}
                  className={inputClass}
                  placeholder="Institution"
                />
                <input
                  type="text"
                  value={edu.year}
                  onChange={(e) => updateEducation(i, 'year', e.target.value)}
                  className={`${inputClass} w-28`}
                  placeholder="Year(s)"
                />
                <button
                  onClick={() => removeEducation(i)}
                  className="text-red-400/60 hover:text-red-400 text-sm cursor-pointer px-1"
                  aria-label="Remove"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={addEducation}
            className="mt-2 text-xs text-[#6B7C9B] hover:text-[#8A9BB8] font-sans transition-colors cursor-pointer"
          >
            + Add entry
          </button>
        </div>

        {/* Bottom save bar */}
        <div className="flex items-center justify-between pt-6 border-t border-[#2A2A28]">
          <div>
            {saved && <span className="text-xs text-green-400 font-sans">All changes saved</span>}
            {error && <span className="text-xs text-red-400 font-sans">{error}</span>}
            {!saved && !error && <span className="text-xs text-[#555550] font-sans">Unsaved changes</span>}
          </div>
          <SaveButton label="Save Changes" />
        </div>
      </div>
    </div>
  )
}
