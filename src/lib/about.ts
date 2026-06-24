import fs from 'fs/promises'
import path from 'path'
import type { AboutData } from '@/types'

const DATA_PATH = path.join(process.cwd(), 'data', 'about.json')

export async function readAbout(): Promise<AboutData> {
  const raw = await fs.readFile(DATA_PATH, 'utf-8')
  return JSON.parse(raw) as AboutData
}

export async function writeAbout(data: AboutData): Promise<void> {
  await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2), 'utf-8')
}
