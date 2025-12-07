import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    // Check for WP token
    const token = request.cookies.get('wp_token')?.value;

    const path = request.nextUrl.pathname;
    const isProtectedAdmin = path.startsWith('/admin');
    const isProtectedEditor = path.startsWith('/editor');

    // 1. If trying to access protected route without token -> redirect to login
    if ((isProtectedAdmin || isProtectedEditor) && !token) {
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }

    // 2. If trying to access admin route with token -> (Ideally check role inside token)
    // For now, we assume if you have a verified token (checked by API on mutation), you can access.
    // To strictly protect Admin UI, we should decode the JWT here.
    // Given the constraints and desire for simplicity, we'll allow access if token exists, 
    // and rely on client-side AuthContext to redirect if role is insufficient ("checkPermission").

    return response;
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
