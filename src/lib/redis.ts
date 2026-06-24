import { Redis } from '@upstash/redis'

let _redis: Redis | null = null

export function getRedis(): Redis | null {
  // Return null at build time (no env vars) instead of throwing —
  // callers must handle null and return safe defaults.
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return null
  }
  if (!_redis) {
    _redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  }
  return _redis
}
