import { createClient } from '@/lib/supabase/client';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/v1`;

export class ApiError extends Error {
    constructor(
        public status: number,
        message: string,
        public details?: unknown,
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

type RequestOptions = Omit<RequestInit, 'body'> & {
    body?: unknown;
};

/**
 * Fetcher central hacia faro-backend. Toma la sesión activa de Supabase
 * del navegador, adjunta el access_token como Bearer y parsea la
 * respuesta (o el error) como JSON.
 *
 */
export async function apiFetch<TResponse>(
    path: string,
    { body, headers, ...options }: RequestOptions = {},
): Promise<TResponse> {
    const supabase = createClient();
    const {
        data: { session },
    } = await supabase.auth.getSession();

    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
            ...headers,
        },
        body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        throw new ApiError(
            response.status,
            errorBody?.message ?? `Error ${response.status} llamando a ${path}`,
            errorBody,
        );
    }

    // Algunos endpoints (ej. activate/deactivate) responden 204 sin cuerpo.
    if (response.status === 204) {
        return undefined as TResponse;
    }

    return response.json() as Promise<TResponse>;
}

export const api = {
    get: <T>(path: string, options?: RequestOptions) =>
        apiFetch<T>(path, { ...options, method: 'GET' }),
    post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
        apiFetch<T>(path, { ...options, method: 'POST', body }),
    patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
        apiFetch<T>(path, { ...options, method: 'PATCH', body }),
    delete: <T>(path: string, options?: RequestOptions) =>
        apiFetch<T>(path, { ...options, method: 'DELETE' }),
};