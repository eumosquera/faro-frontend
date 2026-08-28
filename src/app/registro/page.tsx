import { Suspense } from 'react';
import { RegistrationForm } from '@/components/onboarding/registration-form';

export default function RegistroPage() {
    return (
        <div className="bg-muted/30 flex min-h-screen items-center justify-center p-4 py-12">
            <Suspense fallback={null}>
                <RegistrationForm />
            </Suspense>
        </div>
    );
}