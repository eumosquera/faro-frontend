import { AppSidebar } from '@/components/layout/app-sidebar';
import { AppHeader } from '@/components/layout/app-header';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen overflow-hidden">
            <AppSidebar />
            <div className="flex flex-1 flex-col overflow-hidden">
                <AppHeader />
                <main className="bg-muted/30 flex-1 overflow-y-auto p-6">{children}</main>
            </div>
        </div>
    );
}