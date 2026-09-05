import {
    Home,
    Building2,
    KeyRound,
    Settings,
    type LucideIcon,
} from 'lucide-react';

export interface NavLeafItem {
    label: string;
    href: string;
}

export interface NavSection {
    id: string;
    label: string;
    icon: LucideIcon;
    items: NavLeafItem[];
}

export interface NavModule {
    id: string;
    label: string;
    icon: LucideIcon;
    // Módulos sin secciones (ej. Inicio) navegan directo desde el top bar.
    href?: string;
    sections?: NavSection[];
    // Color de acento para la vista previa en la página de Inicio.
    previewColor?: string;
}

export const NAV_MODULES: NavModule[] = [
    {
        id: 'inicio',
        label: 'Inicio',
        icon: Home,
        href: '/inicio',
    },
    {
        id: 'copropiedad',
        label: 'Copropiedad',
        icon: Building2,
        previewColor: '#2563eb',
        sections: [
            {
                id: 'copropiedad',
                label: 'Copropiedad',
                icon: Building2,
                items: [
                    { label: 'Dashboard', href: '/dashboard' },
                    { label: 'Estructura', href: '/estructura' },
                    { label: 'Personas', href: '/personas' },
                ],
            },
        ],
    },
    {
        id: 'administracion',
        label: 'Administración',
        icon: KeyRound,
        previewColor: '#0f766e',
        sections: [
            {
                id: 'administracion',
                label: 'Administración',
                icon: KeyRound,
                items: [
                    { label: 'Accesos y Permisos', href: '/accesos' },
                    { label: 'Suscripción', href: '/suscripcion' },
                ],
            },
        ],
    },
    {
        id: 'sistema',
        label: 'Sistema',
        icon: Settings,
        previewColor: '#6b7280',
        sections: [
            {
                id: 'sistema',
                label: 'Sistema',
                icon: Settings,
                items: [{ label: 'Configuración', href: '/configuracion' }],
            },
        ],
    },
];

export function moduleDefaultHref(mod: NavModule): string {
    return mod.href ?? mod.sections?.[0]?.items[0]?.href ?? '#';
}

export function findActiveModule(pathname: string): NavModule | undefined {
    return NAV_MODULES.find((mod) => {
        if (mod.href) return pathname === mod.href || pathname.startsWith(`${mod.href}/`);
        return mod.sections?.some((section) =>
            section.items.some((item) => pathname.startsWith(item.href)),
        );
    });
}

export function findActiveSection(
    mod: NavModule | undefined,
    pathname: string,
): NavSection | undefined {
    return mod?.sections?.find((section) =>
        section.items.some((item) => pathname.startsWith(item.href)),
    );
}