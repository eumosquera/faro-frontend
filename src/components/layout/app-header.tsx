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
import { useMyProfile } from '@/modules/profile/hooks/use-my-profile';

function getInitials(fullName: string): string {
    return fullName
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join('');
}

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
    const { data: profile } = useMyProfile();

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

            <div className="flex items-center gap-3">
                {profile && (
                    <div className="hidden text-right sm:block">
                        <p className="text-body-s leading-tight font-medium">{profile.person.fullName}</p>
                        {profile.primaryMembership && (
                            <p className="text-caption text-muted-foreground leading-tight">
                                {profile.primaryMembership.role.name}
                            </p>
                        )}
                    </div>
                )}
                <Avatar className="size-8">
                    <AvatarFallback className="text-caption">
                        {profile ? getInitials(profile.person.fullName) : '·'}
                    </AvatarFallback>
                </Avatar>
                <LogoutButton />
            </div>
        </header>
    );
}