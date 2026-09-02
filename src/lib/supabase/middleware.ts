import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// Coincidencia EXACTA (nunca startsWith, o '/' marcaría todo como público)
const PUBLIC_EXACT_PATHS = ['/', '/precios','/sin-acceso'];

// Coincidencia por prefijo: cualquier sub-ruta también es pública
const PUBLIC_PREFIX_PATHS = ['/login', '/auth', '/registro'];

function isPublicPath(pathname: string): boolean {
    return (
        PUBLIC_EXACT_PATHS.includes(pathname) ||
        PUBLIC_PREFIX_PATHS.some((path) => pathname.startsWith(path))
    );
}

/**
 * Refresca el token de Supabase en cada request (Server Components no
 * pueden escribir cookies, así que este refresco tiene que vivir en el
 * middleware) y redirige a /login si no hay sesión en una ruta protegida.
 */
export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({ request });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
                    supabaseResponse = NextResponse.next({ request });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options),
                    );
                },
            },
        },
    );

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user && !isPublicPath(request.nextUrl.pathname)) {
        const loginUrl = request.nextUrl.clone();
        loginUrl.pathname = '/login';
        loginUrl.searchParams.set('redirectTo', request.nextUrl.pathname);
        return NextResponse.redirect(loginUrl);
    }

    return supabaseResponse;
}