'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMyProfile } from '@/modules/profile/hooks/use-my-profile';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { NAV_MODULES, moduleDefaultHref, type NavModule } from '@/components/layout/nav-config';

function getInitials(fullName: string): string {
    return fullName
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join('');
}

// Módulos que sí tienen contenido para previsualizar (Inicio mismo no aplica).
const PREVIEWABLE_MODULES = NAV_MODULES.filter((mod) => mod.sections);

export default function InicioPage() {
    const { data: profile } = useMyProfile();
    const [selectedModuleId, setSelectedModuleId] = useState(PREVIEWABLE_MODULES[0]?.id);
    const [expanded, setExpanded] = useState(true);

    const selectedModule = PREVIEWABLE_MODULES.find((mod) => mod.id === selectedModuleId);

    return (
        <div className="space-y-6">
            {/* Banner de bienvenida */}
            <div className="bg-sidebar text-sidebar-foreground overflow-hidden rounded-lg">
                <div className={cn('flex items-center gap-6 p-6', !expanded && 'py-4')}>
                    {expanded && (
                        <Avatar className="size-16">
                            <AvatarFallback className="text-h4 bg-sidebar-accent">
                                {profile ? getInitials(profile.person.fullName) : '·'}
                            </AvatarFallback>
                        </Avatar>
                    )}

                    <div className="flex-1">
                        {expanded && <p className="text-body-s text-sidebar-foreground/70">Bienvenido(a)</p>}
                        <p className={expanded ? 'text-h3' : 'text-body font-medium'}>
                            {profile?.person.fullName ?? '...'}
                        </p>
                    </div>

                    <button
                        onClick={() => setExpanded((v) => !v)}
                        className="text-sidebar-foreground/60 hover:text-sidebar-foreground shrink-0"
                        title={expanded ? 'Colapsar' : 'Expandir'}
                    >
                        <ChevronsUpDown className="size-4" />
                    </button>
                </div>

                <div className="flex gap-2 overflow-x-auto px-6 pb-4">
                    {NAV_MODULES.map((mod) => {
                        const Icon = mod.icon;
                        const isSelected = mod.id === selectedModuleId;

                        return (
                            <button
                                key={mod.id}
                                onClick={() => mod.sections && setSelectedModuleId(mod.id)}
                                className={cn(
                                    'text-caption flex shrink-0 flex-col items-center gap-1 rounded-md px-4 py-2 transition-colors',
                                    isSelected
                                        ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                                        : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50',
                                )}
                            >
                                <Icon className="size-5" />
                                {mod.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Vista previa del módulo seleccionado */}
            {expanded && selectedModule && <ModulePreview module={selectedModule} />}
        </div>
    );
}

function ModulePreview({ module: mod }: { module: NavModule }) {
    const color = mod.previewColor ?? '#2563eb';

    return (
        <div
            className="relative overflow-hidden rounded-lg p-6 text-white"
            style={{ backgroundColor: color }}
        >
            <h2 className="text-h3">{mod.label}</h2>
            <p className="text-body-s mt-1 max-w-md text-white/80">
                Accede rápido a las secciones de {mod.label.toLowerCase()}.
            </p>

            <div className="mt-6 flex flex-wrap gap-6">
                {mod.sections?.flatMap((section) =>
                    section.items.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex flex-col items-center gap-2 text-center"
                        >
                            <div className="flex size-14 items-center justify-center rounded-lg bg-white/15 hover:bg-white/25">
                                <section.icon className="size-6" />
                            </div>
                            <span className="text-caption max-w-20">{item.label}</span>
                        </Link>
                    )),
                )}
            </div>
        </div>
    );
}