const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/v1`;

export type BackendBillingCycle = 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
export type BackendIdentificationType = 'CC' | 'TI' | 'CE' | 'PA' | 'NIT' | 'PPT' | 'PEP';

export interface RegisterTenantPayload {
    externalAuthId: string;
    person: {
        identificationType: BackendIdentificationType;
        identificationNumber: string;
        fullName: string;
        email: string;
        phone?: string;
    };
    residentialComplex: {
        name: string;
        address: string;
        city: string;
    };
    planCode: string;
    billingCycle: BackendBillingCycle;
}

export interface RegisterTenantResult {
    personId: string;
    residentialComplexId: string;
    accessAccountId: string;
    subscriptionId: string;
    membershipId: string;
}

export class OnboardingError extends Error {
    constructor(
        public code: string,
        message: string,
    ) {
        super(message);
        this.name = 'OnboardingError';
    }
}

/**
 * Llama a POST /onboarding/register-tenant. Deliberadamente NO usa el
 * fetcher autenticado (lib/api/client.ts) porque en este punto el usuario
 * puede no tener todavía una sesión válida (si Supabase requiere
 * confirmación de correo, signUp() no devuelve sesión).
 */
export async function registerTenant(
    payload: RegisterTenantPayload,
): Promise<RegisterTenantResult> {
    const response = await fetch(`${API_BASE_URL}/onboarding/register-tenant`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    const body = await response.json().catch(() => null);

    if (!response.ok) {
        throw new OnboardingError(
            body?.code ?? 'UNKNOWN_ERROR',
            body?.message ?? 'No se pudo completar el registro. Intenta de nuevo.',
        );
    }

    return body as RegisterTenantResult;
}