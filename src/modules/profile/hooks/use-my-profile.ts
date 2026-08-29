import { useQuery } from '@tanstack/react-query';
import { api } from '@/app/api/client';

export interface MyProfile {
    person: {
        id: string;
        fullName: string;
        email: string | null;
    };
    primaryMembership: {
        residentialComplex: { id: string; name: string };
        role: { code: string; name: string };
    } | null;
}

export function useMyProfile() {
    return useQuery({
        queryKey: ['profile', 'me'],
        queryFn: () => api.get<MyProfile>('/profile/me'),
        staleTime: 5 * 60 * 1000, // no cambia seguido, 5 min está bien
    });
}