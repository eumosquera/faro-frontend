import { Check } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { Plan } from '@/lib/api/public-client';
import type { BillingCycle } from './pricing-section';

const PRICE_FIELD: Record<BillingCycle, keyof Plan> = {
    monthly: 'monthlyPrice',
    quarterly: 'quarterlyPrice',
    yearly: 'yearlyPrice',
};

const CYCLE_LABEL: Record<BillingCycle, string> = {
    monthly: '/mes',
    quarterly: '/trimestre',
    yearly: '/año',
};

const currencyFormatter = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
});

interface PricingCardProps {
    plan: Plan;
    billingCycle: BillingCycle;
    highlighted?: boolean;
}

export function PricingCard({ plan, billingCycle, highlighted }: PricingCardProps) {
    const price = plan[PRICE_FIELD[billingCycle]] as number;

    return (
        <Card className={cn('relative flex flex-col', highlighted && 'border-primary shadow-lg')}>
            {highlighted && (
                <span className="bg-primary text-primary-foreground text-caption absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 font-medium">
                    Más elegido
                </span>
            )}
            <CardHeader>
                <h3 className="text-h4">{plan.name}</h3>
                <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-h2">{currencyFormatter.format(price)}</span>
                    <span className="text-body-s text-muted-foreground">{CYCLE_LABEL[billingCycle]}</span>
                </div>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col justify-between gap-6">
                <ul className="space-y-2">
                    <li className="text-body-s flex items-center gap-2">
                        <Check className="text-success size-4 shrink-0" />
                        Hasta {plan.maxComplexes} {plan.maxComplexes === 1 ? 'copropiedad' : 'copropiedades'}
                    </li>
                    <li className="text-body-s flex items-center gap-2">
                        <Check className="text-success size-4 shrink-0" />
                        Hasta {plan.maxUnits} unidades
                    </li>
                </ul>
                <Button className="w-full" variant={highlighted ? 'default' : 'outline'}>
                    <Link href={`/registro?plan=${plan.code}&ciclo=${billingCycle}`}>Elegir {plan.name}</Link>
                </Button>
            </CardContent>
        </Card>
    );
}