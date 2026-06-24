import fs from 'fs/promises'
import path from 'path'
import type { AboutData } from '@/types'

const DATA_DIR = process.env.DATA_DIR ?? path.join(process.cwd(), 'data')
const DATA_PATH = path.join(DATA_DIR, 'about.json')
const DEFAULTS_PATH = path.join(process.cwd(), 'data', 'about.json')

async function ensureDataFile(): Promise<void> {
  try {
    await fs.access(DATA_PATH)
  } catch {
    console.log(`[about] ${DATA_PATH} not found, seeding from ${DEFAULTS_PATH}`)
    await fs.mkdir(DATA_DIR, { recursive: true })
    try {
      const defaults = await fs.readFile(DEFAULTS_PATH, 'utf-8')
      await fs.writeFile(DATA_PATH, defaults, 'utf-8')
      console.log(`[about] Seeded ${DATA_PATH}`)
    } catch {
      console.log('[about] No defaults found, writing empty object')
      await fs.writeFile(DATA_PATH, '{}', 'utf-8')
    }
  }
}

export async function readAbout(): Promise<AboutData> {
  await ensureDataFile()
  console.log(`[about] Reading from ${DATA_PATH}`)
  const raw = await fs.readFile(DATA_PATH, 'utf-8')
  return JSON.parse(raw) as AboutData
}

export async function writeAbout(data: AboutData): Promise<void> {
  await ensureDataFile()
  console.log(`[about] Writing to ${DATA_PATH}`)
  await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2), 'utf-8')
  console.log(`[about] Write complete`)
}
