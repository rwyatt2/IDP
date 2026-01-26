import { useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import { useDevPanelStore } from '@/stores/dev-panel-store';
import { usePersonaStore } from '@/stores';
import { PERSONA_CARDS, PERSONA_TOURS } from '@/types/dev-panel';
import { Button, Badge } from '@/components/ui';
import {
  X,
  Minimize2,
  Maximize2,
  Code,
  Users,
  BarChart3,
  Briefcase,
  Play,
  Check,
  Keyboard,
  Sparkles,
  RotateCcw,
  Zap,
} from 'lucide-react';

const personaIcons = {
  developer: Code,
  'tech-lead': Users,
  'engineering-manager': BarChart3,
  executive: Briefcase,
};

const personaColors = {
  developer: { bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-400', badge: 'bg-blue-500' },
  'tech-lead': { bg: 'bg-violet-500/10', border: 'border-violet-500/20', text: 'text-violet-400', badge: 'bg-violet-500' },
  'engineering-manager': { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400', badge: 'bg-emerald-500' },
  executive: { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400', badge: 'bg-amber-500' },
};

export function DevPanel() {
  const {
    isOpen,
    isMinimized,
    activeTour,
    completedTours,
    closePanel,
    toggleMinimize,
    startTour,
    isTourCompleted,
  } = useDevPanelStore();

  const { currentPersona, setPersona } = usePersonaStore();
  const [selectedTab, setSelectedTab] = useState<'personas' | 'shortcuts'>('personas');

  // Don't render if not open
  if (!isOpen) return null;

  // Render minimized state
  if (isMinimized && !activeTour) {
    return createPortal(
      <div className="fixed bottom-4 right-4 z-[9999]">
        <button
          onClick={toggleMinimize}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-full',
            'bg-surface-raised border border-border-default',
            'text-text-primary shadow-xl',
            'hover:bg-surface-overlay transition-all',
            'animate-scale-in'
          )}
        >
          <Sparkles className="w-4 h-4 text-accent" />
          <span className="text-sm font-medium">Dev Panel</span>
          <Maximize2 className="w-4 h-4 text-text-tertiary" />
        </button>
      </div>,
      document.body
    );
  }

  return createPortal(
    <div className="fixed inset-0 z-[9998] pointer-events-none">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto animate-fade-in"
        onClick={closePanel}
      />

      {/* Panel */}
      <div
        className={cn(
          'absolute right-4 top-4 bottom-4 w-[420px]',
          'bg-surface border border-border-default rounded-2xl',
          'shadow-2xl pointer-events-auto',
          'flex flex-col overflow-hidden',
          'animate-slide-in-right'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border-subtle">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h2 className="font-semibold text-text-primary">Developer Panel</h2>
              <p className="text-xs text-text-tertiary">Guided persona experiences</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={toggleMinimize}
              className="p-2 rounded-lg text-text-tertiary hover:text-text-secondary hover:bg-surface-raised transition-colors"
              aria-label="Minimize panel"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
            <button
              onClick={closePanel}
              className="p-2 rounded-lg text-text-tertiary hover:text-text-secondary hover:bg-surface-raised transition-colors"
              aria-label="Close panel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border-subtle">
          <button
            onClick={() => setSelectedTab('personas')}
            className={cn(
              'flex-1 py-3 text-sm font-medium transition-colors',
              selectedTab === 'personas'
                ? 'text-accent border-b-2 border-accent'
                : 'text-text-tertiary hover:text-text-secondary'
            )}
          >
            Persona Tours
          </button>
          <button
            onClick={() => setSelectedTab('shortcuts')}
            className={cn(
              'flex-1 py-3 text-sm font-medium transition-colors',
              selectedTab === 'shortcuts'
                ? 'text-accent border-b-2 border-accent'
                : 'text-text-tertiary hover:text-text-secondary'
            )}
          >
            Keyboard Shortcuts
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {selectedTab === 'personas' ? (
            <div className="space-y-4">
              {/* Progress indicator */}
              <div className="p-3 rounded-lg bg-surface-raised border border-border-subtle">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-text-tertiary">Tour Progress</span>
                  <span className="text-xs text-text-disabled">
                    {completedTours.length} / {PERSONA_CARDS.length} completed
                  </span>
                </div>
                <div className="flex gap-1">
                  {PERSONA_CARDS.map((card) => (
                    <div
                      key={card.tourId}
                      className={cn(
                        'flex-1 h-1.5 rounded-full transition-colors',
                        isTourCompleted(card.tourId)
                          ? 'bg-success'
                          : 'bg-border-subtle'
                      )}
                    />
                  ))}
                </div>
              </div>

              {/* Persona cards */}
              <div className="space-y-3">
                {PERSONA_CARDS.map((card) => {
                  const Icon = personaIcons[card.persona];
                  const colors = personaColors[card.persona];
                  const isCompleted = isTourCompleted(card.tourId);
                  const tour = PERSONA_TOURS.find((t) => t.id === card.tourId);
                  const isActive = currentPersona === card.persona;

                  return (
                    <div
                      key={card.persona}
                      className={cn(
                        'p-4 rounded-xl border transition-all',
                        colors.bg,
                        colors.border,
                        isActive && 'ring-2 ring-accent/50'
                      )}
                    >
                      <div className="flex items-start gap-3">
                        {/* Avatar */}
                        <div className={cn(
                          'relative w-12 h-12 rounded-xl flex items-center justify-center',
                          'bg-surface border border-border-subtle'
                        )}>
                          <Icon className={cn('w-6 h-6', colors.text)} />
                          <span className={cn(
                            'absolute -top-1 -right-1 px-1.5 py-0.5 rounded text-[10px] font-bold text-white',
                            colors.badge
                          )}>
                            {card.badge}
                          </span>
                          {isCompleted && (
                            <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-success flex items-center justify-center">
                              <Check className="w-3 h-3 text-white" />
                            </span>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-text-primary">{card.title}</h3>
                            {isActive && (
                              <Badge variant="accent" size="sm">Active</Badge>
                            )}
                          </div>
                          <p className="text-xs text-text-tertiary mb-2 line-clamp-2">
                            {card.description}
                          </p>
                          <p className="text-[10px] text-text-disabled mb-3">
                            <strong>Focus:</strong> {card.keyMetrics}
                          </p>

                          {/* Actions */}
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant={isCompleted ? 'secondary' : 'primary'}
                              leftIcon={isCompleted ? <RotateCcw className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                              onClick={() => startTour(card.tourId)}
                            >
                              {isCompleted ? 'Replay Tour' : 'Start Tour'}
                            </Button>
                            {!isActive && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setPersona(card.persona)}
                              >
                                Switch View
                              </Button>
                            )}
                          </div>

                          {/* Tour info */}
                          {tour && (
                            <div className="flex items-center gap-3 mt-3 pt-3 border-t border-border-subtle">
                              <span className="text-[10px] text-text-disabled">
                                {tour.steps.length} steps
                              </span>
                              <span className="text-[10px] text-text-disabled">
                                ~{tour.estimatedTime}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Keyboard shortcuts */}
              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-3">
                  Panel Controls
                </h3>
                <ShortcutRow keys={['⌘', '⇧', 'D']} description="Toggle developer panel" />
                <ShortcutRow keys={['Esc']} description="Close panel / Exit tour" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-3">
                  Tour Navigation
                </h3>
                <ShortcutRow keys={['→']} description="Next step" />
                <ShortcutRow keys={['←']} description="Previous step" />
                <ShortcutRow keys={['R']} description="Restart current tour" />
                <ShortcutRow keys={['S']} description="Skip current step" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-3">
                  Quick Persona Selection
                </h3>
                <ShortcutRow keys={['1']} description="Switch to Developer" />
                <ShortcutRow keys={['2']} description="Switch to Tech Lead" />
                <ShortcutRow keys={['3']} description="Switch to Engineering Manager" />
                <ShortcutRow keys={['4']} description="Switch to Executive" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-3">
                  Platform Shortcuts
                </h3>
                <ShortcutRow keys={['⌘', 'K']} description="Open search" />
                <ShortcutRow keys={['⌘', '⇧', 'P']} description="Command palette" />
                <ShortcutRow keys={['G', 'D']} description="Go to Dashboard" />
                <ShortcutRow keys={['G', 'C']} description="Go to Create App" />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border-subtle bg-canvas/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-text-disabled">
              <Keyboard className="w-3.5 h-3.5" />
              <span>Press <kbd className="px-1.5 py-0.5 rounded bg-surface border border-border-subtle text-[10px]">⌘⇧D</kbd> to toggle</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-text-disabled">
              <Zap className="w-3.5 h-3.5" />
              <span>Demo Mode</span>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

// Shortcut row component
function ShortcutRow({ keys, description }: { keys: string[]; description: string }) {
  return (
    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-surface-raised transition-colors">
      <span className="text-sm text-text-secondary">{description}</span>
      <div className="flex items-center gap-1">
        {keys.map((key, i) => (
          <kbd
            key={i}
            className={cn(
              'px-2 py-1 rounded bg-surface border border-border-subtle',
              'text-xs font-mono text-text-tertiary min-w-[24px] text-center'
            )}
          >
            {key}
          </kbd>
        ))}
      </div>
    </div>
  );
}
