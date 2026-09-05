'use client';

import { useState } from 'react';
import { TopModuleBar } from '@/components/layout/top-module-bar';
import { DynamicSidebar } from '@/components/layout/dynamic-sidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <TopModuleBar sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen((v) => !v)} />
      <div className="relative flex flex-1 overflow-hidden">
        <DynamicSidebar open={sidebarOpen} />
        <main className="bg-muted/30 flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}