import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import { 
  HelpCircle, 
  X, 
  ChevronRight, 
  BookOpen,
  Sparkles,
} from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useDocumentationStore } from '@/stores';
import { contextualHelp } from '@/data/documentation-data';
import type { ContextualHelp } from '@/types/documentation';

interface SmartHelpBubbleProps {
  show?: boolean;
  onDismiss?: () => void;
}

export function SmartHelpBubble({ show: showProp, onDismiss }: SmartHelpBubbleProps) {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentHelp, setCurrentHelp] = useState<ContextualHelp | null>(null);
  const [hasBeenDismissed, setHasBeenDismissed] = useState(false);
  const { openSidebar } = useDocumentationStore();
  const inactivityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dismissedPagesRef = useRef<Set<string>>(new Set());

  // Find contextual help for current page
  useEffect(() => {
    const pageUrl = location.pathname;
    const help = contextualHelp.find((h) => {
      if (h.location === pageUrl) return true;
      if (h.location.includes('*')) {
        const pattern = h.location.replace(/\*/g, '.*');
        return new RegExp(`^${pattern}$`).test(pageUrl);
      }
      return false;
    });

    setCurrentHelp(help || null);
    setHasBeenDismissed(dismissedPagesRef.current.has(pageUrl));
    setIsExpanded(false);
  }, [location.pathname]);

  // Inactivity detection
  useEffect(() => {
    if (hasBeenDismissed || showProp === false) return;

    const resetTimer = () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
      
      // Only show after 30 seconds of inactivity on first-visit trigger pages
      if (currentHelp?.triggers.includes('inactivity') || currentHelp?.triggers.includes('first-visit')) {
        inactivityTimerRef.current = setTimeout(() => {
          setIsVisible(true);
        }, 30000);
      }
    };

    const handleActivity = () => {
      if (isVisible) return; // Don't reset if already showing
      resetTimer();
    };

    // Initial timer
    resetTimer();

    // Listen for user activity
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('scroll', handleActivity);
    window.addEventListener('click', handleActivity);

    return () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('scroll', handleActivity);
      window.removeEventListener('click', handleActivity);
    };
  }, [currentHelp, hasBeenDismissed, isVisible, showProp]);

  // External show control
  useEffect(() => {
    if (showProp !== undefined) {
      setIsVisible(showProp);
    }
  }, [showProp]);

  const handleDismiss = () => {
    setIsVisible(false);
    setHasBeenDismissed(true);
    dismissedPagesRef.current.add(location.pathname);
    onDismiss?.();
  };

  const handleOpenHelpCenter = () => {
    openSidebar();
    handleDismiss();
  };

  if (!isVisible || !currentHelp || hasBeenDismissed) {
    return null;
  }

  return createPortal(
    <div
      className={cn(
        'fixed bottom-6 right-6 z-50 animate-slide-up',
        isExpanded ? 'w-80' : 'w-auto'
      )}
    >
      <div className="bg-surface-overlay border border-border-subtle rounded-xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-accent/10 to-purple-500/10 border-b border-border-subtle">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-accent" />
            </div>
            <span className="text-sm font-medium text-text-primary">
              Need help?
            </span>
          </div>
          <button
            onClick={handleDismiss}
            className="p-1.5 hover:bg-surface-raised rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-text-tertiary" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-sm text-text-secondary leading-relaxed">
            {currentHelp.content.quick}
          </p>

          {isExpanded && currentHelp.content.detailed && (
            <div className="mt-3 pt-3 border-t border-border-subtle">
              <p className="text-sm text-text-tertiary whitespace-pre-line">
                {currentHelp.content.detailed}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="mt-4 flex flex-col gap-2">
            {!isExpanded && currentHelp.content.detailed && (
              <button
                onClick={() => setIsExpanded(true)}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors text-sm font-medium"
              >
                <span>Tell me more</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}

            <div className="flex gap-2">
              <button
                onClick={handleOpenHelpCenter}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-surface-raised text-text-primary rounded-lg hover:bg-border-subtle transition-colors text-sm"
              >
                <BookOpen className="w-4 h-4" />
                <span>Help Center</span>
              </button>
              
              <button
                onClick={handleDismiss}
                className="flex items-center justify-center gap-2 px-4 py-2 text-text-tertiary hover:text-text-secondary transition-colors text-sm"
              >
                <span>Got it</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

// Quick floating help button that appears in the corner
export function FloatingHelpButton() {
  const { openSidebar } = useDocumentationStore();

  const handleClick = () => {
    openSidebar();
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        'fixed bottom-6 right-6 z-40',
        'w-12 h-12 rounded-full',
        'bg-accent hover:bg-accent-hover',
        'shadow-lg hover:shadow-xl',
        'flex items-center justify-center',
        'transition-all duration-200',
        'group'
      )}
      title="Open Help Center"
    >
      <HelpCircle className="w-6 h-6 text-white" />
      
      {/* Tooltip */}
      <div className="absolute right-full mr-3 px-3 py-1.5 bg-surface-overlay border border-border-subtle rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        <span className="text-sm text-text-primary">Need help?</span>
        <span className="text-xs text-text-tertiary ml-2">⌘?</span>
      </div>
    </button>
  );
}
