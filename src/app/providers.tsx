'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
    // useState garantiza una sola instancia de QueryClient por sesión de
    // navegador, sin compartir caché entre requests distintos en el server.
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 30 * 1000,
                        retry: 1,
                    },
                },
            }),
    );

    return <QueryClientProvider client={ queryClient }> { children } </QueryClientProvider>;
}