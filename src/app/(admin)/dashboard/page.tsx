import { Building2, Users, Wallet, KeyRound } from 'lucide-react';
import { KpiCard } from '@/components/layout/kpi-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Datos de ejemplo — reemplazar por hooks de TanStack Query (ver
// use-access-roles.ts) contra los endpoints reales del backend.
const KPIS = [
    { label: 'Unidades registradas', value: '128', icon: Building2, trend: { value: '+4 este mes', direction: 'up' as const } },
    { label: 'Personas activas', value: '312', icon: Users, trend: { value: '+18 este mes', direction: 'up' as const } },
    { label: 'Cuentas de acceso', value: '96', icon: KeyRound, trend: { value: 'Sin cambios', direction: 'neutral' as const } },
    { label: 'Suscripción', value: 'Plan Pro', icon: Wallet, trend: { value: 'Activa', direction: 'up' as const } },
];

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-h1">Dashboard</h1>
                <p className="text-body text-muted-foreground">Resumen general de la copropiedad</p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {KPIS.map((kpi) => (
                    <KpiCard key={kpi.label} {...kpi} />
                ))}
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-h4">Actividad reciente</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-body-s text-muted-foreground">
                            Aquí va el widget de Timeline (DS-COMPX-002) una vez conectemos el módulo
                            correspondiente del backend.
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-h4">Notificaciones</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-body-s text-muted-foreground">Sin notificaciones pendientes.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}