'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, ChevronLeft, Grid3x3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  NAV_MODULES,
  findActiveModule,
  findActiveSection,
  moduleDefaultHref,
} from './nav-config';

export function DynamicSidebar({ open }: { open: boolean }) {
  const pathname = usePathname();
  const activeModule = findActiveModule(pathname);
  const activeSectionFromPath = findActiveSection(activeModule, pathname);

  const [expandedSectionId, setExpandedSectionId] = useState<string | null>(
    activeSectionFromPath?.id ?? null,
  );
  const [showingAllModules, setShowingAllModules] = useState(false);

  // Si cambiaste de módulo desde el top bar, sincroniza qué sección debería
  // quedar expandida (o ninguna) — evita que quede abierto el panel de un
  // módulo distinto al que estás viendo ahora.
  useEffect(() => {
    setExpandedSectionId(activeSectionFromPath?.id ?? null);
    setShowingAllModules(false);
  }, [activeModule?.id, activeSectionFromPath?.id]);

  if (!open) {
    return null;
  }

  // Módulo sin secciones (ej. Dashboard): sidebar mínimo, solo Suite.
  if (!activeModule?.sections || activeModule.sections.length === 0) {
    return (
      <aside className="bg-sidebar text-sidebar-foreground relative flex h-full w-16 flex-col items-center border-r border-sidebar-border py-4">
        <SuiteButton compact topAligned onClick={() => setShowingAllModules(true)} />
        {showingAllModules && <AllModulesOverlay onClose={() => setShowingAllModules(false)} />}
      </aside>
    );
  }

  if (showingAllModules) {
    return (
      <aside className="bg-sidebar text-sidebar-foreground flex h-full w-60 flex-col border-r border-sidebar-border">
        <button
          onClick={() => setShowingAllModules(false)}
          className="text-body-s flex items-center gap-2 border-b border-sidebar-border px-4 py-4 text-sidebar-foreground/80 hover:text-sidebar-foreground"
        >
          <ChevronLeft className="size-4" />
          Suite
        </button>
        <nav className="flex-1 space-y-1 overflow-y-auto p-2">
          {NAV_MODULES.map((mod) => {
            const Icon = mod.icon;
            return (
              <Link
                key={mod.id}
                href={moduleDefaultHref(mod)}
                onClick={() => setShowingAllModules(false)}
                className="text-body-s flex items-center gap-3 rounded-md px-3 py-2 text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
              >
                <Icon className="size-4" />
                {mod.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    );
  }

  const expandedSection = activeModule.sections.find((s) => s.id === expandedSectionId) ?? null;

  return (
    <div className="flex h-full">
      {/* Columna de secciones: filas con texto si nada está expandido, rail de íconos si sí */}
      <aside
        className={cn(
          'bg-sidebar text-sidebar-foreground flex flex-col border-r border-sidebar-border',
          expandedSection ? 'w-16 items-center py-4' : 'w-60',
        )}
      >
        {!expandedSection && (
          <div className="border-b border-sidebar-border px-4 py-4">
            <span className="text-body-s font-medium">{activeModule.label}</span>
          </div>
        )}

        <nav
          className={cn(
            'flex-1',
            expandedSection ? 'flex flex-col items-center gap-2 pt-2' : 'space-y-1 p-2',
          )}
        >
          {activeModule.sections.map((section) => {
            const Icon = section.icon;
            const isSectionActive = section.id === expandedSectionId;
            const onlyItem = section.items.length === 1 ? section.items[0] : null;

            if (expandedSection) {
              // Rail: solo íconos, cualquier clic cambia qué panel se ve.
              return (
                <button
                  key={section.id}
                  title={section.label}
                  onClick={() => setExpandedSectionId(section.id)}
                  className={cn(
                    'flex size-10 items-center justify-center rounded-md transition-colors',
                    isSectionActive
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                      : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50',
                  )}
                >
                  <Icon className="size-5" />
                </button>
              );
            }

            // Sin drill: si la sección tiene un único destino, es un link directo.
            if (onlyItem) {
              return (
                <Link
                  key={section.id}
                  href={onlyItem.href}
                  className="text-body-s flex items-center gap-3 rounded-md px-3 py-2 text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
                >
                  <Icon className="size-4" />
                  {section.label}
                </Link>
              );
            }

            return (
              <button
                key={section.id}
                onClick={() => setExpandedSectionId(section.id)}
                className="text-body-s flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
              >
                <span className="flex items-center gap-3">
                  <Icon className="size-4" />
                  {section.label}
                </span>
                <ChevronRight className="size-4" />
              </button>
            );
          })}
        </nav>

        <SuiteButton compact={!!expandedSection} onClick={() => setShowingAllModules(true)} />
      </aside>

      {/* Panel de items — solo cuando hay una sección expandida */}
      {expandedSection && (
        <aside className="bg-sidebar text-sidebar-foreground flex h-full w-56 flex-col border-r border-sidebar-border">
          <button
            onClick={() => setExpandedSectionId(null)}
            className="text-body-s flex items-center gap-2 border-b border-sidebar-border px-4 py-4 text-sidebar-foreground/80 hover:text-sidebar-foreground"
          >
            <ChevronLeft className="size-4" />
            {expandedSection.label}
          </button>
          <nav className="flex-1 space-y-1 overflow-y-auto p-2">
            {expandedSection.items.map((item) => {
              const isItemActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'text-body-s block rounded-md px-3 py-2',
                    isItemActive
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                      : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground',
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>
      )}
    </div>
  );
}

function SuiteButton({
  onClick,
  compact,
  topAligned,
}: {
  onClick: () => void;
  compact?: boolean;
  topAligned?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      title="Suite"
      className={cn(
        'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground flex items-center gap-3 rounded-md transition-colors',
        compact ? `size-10 justify-center ${topAligned ? '' : 'mt-auto mb-2'}` : 'text-body-s mx-2 mb-2 px-3 py-2',
      )}
    >
      <Grid3x3 className="size-4" />
      {!compact && 'Suite'}
    </button>
  );
}

// Usado solo por el caso "módulo sin secciones" (ej. Dashboard), donde no
// hay columna de secciones donde anidar el overlay de todos los módulos.
function AllModulesOverlay({ onClose }: { onClose: () => void }) {
  return (
    <aside className="bg-sidebar text-sidebar-foreground absolute top-16 bottom-0 left-16 z-10 flex w-60 flex-col border-r border-sidebar-border">
      <button
        onClick={onClose}
        className="text-body-s flex items-center gap-2 border-b border-sidebar-border px-4 py-4 text-sidebar-foreground/80 hover:text-sidebar-foreground"
      >
        <ChevronLeft className="size-4" />
        Suite
      </button>
      <nav className="flex-1 space-y-1 overflow-y-auto p-2">
        {NAV_MODULES.map((mod) => {
          const Icon = mod.icon;
          return (
            <Link
              key={mod.id}
              href={moduleDefaultHref(mod)}
              onClick={onClose}
              className="text-body-s flex items-center gap-3 rounded-md px-3 py-2 text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
            >
              <Icon className="size-4" />
              {mod.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
