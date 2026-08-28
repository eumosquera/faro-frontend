'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { Plan } from '@/lib/api/public-client';
import { PricingCard } from './pricing-card';

export type BillingCycle = 'monthly' | 'quarterly' | 'yearly';

const CYCLES: { value: BillingCycle; label: string }[] = [
    { value: 'monthly', label: 'Mensual' },
    { value: 'quarterly', label: 'Trimestral' },
    { value: 'yearly', label: 'Anual' },
];

interface PricingSectionProps {
    plans: Plan[];
}

export function PricingSection({ plans }: PricingSectionProps) {
    const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');

    // El plan de en medio (Profesional) es el destacado por defecto.
    const highlightedIndex = Math.floor(plans.length / 2);

    return (
        <section id="planes" className="px-6 py-20">
            <div className="mx-auto max-w-5xl">
                <div className="text-center">
                    <h2 className="text-h2">Un plan para cada tamaño de copropiedad</h2>
                    <p className="text-body text-muted-foreground mt-2">
                        Sin letra pequeña. Cambia o cancela cuando quieras.
                    </p>
                </div>

                <div className="bg-muted mt-8 flex w-fit gap-1 rounded-lg p-1 mx-auto">
                    {CYCLES.map((cycle) => (
                        <button
                            key={cycle.value}
                            type="button"
                            onClick={() => setBillingCycle(cycle.value)}
                            className={cn(
                                'text-body-s rounded-md px-4 py-1.5 font-medium transition-colors',
                                billingCycle === cycle.value
                                    ? 'bg-background text-foreground shadow-sm'
                                    : 'text-muted-foreground hover:text-foreground',
                            )}
                        >
                            {cycle.label}
                        </button>
                    ))}
                </div>

                <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {plans.map((plan, index) => (
                        <PricingCard
                            key={plan.id}
                            plan={plan}
                            billingCycle={billingCycle}
                            highlighted={index === highlightedIndex}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}