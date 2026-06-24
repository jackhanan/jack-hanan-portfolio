import fs from 'fs/promises'
import path from 'path'
import type { Project } from '@/types'

// On Railway: set DATA_DIR=/data (the mounted volume path)
// Locally: falls back to the repo's data/ directory
const DATA_DIR = process.env.DATA_DIR ?? path.join(process.cwd(), 'data')
const DATA_PATH = path.join(DATA_DIR, 'projects.json')
// Bundled defaults shipped with the repo — used to seed the volume on first run
const DEFAULTS_PATH = path.join(process.cwd(), 'data', 'projects.json')

async function ensureDataFile(): Promise<void> {
  try {
    await fs.access(DATA_PATH)
  } catch {
    // Volume exists but file hasn't been seeded yet — copy from bundled defaults
    console.log(`[projects] ${DATA_PATH} not found, seeding from ${DEFAULTS_PATH}`)
    await fs.mkdir(DATA_DIR, { recursive: true })
    try {
      const defaults = await fs.readFile(DEFAULTS_PATH, 'utf-8')
      await fs.writeFile(DATA_PATH, defaults, 'utf-8')
      console.log(`[projects] Seeded ${DATA_PATH}`)
    } catch {
      console.log('[projects] No defaults found, writing empty array')
      await fs.writeFile(DATA_PATH, '[]', 'utf-8')
    }
  }
}

export async function readProjects(): Promise<Project[]> {
  await ensureDataFile()
  try {
    const raw = await fs.readFile(DATA_PATH, 'utf-8')
    console.log(`[projects] Reading from ${DATA_PATH}`)
    const projects: Project[] = JSON.parse(raw)
    return projects.sort((a, b) => a.order - b.order)
  } catch (err) {
    console.error(`[projects] Failed to read ${DATA_PATH}:`, err)
    return []
  }
}

export async function writeProjects(projects: Project[]): Promise<void> {
  await ensureDataFile()
  console.log(`[projects] Writing ${projects.length} projects to ${DATA_PATH}`)
  await fs.writeFile(DATA_PATH, JSON.stringify(projects, null, 2), 'utf-8')
  console.log(`[projects] Write complete`)
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
