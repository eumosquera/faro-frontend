import { createBrowserClient } from '@supabase/ssr';

/**
 * Cliente de Supabase para usar dentro de Client Components ('use client').
 * Maneja la sesión en localStorage/cookies del navegador automáticamente.
 */
export function createClient() {
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
}