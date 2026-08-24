import { useQuery } from '@tanstack/react-query';
import { api } from '@/app/api/client';

interface AccessRole {
    id: string;
    code: string;
    name: string;
    description: string;
    status: 'ACTIVE' | 'INACTIVE';
}

/**
 * Ejemplo de cómo conectar un módulo del backend (access-roles) siguiendo
 * el mismo patrón para el resto: people, structure, membership, subscription.
 */
export function useAccessRoles() {
    return useQuery({
        queryKey: ['access-roles'],
        queryFn: () => api.get<AccessRole[]>('/access-roles'),
    });
}