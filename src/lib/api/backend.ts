const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/v1`;

if (!API_BASE_URL) {
    throw new Error('NEXT_PUBLIC_API_URL is not configured.');
}

export async function backendFetch(
    path: string,
    accessToken: string,
    init?: RequestInit,
): Promise<Response> {
    return fetch(`${API_BASE_URL}${path}`, {
        ...init,
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            ...init?.headers,
        },
        cache: 'no-store',
    });
}