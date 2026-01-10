import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    // createServerClient from @supabase/ssr handles all the cookie logic for us
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        request.cookies.set(name, value)
                    })
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // IMPORTANT: You MUST call getUser in middleware to refresh the session
    const {
        data: { user },
    } = await supabase.auth.getUser()

    const { pathname } = request.nextUrl

    console.log(`Middleware tracing: ${pathname} - User: ${user ? user.id : 'None'}`)

    // Protected routes: /dashboard and its sub-routes
    if (pathname.startsWith('/dashboard')) {
        if (!user) {
            console.log(`Redirecting unauthorized access to /dashboard to /login`)
            const url = request.nextUrl.clone()
            url.pathname = '/login'
            url.searchParams.set('next', pathname)
            return NextResponse.redirect(url)
        }
    }

    // Redirect authenticated users away from login/register pages
    if (pathname === '/login' || pathname === '/register') {
        if (user) {
            console.log(`Redirecting authenticated user away from login/register to /dashboard`)
            const url = request.nextUrl.clone()
            url.pathname = '/dashboard'
            return NextResponse.redirect(url)
        }
    }

    return response
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
