import { backendFetch } from '@/lib/api/backend';

import type { ApplicationAccess } from '../types/application-access';

export async function getApplicationAccess(
    accessToken: string,
): Promise<ApplicationAccess> {
    const response = await backendFetch(
        '/profile/me/access',
        accessToken,
    );

    if (!response.ok) {
        throw new Error(
            `Failed to resolve application access: ${response.status}`,
        );
    }

    return response.json() as Promise<ApplicationAccess>;
}