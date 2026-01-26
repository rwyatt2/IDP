import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';
import { GlobalSearch } from './GlobalSearch';
import { CommandPalette } from './CommandPalette';
import { Breadcrumbs } from './Breadcrumbs';
import { useKeyboardShortcuts } from '@/hooks';
import { ToastContainer } from '@/components/ui';
import { DevPanel, TourOverlay, useDevPanelShortcuts } from '@/components/dev-panel';
import { HelpSidebar, FloatingHelpButton } from '@/components/help';
import { useSettingsStore } from '@/stores';
import { cn } from '@/lib/utils';

export function Layout() {
  // Initialize keyboard shortcuts
  useKeyboardShortcuts();
  useDevPanelShortcuts();
  
  // Get appearance settings
  const { showBreadcrumbs, compactMode, animations } = useSettingsStore((state) => state.appearance);

  return (
    <div className={cn(
      "relative h-screen flex overflow-hidden bg-canvas",
      compactMode && "compact-mode",
      !animations && "no-animations"
    )}>
      {/* Ambient Background Gradients - Very subtle atmospheric effect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {/* Top-left gradient orb - barely visible */}
        <div 
          className="absolute -top-[30%] -left-[15%] w-[50%] h-[50%] rounded-full opacity-[0.08] blur-[150px]"
          style={{ background: 'radial-gradient(circle, #5558d4 0%, transparent 70%)' }}
        />
        {/* Bottom-right gradient orb - very subtle */}
        <div 
          className="absolute -bottom-[30%] -right-[15%] w-[40%] h-[50%] rounded-full opacity-[0.06] blur-[150px]"
          style={{ background: 'radial-gradient(circle, #6b5ba7 0%, transparent 70%)' }}
        />
      </div>

      {/* Skip link for keyboard navigation - WCAG 2.4.1 */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative z-0">
        {/* Header */}
        <header className="header" role="banner">
          <TopNav />
        </header>

        {/* Main Content */}
        <main id="main-content" className="flex-1 overflow-auto" role="main" tabIndex={-1}>
          {/* Breadcrumbs navigation - conditionally rendered based on settings */}
          {showBreadcrumbs && (
            <div className={cn(
              "px-6 py-2 border-b border-border-subtle",
              compactMode && "px-4 py-1.5"
            )}>
              <Breadcrumbs />
            </div>
          )}

          {/* Page Content */}
          <div className={cn("p-6", compactMode && "p-4")}>
            <Outlet />
          </div>
        </main>
      </div>

      {/* Global Overlays */}
      <GlobalSearch />
      <CommandPalette />
      <ToastContainer />

      {/* Help System */}
      <HelpSidebar />
      <FloatingHelpButton />

      {/* Developer Panel & Guided Tours */}
      <DevPanel />
      <TourOverlay />
    </div>
  );
}
