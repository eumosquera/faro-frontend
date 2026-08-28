import { Building2, Users, KeyRound, Wallet, ShieldCheck } from 'lucide-react';

const FEATURES = [
    {
        icon: Building2,
        title: 'Estructura completa',
        description: 'Torres, bloques y unidades privadas organizados tal como es tu copropiedad.',
    },
    {
        icon: Users,
        title: 'Personas y unidades',
        description: 'Propietarios, residentes y arrendatarios, cada uno vinculado a su unidad.',
    },
    {
        icon: KeyRound,
        title: 'Accesos y permisos',
        description: 'Roles granulares por persona: administrador, portero, consejo, residente.',
    },
    {
        icon: Wallet,
        title: 'Membresías y facturación',
        description: 'Controla qué plan tiene cada copropiedad y su estado de suscripción.',
    },
    {
        icon: ShieldCheck,
        title: 'Seguridad por diseño',
        description: 'Autenticación centralizada y control de qué puede ver y hacer cada rol.',
    },
];

export function FeaturesSection() {
    return (
        <section className="bg-muted/30 px-6 py-20">
            <div className="mx-auto max-w-5xl">
                <h2 className="text-h2 text-center">Todo lo que necesitas para administrar</h2>
                <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {FEATURES.map(({ icon: Icon, title, description }) => (
                        <div key={title} className="flex flex-col items-start gap-3">
                            <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-lg">
                                <Icon className="size-5" />
                            </div>
                            <h3 className="text-h4">{title}</h3>
                            <p className="text-body-s text-muted-foreground">{description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}