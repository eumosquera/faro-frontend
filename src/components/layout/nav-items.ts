import {
    LayoutDashboard,
    Users,
    Building2,
    KeyRound,
    Wallet,
    Settings,
    type LucideIcon,
} from 'lucide-react';

export interface NavItem {
    label: string;
    href: string;
    icon: LucideIcon;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

// Refleja 1:1 los módulos del backend (structure, people, access, membership, subscription)
export const NAV_GROUPS: NavGroup[] = [
    {
        title: 'General',
        items: [{ label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard }],
    },
    {
        title: 'Copropiedad',
        items: [
            { label: 'Estructura', href: '/estructura', icon: Building2 },
            { label: 'Personas', href: '/personas', icon: Users },
        ],
    },
    {
        title: 'Administración',
        items: [
            { label: 'Accesos y Permisos', href: '/accesos', icon: KeyRound },
            { label: 'Suscripción', href: '/suscripcion', icon: Wallet },
        ],
    },
    {
        title: 'Sistema',
        items: [{ label: 'Configuración', href: '/configuracion', icon: Settings }],
    },
];