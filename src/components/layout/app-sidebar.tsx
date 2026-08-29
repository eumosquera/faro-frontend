'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useMyProfile } from '@/modules/profile/hooks/use-my-profile';
import { NAV_GROUPS } from './nav-items';

export function AppSidebar() {
    const pathname = usePathname();
    const { data: profile } = useMyProfile();

    const complexName = profile?.primaryMembership?.residentialComplex.name ?? 'Faro';

    return (
        <aside className="bg-sidebar text-sidebar-foreground flex h-screen w-64 flex-col border-r border-sidebar-border">
            <div className="flex h-16 items-center gap-2 px-6">
                <span className="text-h4 truncate font-bold tracking-tight" title={complexName}>
                    {complexName}
                </span>
            </div>

            <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
                {NAV_GROUPS.map((group) => (
                    <div key={group.title}>
                        <p className="text-caption text-sidebar-foreground/60 mb-2 px-3 uppercase tracking-wide">
                            {group.title}
                        </p>
                        <ul className="space-y-1">
                            {group.items.map((item) => {
                                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                                const Icon = item.icon;

                                return (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            className={cn(
                                                'text-body-s flex items-center gap-3 rounded-md px-3 py-2 transition-colors duration-150',
                                                isActive
                                                    ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                                                    : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground',
                                            )}
                                        >
                                            <Icon className="size-4 shrink-0" />
                                            {item.label}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
            </nav>
        </aside>
    );
}