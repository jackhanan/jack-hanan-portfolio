import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { isValidToken } from '@/lib/auth'
import { getRedis } from '@/lib/redis'

// Auth-gated debug endpoint — only accessible when logged in as admin
export async function GET() {
  const token = cookies().get('admin-token')?.value
  if (!isValidToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const hasUrl = !!process.env.UPSTASH_REDIS_REST_URL
  const hasToken = !!process.env.UPSTASH_REDIS_REST_TOKEN
  const redis = getRedis()

  let pingResult: string = 'skipped (env vars missing)'
  if (redis) {
    try {
      const pong = await redis.ping()
      pingResult = String(pong)
    } catch (err) {
      pingResult = `ERROR: ${String(err)}`
    }
  }

  return NextResponse.json({
    UPSTASH_REDIS_REST_URL: hasUrl ? 'SET' : 'MISSING',
    UPSTASH_REDIS_REST_TOKEN: hasToken ? 'SET' : 'MISSING',
    redis_client: redis ? 'initialized' : 'null (env vars absent)',
    redis_ping: pingResult,
    node_env: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  })
}
