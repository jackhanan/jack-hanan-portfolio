import { Redis } from '@upstash/redis'

// Lazily initialised so the client is never created at build time —
// only on the first actual request when env vars are available.
let _redis: Redis | null = null

export function getRedis(): Redis {
  if (!_redis) {
    const url = process.env.UPSTASH_REDIS_REST_URL
    const token = process.env.UPSTASH_REDIS_REST_TOKEN

    if (!url || !token) {
      throw new Error(
        'Missing Upstash env vars: UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN must be set.'
      )
    }

    _redis = new Redis({ url, token })
  }
  return _redis
}
