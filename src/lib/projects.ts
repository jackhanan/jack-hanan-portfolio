import { redis } from './redis'
import type { Project } from '@/types'
import defaultProjects from '../../data/projects.json'

const KEY = 'projects'

async function getOrSeed(): Promise<Project[]> {
  const data = await redis.get<Project[]>(KEY)
  if (data) return data

  // First run — seed Redis from the bundled JSON defaults
  await redis.set(KEY, defaultProjects)
  return defaultProjects as Project[]
}

export async function readProjects(): Promise<Project[]> {
  const projects = await getOrSeed()
  return [...projects].sort((a, b) => a.order - b.order)
}

export async function writeProjects(projects: Project[]): Promise<void> {
  await redis.set(KEY, projects)
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
