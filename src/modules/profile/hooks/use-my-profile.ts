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
    memberships: Array<{
        residentialComplex: { id: string; name: string };
        role: { code: string; name: string };
    }>;
    subscription: {
        id: string;
        billingCycle: 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
        price: number;
        status: 'PENDING_PAYMENT' | 'ACTIVE' | 'GRACE_PERIOD' | 'EXPIRED' | 'CANCELLED';
        startDate: string;
        nextBillingDate: string | null;
        plan: {
            code: string;
            name: string;
            maxComplexes: number;
            maxUnits: number;
        };
    } | null;
}

export function useMyProfile() {
    return useQuery({
        queryKey: ['profile', 'me'],
        queryFn: () => api.get<MyProfile>('/profile/me'),
        staleTime: 5 * 60 * 1000, // no cambia seguido, 5 min está bien
    });
}