const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/v1`;

export interface Plan {
    id: string;
    code: string;
    name: string;
    maxComplexes: number;
    maxUnits: number;
    monthlyPrice: number;
    quarterlyPrice: number;
    yearlyPrice: number;
    status: 'ACTIVE' | 'INACTIVE';
}

/**
 * Fetch sin autenticación, para endpoints públicos (landing, precios).
 * No adjunta Bearer token — a diferencia de lib/api/client.ts, que sí
 * lo hace y está pensado para el panel admin autenticado.
 */
export async function publicApiFetch<TResponse>(path: string): Promise<TResponse> {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        // Los planes cambian poco: revalida cada 5 minutos en vez de en cada request.
        next: { revalidate: 300 },
    });

    if (!response.ok) {
        throw new Error(`Error ${response.status} llamando a ${path}`);
    }

    return response.json() as Promise<TResponse>;
}

export function getActivePlans(): Promise<Plan[]> {
    return publicApiFetch<Plan[]>('/plans');
}