'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import Toggle from '@/components/ui/Toggle'
import type { Project } from '@/types'

interface Props {
  initial: Project[]
}

export default function DashboardClient({ initial }: Props) {
  const [projects, setProjects] = useState<Project[]>(initial)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleDragEnd(result: DropResult) {
    if (!result.destination) return
    const reordered = Array.from(projects)
    const [moved] = reordered.splice(result.source.index, 1)
    reordered.splice(result.destination.index, 0, moved)

    const withOrder = reordered.map((p, i) => ({ ...p, order: i }))
    setProjects(withOrder)
    setError(null)

    setSaving(true)
    try {
      const res = await fetch('/api/projects', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(withOrder),
      })
      if (!res.ok) {
        const json = await res.json()
        setError(json.error ?? `Reorder failed: ${res.status}`)
      } else {
        router.refresh()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error')
    } finally {
      setSaving(false)
    }
  }

  async function toggleVisibility(id: string, visible: boolean) {
    const updated = projects.map((p) => p.id === id ? { ...p, visible } : p)
    setProjects(updated)
    setError(null)
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visible }),
      })
      if (!res.ok) {
        const json = await res.json()
        setError(json.error ?? `Toggle failed: ${res.status}`)
        // Revert optimistic update
        setProjects(projects)
      } else {
        router.refresh()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error')
      setProjects(projects)
    }
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-lg text-[#E8E8E4] font-sans">Projects</h1>
        <div className="flex items-center gap-4">
          {saving && <span className="text-xs text-[#888882] font-sans">Saving order…</span>}
          {error && <span className="text-xs text-red-400 font-sans max-w-xs truncate" title={error}>{error}</span>}
          <Link
            href="/admin/projects/new"
            className="text-xs tracking-widest uppercase font-sans text-[#111110] bg-[#E8E8E4] hover:bg-[#6B7C9B] hover:text-white px-5 py-2 rounded transition-colors duration-150"
          >
            + New Project
          </Link>
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="projects">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="space-y-2"
            >
              {projects.map((project, index) => (
                <Draggable key={project.id} draggableId={project.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`flex items-center gap-4 bg-[#1A1A18] border rounded px-4 py-3 transition-colors duration-150 ${
                        snapshot.isDragging ? 'border-[#6B7C9B] shadow-lg' : 'border-[#2A2A28]'
                      }`}
                    >
                      {/* Drag handle */}
                      <div
                        {...provided.dragHandleProps}
                        className="text-[#444440] hover:text-[#888882] cursor-grab transition-colors duration-150"
                        aria-label="Drag to reorder"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                          <circle cx="5" cy="4" r="1.2" fill="currentColor" />
                          <circle cx="11" cy="4" r="1.2" fill="currentColor" />
                          <circle cx="5" cy="8" r="1.2" fill="currentColor" />
                          <circle cx="11" cy="8" r="1.2" fill="currentColor" />
                          <circle cx="5" cy="12" r="1.2" fill="currentColor" />
                          <circle cx="11" cy="12" r="1.2" fill="currentColor" />
                        </svg>
                      </div>

                      {/* Thumbnail */}
                      <div className="w-14 h-10 bg-[#222220] rounded overflow-hidden shrink-0 relative">
                        {project.heroImage && (
                          <Image
                            src={project.heroImage}
                            alt={project.title}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>

                      {/* Title and meta */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-[#E8E8E4] font-sans truncate">{project.title}</p>
                        <p className="text-xs text-[#888882] font-sans mt-0.5">
                          {project.year} · {project.category}
                        </p>
                      </div>

                      {/* Visibility toggle */}
                      <Toggle
                        checked={project.visible}
                        onChange={(v) => toggleVisibility(project.id, v)}
                        id={`visible-${project.id}`}
                        label="Visible on site"
                      />

                      {/* Edit link */}
                      <Link
                        href={`/admin/projects/${project.id}`}
                        className="text-xs text-[#888882] hover:text-[#E8E8E4] font-sans px-3 py-1.5 border border-[#333330] hover:border-[#555550] rounded transition-colors duration-150 shrink-0"
                      >
                        Edit
                      </Link>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {projects.length === 0 && (
        <div className="text-center py-16">
          <p className="text-sm text-[#555550] font-sans">No projects yet.</p>
          <Link href="/admin/projects/new" className="text-xs text-[#6B7C9B] hover:text-[#8A9BB8] font-sans mt-2 inline-block">
            Create your first project →
          </Link>
        </div>
      )}
    </div>
  )
}
