import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Login page and API routes are always accessible
  if (pathname === '/admin' || pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  if (pathname.startsWith('/admin/')) {
    const token = request.cookies.get('admin-token')?.value
    const expected = Buffer.from(process.env.ADMIN_PASSWORD ?? '').toString('base64')

    if (!token || token !== expected) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
