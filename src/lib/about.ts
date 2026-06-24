import { redis } from './redis'
import type { AboutData } from '@/types'
import defaultAbout from '../../data/about.json'

const KEY = 'about'

async function getOrSeed(): Promise<AboutData> {
  const data = await redis.get<AboutData>(KEY)
  if (data) return data

  // First run — seed Redis from the bundled JSON defaults
  await redis.set(KEY, defaultAbout)
  return defaultAbout as AboutData
}

export async function readAbout(): Promise<AboutData> {
  return getOrSeed()
}

export async function writeAbout(data: AboutData): Promise<void> {
  await redis.set(KEY, data)
}
