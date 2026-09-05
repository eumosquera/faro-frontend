'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LogoutButton } from '@/components/auth/logout-button';
import { useMyProfile } from '@/modules/profile/hooks/use-my-profile';
import { NAV_MODULES, findActiveModule, moduleDefaultHref } from './nav-config';

function getInitials(fullName: string): string {
  return fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

interface TopModuleBarProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export function TopModuleBar({ sidebarOpen, onToggleSidebar }: TopModuleBarProps) {
  const pathname = usePathname();
  const activeModule = findActiveModule(pathname);
  const { data: profile, isLoading } = useMyProfile();

  return (
    <header className="bg-sidebar text-sidebar-foreground flex h-16 shrink-0 items-center gap-4 border-b border-sidebar-border px-4">
      <button
        onClick={onToggleSidebar}
        className="text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground shrink-0 rounded-md p-2"
        title={sidebarOpen ? 'Ocultar menú' : 'Mostrar menú'}
      >
        {sidebarOpen ? (
          <PanelLeftClose className="size-5" />
        ) : (
          <PanelLeftOpen className="size-5" />
        )}
      </button>

      {/* min-w fijo: evita que el nombre del conjunto empuje el resto al
          pasar de "Faro" (placeholder) al nombre real una vez carga. */}
      <span
        className="text-h4 min-w-[140px] shrink-0 truncate font-bold tracking-tight"
        title={profile?.primaryMembership?.residentialComplex.name ?? 'Faro'}
      >
        {profile?.primaryMembership?.residentialComplex.name ?? 'Faro'}
      </span>

      <nav className="flex flex-1 items-center gap-1 overflow-x-auto">
        {NAV_MODULES.map((mod) => {
          const Icon = mod.icon;
          const isActive = activeModule?.id === mod.id;

          return (
            <Link
              key={mod.id}
              href={moduleDefaultHref(mod)}
              className={cn(
                'text-caption flex shrink-0 flex-col items-center gap-1 rounded-md px-3 py-2 transition-colors',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground',
              )}
            >
              <Icon className="size-5" />
              {mod.label}
            </Link>
          );
        })}
      </nav>

      <div className="flex shrink-0 items-center gap-3">
        {/* Ancho reservado siempre (cargando o no), para que el avatar y el
            botón de salir nunca salten de posición cuando el perfil llega. */}
        <div className="hidden w-32 text-right sm:block">
          {isLoading ? (
            <div className="ml-auto space-y-1">
              <div className="bg-sidebar-accent/40 ml-auto h-3.5 w-24 animate-pulse rounded" />
              <div className="bg-sidebar-accent/40 ml-auto h-3 w-16 animate-pulse rounded" />
            </div>
          ) : (
            profile && (
              <>
                <p className="text-body-s truncate leading-tight font-medium">
                  {profile.person.fullName}
                </p>
                {profile.primaryMembership && (
                  <p className="text-caption text-sidebar-foreground/60 truncate leading-tight">
                    {profile.primaryMembership.role.name}
                  </p>
                )}
              </>
            )
          )}
        </div>
        <Avatar className="size-8 shrink-0">
          <AvatarFallback className="text-caption">
            {profile ? getInitials(profile.person.fullName) : '·'}
          </AvatarFallback>
        </Avatar>
        <LogoutButton />
      </div>
    </header>
  );
}