'use client';

import { usePathname } from 'next/navigation';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LogoutButton } from '@/components/auth/logout-button';

function buildBreadcrumb(pathname: string) {
    const segments = pathname.split('/').filter(Boolean);
    return segments.map((segment, index) => ({
        label: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
        href: '/' + segments.slice(0, index + 1).join('/'),
        isLast: index === segments.length - 1,
    }));
}

export function AppHeader() {
    const pathname = usePathname();
    const crumbs = buildBreadcrumb(pathname);

    return (
        <header className="bg-background flex h-16 items-center justify-between border-b px-6">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/dashboard">Inicio</BreadcrumbLink>
                    </BreadcrumbItem>
                    {crumbs.map((crumb) => (
                        <span key={crumb.href} className="flex items-center gap-1.5">
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                {crumb.isLast ? (
                                    <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink href={crumb.href}>{crumb.label}</BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                        </span>
                    ))}
                </BreadcrumbList>
            </Breadcrumb>

            <div className="flex items-center gap-2">
                <Avatar className="size-8">
                    <AvatarFallback className="text-caption">U</AvatarFallback>
                </Avatar>
                <LogoutButton />
            </div>
        </header>
    );
}