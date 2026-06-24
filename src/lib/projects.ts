import fs from 'fs/promises'
import path from 'path'
import type { Project } from '@/types'

const DATA_PATH = path.join(process.cwd(), 'data', 'projects.json')

export async function readProjects(): Promise<Project[]> {
  try {
    const raw = await fs.readFile(DATA_PATH, 'utf-8')
    const projects: Project[] = JSON.parse(raw)
    return projects.sort((a, b) => a.order - b.order)
  } catch {
    return []
  }
}

export async function writeProjects(projects: Project[]): Promise<void> {
  await fs.writeFile(DATA_PATH, JSON.stringify(projects, null, 2), 'utf-8')
}

export async function getProject(id: string): Promise<Project | null> {
  const projects = await readProjects()
  return projects.find((p) => p.id === id) ?? null
}

export async function getVisibleProjects(): Promise<Project[]> {
  const projects = await readProjects()
  return projects.filter((p) => p.visible)
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const projects = await readProjects()
  return projects.filter((p) => p.visible && p.featured)
}

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}
