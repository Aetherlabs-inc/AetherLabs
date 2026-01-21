
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
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
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

    const { pathname } = request.nextUrl

    console.log('Middleware Debug:', {
        pathname,
        hasUser: !!user,
        userId: user?.id
    })

    // Public routes that don't require authentication
   // const publicRoutes = ['/', '/login', '/signup']
    //const isPublicRoute = publicRoutes.includes(pathname)



    // Protected routes that require authentication
    const protectedRoutes = ['/dashboard', '/artworks', '/collections', '/exhibitions', '/certificates']
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

    // If user is not authenticated and trying to access protected routes
    if (!user && isProtectedRoute) {
        console.log('Middleware - Redirecting to login from protected route:', pathname)
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url)
    }

    // Handle root path redirect
    if (pathname === '/') {
        if (!user) {
            console.log('Middleware - Redirecting unauthenticated user from root to login')
            const url = request.nextUrl.clone()
            url.pathname = '/login'
            return NextResponse.redirect(url)
        } else {
            console.log('Middleware - Redirecting authenticated user from root to dashboard')
            const url = request.nextUrl.clone()
            url.pathname = '/dashboard'
            return NextResponse.redirect(url)
        }
    }

    // If user is authenticated and trying to access login/signup, redirect to dashboard
    if (user && (pathname === '/login' || pathname === '/signup')) {
        console.log('Middleware - Redirecting authenticated user to dashboard')
        const url = request.nextUrl.clone()
        url.pathname = '/dashboard'
        return NextResponse.redirect(url)
    }

    return supabaseResponse
}