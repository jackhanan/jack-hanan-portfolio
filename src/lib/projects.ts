import { getRedis } from './redis'
import type { Project } from '@/types'
import defaultProjects from '../../data/projects.json'

const KEY = 'projects'

async function getOrSeed(): Promise<Project[]> {
  const redis = getRedis()
  if (!redis) return defaultProjects as Project[]

  try {
    const data = await redis.get<Project[]>(KEY)
    if (data) return data
    // First run — seed Redis from bundled defaults
    await redis.set(KEY, defaultProjects)
    return defaultProjects as Project[]
  } catch {
    return defaultProjects as Project[]
  }
}

export async function readProjects(): Promise<Project[]> {
  try {
    const projects = await getOrSeed()
    return [...projects].sort((a, b) => a.order - b.order)
  } catch {
    return []
  }
}

export async function writeProjects(projects: Project[]): Promise<void> {
  const redis = getRedis()
  if (!redis) throw new Error('Redis is not configured')
  await redis.set(KEY, projects)
}

export async function getProject(id: string): Promise<Project | null> {
  try {
    const projects = await readProjects()
    return projects.find((p) => p.id === id) ?? null
  } catch {
    return null
  }
}

export async function getVisibleProjects(): Promise<Project[]> {
  try {
    const projects = await readProjects()
    return projects.filter((p) => p.visible)
  } catch {
    return []
  }
}

export async function getFeaturedProjects(): Promise<Project[]> {
  try {
    const projects = await readProjects()
    return projects.filter((p) => p.visible && p.featured)
  } catch {
    return []
  }
}

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}
