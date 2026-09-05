'use client';

import { Building2, Calendar, CreditCard, LayoutGrid } from 'lucide-react';
import { useMyProfile } from '@/modules/profile/hooks/use-my-profile';
import { AddComplexDialog } from '@/modules/profile/components/add-complex-dialog';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const currencyFormatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat('es-CO', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

const CYCLE_LABEL: Record<string, string> = {
  MONTHLY: 'Mensual',
  QUARTERLY: 'Trimestral',
  YEARLY: 'Anual',
};

const STATUS_CONFIG: Record<
  string,
  { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }
> = {
  PENDING_PAYMENT: { label: 'Pendiente de pago', variant: 'outline' },
  ACTIVE: { label: 'Activa', variant: 'default' },
  GRACE_PERIOD: { label: 'Periodo de gracia', variant: 'secondary' },
  EXPIRED: { label: 'Expirada', variant: 'destructive' },
  CANCELLED: { label: 'Cancelada', variant: 'destructive' },
};

export default function SuscripcionPage() {
  const { data: profile, isLoading } = useMyProfile();

  if (isLoading) {
    return <p className="text-body-s text-muted-foreground">Cargando suscripción...</p>;
  }

  if (!profile?.subscription) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-h4">Sin suscripción activa</CardTitle>
          <CardDescription>
            No encontramos ninguna suscripción asociada a tu cuenta.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const { subscription } = profile;
  const statusConfig = STATUS_CONFIG[subscription.status];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-h1">Suscripción</h1>
        <p className="text-body text-muted-foreground">
          Plan y estado de facturación de tu copropiedad
        </p>
      </div>

      {subscription.status === 'PENDING_PAYMENT' && (
        <PendingPaymentNotice />
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <CardTitle className="text-h3">{subscription.plan.name}</CardTitle>
              <CardDescription>
                {currencyFormatter.format(subscription.price)} /{' '}
                {CYCLE_LABEL[subscription.billingCycle].toLowerCase()}
              </CardDescription>
            </div>
            <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <InfoRow
              icon={Building2}
              label="Copropiedades incluidas"
              value={`Hasta ${subscription.plan.maxComplexes}`}
            />
            <InfoRow
              icon={LayoutGrid}
              label="Unidades incluidas"
              value={`Hasta ${subscription.plan.maxUnits}`}
            />
            <InfoRow
              icon={CreditCard}
              label="Ciclo de facturación"
              value={CYCLE_LABEL[subscription.billingCycle]}
            />
            <InfoRow
              icon={Calendar}
              label="Próximo cobro"
              value={
                subscription.nextBillingDate
                  ? dateFormatter.format(new Date(subscription.nextBillingDate))
                  : 'No aplica'
              }
            />
          </CardContent>
        </Card>

        <ComplexesCard profile={profile} />
      </div>
    </div>
  );
}

function ComplexesCard({ profile }: { profile: NonNullable<ReturnType<typeof useMyProfile>['data']> }) {
  const memberships = profile.memberships;
  const maxComplexes = profile.subscription?.plan.maxComplexes ?? 1;
  const canAddMore = memberships.length < maxComplexes;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-h4">Copropiedades</CardTitle>
          <CardDescription>
            {memberships.length} de {maxComplexes} usadas
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="space-y-3">
          {memberships.map((membership) => (
            <li key={membership.residentialComplex.id}>
              <p className="text-body-s font-medium">{membership.residentialComplex.name}</p>
              <p className="text-caption text-muted-foreground">
                Rol: {membership.role.name}
              </p>
            </li>
          ))}
        </ul>

        {canAddMore ? (
          <AddComplexDialog />
        ) : (
          <p className="text-caption text-muted-foreground">
            Alcanzaste el límite de tu plan actual. Actualiza tu plan para agregar más.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Building2;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-md">
        <Icon className="size-4" />
      </div>
      <div>
        <p className="text-caption text-muted-foreground">{label}</p>
        <p className="text-body-s font-medium">{value}</p>
      </div>
    </div>
  );
}

function PendingPaymentNotice() {
  return (
    <Card className="border-warning bg-warning/5">
      <CardContent className="py-4">
        <p className="text-body-s">
          Tu suscripción está <strong>pendiente de pago</strong>. Nos pondremos en contacto
          contigo para confirmar el método de pago y activarla.
        </p>
      </CardContent>
    </Card>
  );
}