import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';
import { GlobalSearch } from './GlobalSearch';
import { CommandPalette } from './CommandPalette';
import { Breadcrumbs } from './Breadcrumbs';
import { useKeyboardShortcuts } from '@/hooks';
import { ToastContainer } from '@/components/ui';

export function Layout() {
  // Initialize keyboard shortcuts
  useKeyboardShortcuts();

  return (
    <div className="h-screen flex overflow-hidden relative">
      {/* Atmospheric background with lighting */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% -20%, rgba(120, 119, 198, 0.12), transparent),
            radial-gradient(ellipse 60% 80% at 80% 50%, rgba(124, 58, 237, 0.04), transparent),
            radial-gradient(ellipse 50% 60% at 20% 80%, rgba(124, 58, 237, 0.03), transparent),
            #020208
          `
        }}
      />

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Floating Command Header with blur */}
        <header className="command-header">
          <TopNav />
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto relative">
          {/* Breadcrumbs bar */}
          <div className="px-6 py-2.5 border-b border-white/[0.04]">
            <Breadcrumbs />
          </div>

          {/* Page with subtle vignette */}
          <div className="p-6 relative">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Global Overlays */}
      <GlobalSearch />
      <CommandPalette />
      <ToastContainer />
    </div>
  );
}
