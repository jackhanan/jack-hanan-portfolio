import { getRedis } from './redis'
import type { AboutData } from '@/types'
import defaultAbout from '../../data/about.json'

const KEY = 'about'

const EMPTY_ABOUT: AboutData = {
  bio: '',
  photo: '',
  skills: [],
  software: [],
  education: [],
  email: '',
  linkedin: '',
  resumeUrl: '/resume.pdf',
}

async function getOrSeed(): Promise<AboutData> {
  const redis = getRedis()
  if (!redis) return defaultAbout as AboutData

  try {
    const data = await redis.get<AboutData>(KEY)
    if (data) return data
    // First run — seed Redis from bundled defaults
    await redis.set(KEY, defaultAbout)
    return defaultAbout as AboutData
  } catch {
    return defaultAbout as AboutData
  }
}

export async function readAbout(): Promise<AboutData> {
  try {
    return await getOrSeed()
  } catch {
    return EMPTY_ABOUT
  }
}

export async function writeAbout(data: AboutData): Promise<void> {
  const redis = getRedis()
  if (!redis) throw new Error('Redis is not configured')
  await redis.set(KEY, data)
}
