import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const { pathname } = req.nextUrl

  // Skip middleware for static files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return res
  }

  // Create Supabase client for auth checking
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          res.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          res.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  let session = null
  try {
    const { data } = await supabase.auth.getSession()
    session = data.session
    console.log('🛡️ Middleware: Session check for', pathname, '→', !!session, session?.user?.email)
  } catch (error) {
    console.error('❌ Middleware: Session error for', pathname, '→', error)
  }

  // Define route types
  const publicRoutes = ['/login', '/plan', '/pricing', '/about', '/test-auth', '/debug-generate']
  const authRoutes = ['/auth'] // Auth callback routes
  const protectedRoutes = ['/record', '/generate', '/history', '/upgrade']

  // Check if current path matches any route type
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

  // Handle root path - redirect based on auth status
  if (pathname === '/') {
    if (session) {
      return NextResponse.redirect(new URL('/record', req.url))
    } else {
      return NextResponse.redirect(new URL('/plan', req.url))
    }
  }

  // Allow public and auth routes without checking session
  if (isPublicRoute || isAuthRoute) {
    return res
  }

  // For protected routes, require authentication
  if (isProtectedRoute) {
    console.log('🔒 Middleware: Protected route check for', pathname, '→ Has session:', !!session)
    if (!session) {
      console.log('❌ Middleware: No session, redirecting', pathname, '→ /login')
      return NextResponse.redirect(new URL('/login', req.url))
    }
    console.log('✅ Middleware: Session OK for protected route:', pathname)
    return res
  }

  // For any other routes, allow them through
  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)']
}
