import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/app/api/client';

interface AddResidentialComplexInput {
    name: string;
    address: string;
    city: string;
}

interface AddResidentialComplexResult {
    residentialComplexId: string;
    membershipId: string;
}

export function useAddResidentialComplex() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (input: AddResidentialComplexInput) =>
            api.post<AddResidentialComplexResult>('/profile/complexes', input),
        onSuccess: () => {
            // El sidebar, el header y la página de suscripción leen todos de
            // useMyProfile — invalidar una vez actualiza los tres.
            queryClient.invalidateQueries({ queryKey: ['profile', 'me'] });
        },
    });
}