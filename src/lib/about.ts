import { getRedis } from './redis'
import type { AboutData } from '@/types'
import defaultAbout from '../../data/about.json'

const KEY = 'about'

const EMPTY_ABOUT: AboutData = {
  heroEyebrow: '',
  heroName: '',
  heroTagline: '',
  bio: '',
  photo: '',
  skills: [],
  software: [],
  education: [],
  basedIn: '',
  email: '',
  linkedin: '',
  resumeUrl: '/resume.pdf',
}

// Backfill new hero fields for data stored before they were added.
function normalise(d: AboutData): AboutData {
  return {
    ...d,
    heroEyebrow: d.heroEyebrow ?? 'Architecture Student / Designer',
    heroName: d.heroName ?? 'Jack Hanan',
    heroTagline: d.heroTagline ?? '',
    basedIn: d.basedIn ?? '',
    resumeUrl: d.resumeUrl ?? '',
  }
}

async function getOrSeed(): Promise<AboutData> {
  const redis = getRedis()
  if (!redis) return normalise(defaultAbout as AboutData)

  try {
    const data = await redis.get<AboutData>(KEY)
    if (data) return normalise(data)
    await redis.set(KEY, defaultAbout)
    return normalise(defaultAbout as AboutData)
  } catch {
    return normalise(defaultAbout as AboutData)
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
