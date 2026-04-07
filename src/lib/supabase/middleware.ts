import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isAdmin = user?.user_metadata?.role === 'admin' || user?.email === 'lenzify.in@gmail.com';
  const pathname = request.nextUrl.pathname;

  // 1. SESSION TIMEOUT: Administrative Inactivity Guard (30 Minutes)
  if (isAdmin && pathname.startsWith('/admin')) {
    const lastActive = request.cookies.get('admin-last-active')?.value;
    const now = Date.now();
    const thirtyMinutes = 30 * 60 * 1000;

    if (lastActive && (now - parseInt(lastActive)) > thirtyMinutes) {
      // Invalidate session and redirect to login
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      url.searchParams.set('error', 'Session expired due to inactivity. Please re-authenticate.');
      
      const response = NextResponse.redirect(url);
      response.cookies.delete('sb-access-token');
      response.cookies.delete('admin-last-active');
      return response;
    }
    
    // Update heartbeat timestamp
    supabaseResponse.cookies.set('admin-last-active', now.toString(), {
      path: '/',
      maxAge: 60 * 60 * 24, // Persistent for 24h but checked for 30m gap
      httpOnly: true,
      sameSite: 'lax'
    });
  }

  // 2. ADMIN ISOLATION: Prevent admins from accessing the storefront
  const isStorefrontPath = !pathname.startsWith('/admin') && 
                           !pathname.startsWith('/api') && 
                           !pathname.startsWith('/_next') && 
                           !pathname.includes('.') && // Skip static files with extensions
                           pathname !== '/auth/logout';

  if (isAdmin && isStorefrontPath) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin/dashboard';
    return NextResponse.redirect(url);
  }

  // 3. SECURE ACCESS: Protect Admin routes
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }
    
    if (!isAdmin) {
      const url = request.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
  }

  // 4. CUSTOMER ACCESS: Protect Dashboard routes
  if (pathname.startsWith('/dashboard')) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = '/auth/login';
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse
}
