import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const error = requestUrl.searchParams.get('error')
    const errorDescription = requestUrl.searchParams.get('error_description')

    // Handle error from OAuth provider
    if (error) {
        console.error('OAuth error:', error, errorDescription)
        return NextResponse.redirect(
            new URL(`/login?error=${encodeURIComponent(errorDescription || error)}`, requestUrl.origin)
        )
    }

    if (code) {
        const cookieStore = await cookies()

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get(name: string) {
                        return cookieStore.get(name)?.value
                    },
                    set(name: string, value: string, options: CookieOptions) {
                        cookieStore.set({ name, value, ...options })
                    },
                    remove(name: string, options: CookieOptions) {
                        cookieStore.set({ name, value: '', ...options })
                    },
                },
            }
        )

        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

        if (exchangeError) {
            console.error('Exchange error:', exchangeError)
            return NextResponse.redirect(
                new URL(`/login?error=${encodeURIComponent(exchangeError.message)}`, requestUrl.origin)
            )
        }
    }

    // Check if this is a password reset flow (has type=recovery in URL)
    const type = requestUrl.searchParams.get('type')
    if (type === 'recovery') {
        return NextResponse.redirect(new URL('/login/reset-password', requestUrl.origin))
    }

    // Successful auth - redirect to admin or home
    return NextResponse.redirect(new URL('/admin', requestUrl.origin))
}
