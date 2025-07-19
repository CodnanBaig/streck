import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // For now, let the client-side handle authentication
  // This prevents server-side redirects that can cause issues
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*'
  ]
} 