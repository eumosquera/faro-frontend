import { redirect } from 'next/navigation';

import { AppSidebar } from '@/components/layout/app-sidebar';
import { AppHeader } from '@/components/layout/app-header';
import { createClient } from '@/lib/supabase/server';
import { getApplicationAccess } from '@/modules/access/services/application-access.service';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();

    const {
        data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
        redirect('/login');
    }

    const applicationAccess = await getApplicationAccess(
        session.access_token,
    );

    if (!applicationAccess.hasApplicationAccess) {
        redirect('/sin-acceso');
    }

    return (
        <div className="flex h-screen overflow-hidden">
            <AppSidebar />

            <div className="flex flex-1 flex-col overflow-hidden">
                <AppHeader />

                <main className="bg-muted/30 flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}