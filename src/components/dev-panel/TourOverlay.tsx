import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useTourNavigation } from '@/stores/dev-panel-store';
import { Button, Badge } from '@/components/ui';
import {
  ChevronLeft,
  ChevronRight,
  X,
  RotateCcw,
  Check,
  Sparkles,
  Target,
  PartyPopper,
  MousePointer,
  Lightbulb,
  Search,
  Type,
  Filter,
  Code,
  Plus,
  Layout,
  Eye,
  FileText,
  AlertTriangle,
  Phone,
  Book,
  History,
  Layers,
  Activity,
  GitCommit,
  Shield,
  MessageSquare,
  GitBranch,
  Circle,
  ZoomIn,
  Users,
  Calendar,
  ArrowUp,
  TrendingUp,
  Download,
  GitCompare,
  BarChart,
  DollarSign,
  Building,
  AlertCircle,
  CheckSquare,
  Clock,
  Settings,
  Share,
  Zap,
  PieChart,
  Briefcase,
  RotateCcw as Rollback,
  Rocket,
} from 'lucide-react';

// Icon mapping for interactive elements
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Search,
  Type,
  Filter,
  Code,
  Plus,
  Layout,
  Check,
  Eye,
  RotateCcw: Rollback,
  FileText,
  AlertTriangle,
  Phone,
  Book,
  History,
  Layers,
  Activity,
  GitCommit,
  Shield,
  MessageSquare,
  GitBranch,
  Circle,
  ZoomIn,
  Users,
  Calendar,
  ArrowUp,
  TrendingUp,
  Download,
  GitCompare,
  BarChart,
  DollarSign,
  Building,
  AlertCircle,
  CheckSquare,
  Clock,
  Settings,
  Share,
  Zap,
  Lightbulb,
  PieChart,
  Target,
  Briefcase,
  Rocket,
};

export function TourOverlay() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    currentStep,
    progress,
    activeTour,
    tourCompleted,
    isFirstStep,
    isLastStep,
    next,
    previous,
    skip,
    restart,
  } = useTourNavigation();

  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [showSpotlight, setShowSpotlight] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [timerProgress, setTimerProgress] = useState(0);

  // Handle route navigation for tour steps
  useEffect(() => {
    if (currentStep?.route && location.pathname !== currentStep.route) {
      navigate(currentStep.route);
    }
  }, [currentStep, navigate, location.pathname]);

  // Find and track target element
  useEffect(() => {
    if (!currentStep?.target) {
      setTargetRect(null);
      setShowSpotlight(false);
      return;
    }

    const findTarget = () => {
      const element = document.querySelector(currentStep.target!);
      if (element) {
        const rect = element.getBoundingClientRect();
        setTargetRect(rect);
        setShowSpotlight(currentStep.spotlight ?? true);
      } else {
        setTargetRect(null);
        setShowSpotlight(false);
      }
    };

    // Initial find with delay for route transitions
    const initialTimer = setTimeout(findTarget, 300);

    // Update on scroll/resize
    window.addEventListener('scroll', findTarget, true);
    window.addEventListener('resize', findTarget);

    return () => {
      clearTimeout(initialTimer);
      window.removeEventListener('scroll', findTarget, true);
      window.removeEventListener('resize', findTarget);
    };
  }, [currentStep]);

  // Handle timer-based completion with progress
  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setTimerProgress(0);

    if (currentStep?.completionTrigger === 'timer' && currentStep.timerDuration) {
      const duration = currentStep.timerDuration;
      const startTime = Date.now();
      
      const updateProgress = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min((elapsed / duration) * 100, 100);
        setTimerProgress(progress);
        
        if (progress < 100) {
          requestAnimationFrame(updateProgress);
        }
      };
      
      requestAnimationFrame(updateProgress);

      timerRef.current = setTimeout(() => {
        next();
      }, duration);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [currentStep, next]);

  // Don't render if no active tour
  if (!activeTour) return null;

  // Completion screen
  if (tourCompleted) {
    return createPortal(
      <div className="fixed inset-0 z-[9999] flex items-center justify-center">
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" />

        {/* Completion card */}
        <div className={cn(
          'relative z-10 w-[440px] p-8 rounded-2xl',
          'bg-surface border border-border-default',
          'shadow-2xl animate-scale-in text-center'
        )}>
          <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-6">
            <PartyPopper className="w-10 h-10 text-success" />
          </div>

          <h2 className="text-2xl font-bold text-text-primary mb-2">
            {activeTour.completionMessage}
          </h2>

          <p className="text-4xl mb-4">{activeTour.completionEmoji}</p>

          <p className="text-sm text-text-tertiary mb-6">
            You've completed the <strong>{activeTour.title}</strong> and experienced 
            how the platform helps {activeTour.persona.replace('-', ' ')}s achieve their goals.
          </p>

          {/* Summary of what was covered */}
          <div className="text-left p-4 rounded-lg bg-surface-raised border border-border-subtle mb-6">
            <h4 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-3">
              Jobs You Can Now Do
            </h4>
            <ul className="space-y-2">
              {activeTour.steps.slice(0, 4).map((step) => (
                <li key={step.id} className="flex items-start gap-2 text-sm text-text-secondary">
                  <Check className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                  <span>{step.jtbd}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center justify-center gap-3">
            <Button variant="ghost" onClick={restart} leftIcon={<RotateCcw className="w-4 h-4" />}>
              Replay Tour
            </Button>
            <Button variant="primary" onClick={skip}>
              Continue Exploring
            </Button>
          </div>
        </div>
      </div>,
      document.body
    );
  }

  if (!currentStep) return null;

  // Calculate tooltip position
  const getTooltipPosition = () => {
    if (!targetRect) {
      return {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      };
    }

    const padding = 20;
    const tooltipWidth = 420;
    const tooltipHeight = 300;

    switch (currentStep.placement) {
      case 'top':
        return {
          top: `${Math.max(padding, targetRect.top - tooltipHeight - padding)}px`,
          left: `${Math.min(window.innerWidth - tooltipWidth - padding, Math.max(padding, targetRect.left + targetRect.width / 2 - tooltipWidth / 2))}px`,
        };
      case 'bottom':
        return {
          top: `${Math.min(window.innerHeight - tooltipHeight - padding, targetRect.bottom + padding)}px`,
          left: `${Math.min(window.innerWidth - tooltipWidth - padding, Math.max(padding, targetRect.left + targetRect.width / 2 - tooltipWidth / 2))}px`,
        };
      case 'left':
        return {
          top: `${Math.min(window.innerHeight - tooltipHeight - padding, Math.max(padding, targetRect.top + targetRect.height / 2 - tooltipHeight / 2))}px`,
          left: `${Math.max(padding, targetRect.left - tooltipWidth - padding)}px`,
        };
      case 'right':
        return {
          top: `${Math.min(window.innerHeight - tooltipHeight - padding, Math.max(padding, targetRect.top + targetRect.height / 2 - tooltipHeight / 2))}px`,
          left: `${Math.min(window.innerWidth - tooltipWidth - padding, targetRect.right + padding)}px`,
        };
      default:
        return {
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        };
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] pointer-events-none">
      {/* Spotlight overlay */}
      {showSpotlight && targetRect && (
        <svg className="absolute inset-0 w-full h-full pointer-events-auto">
          <defs>
            <mask id="spotlight-mask">
              <rect x="0" y="0" width="100%" height="100%" fill="white" />
              <rect
                x={targetRect.left - 12}
                y={targetRect.top - 12}
                width={targetRect.width + 24}
                height={targetRect.height + 24}
                rx="12"
                fill="black"
              />
            </mask>
          </defs>
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="rgba(0,0,0,0.75)"
            mask="url(#spotlight-mask)"
            onClick={() => {
              if (!currentStep.interactive) {
                next();
              }
            }}
          />
        </svg>
      )}

      {/* Pulsing indicator around target */}
      {targetRect && showSpotlight && (
        <div
          className="absolute pointer-events-none"
          style={{
            top: targetRect.top - 12,
            left: targetRect.left - 12,
            width: targetRect.width + 24,
            height: targetRect.height + 24,
          }}
        >
          <div className="absolute inset-0 rounded-xl border-2 border-accent animate-pulse-slow" />
          <div className="absolute inset-0 rounded-xl border-2 border-accent/50 animate-ping-slow" />
        </div>
      )}

      {/* Tooltip */}
      <div
        className={cn(
          'absolute w-[420px] pointer-events-auto',
          'animate-scale-in'
        )}
        style={getTooltipPosition()}
      >
        <div className={cn(
          'rounded-xl overflow-hidden',
          'bg-surface border border-border-default',
          'shadow-2xl'
        )}>
          {/* Header */}
          <div className="p-4 border-b border-border-subtle bg-surface-raised">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <Badge variant="accent" size="sm">
                  Step {progress.current} of {progress.total}
                </Badge>
                <span className="text-xs text-text-disabled">
                  {activeTour.title}
                </span>
              </div>
              <button
                onClick={skip}
                className="p-1.5 rounded-lg text-text-tertiary hover:text-text-secondary hover:bg-surface transition-colors"
                aria-label="Skip tour"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* JTBD Badge */}
            <div className="flex items-start gap-2 p-2.5 rounded-lg bg-accent-subtle border border-accent-border">
              <Lightbulb className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-semibold text-accent uppercase tracking-wider">
                  Job to be Done
                </span>
                <p className="text-xs text-accent-text mt-0.5">
                  "{currentStep.jtbd}"
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              {currentStep.title}
            </h3>
            <p className="text-sm text-text-tertiary mb-4 leading-relaxed">
              {currentStep.description}
            </p>

            {/* Interactive Elements */}
            {currentStep.interactiveElements && currentStep.interactiveElements.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <MousePointer className="w-3.5 h-3.5 text-text-tertiary" />
                  <span className="text-xs font-semibold text-text-tertiary uppercase tracking-wider">
                    Try These Actions
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {currentStep.interactiveElements.map((element, idx) => {
                    const Icon = element.icon ? iconMap[element.icon] : MousePointer;
                    return (
                      <div
                        key={idx}
                        className={cn(
                          'flex items-center gap-2 p-2.5 rounded-lg',
                          'bg-surface-raised border border-border-subtle',
                          'hover:border-accent-border hover:bg-accent-subtle/50',
                          'transition-all cursor-pointer group'
                        )}
                        onClick={() => {
                          const el = document.querySelector(element.selector);
                          if (el) {
                            if (element.action === 'click') {
                              (el as HTMLElement).click();
                            } else if (element.action === 'hover') {
                              el.dispatchEvent(new MouseEvent('mouseenter'));
                            }
                          }
                        }}
                      >
                        <div className={cn(
                          'w-7 h-7 rounded-md flex items-center justify-center',
                          'bg-surface border border-border-subtle',
                          'group-hover:bg-accent-subtle group-hover:border-accent-border',
                          'transition-colors'
                        )}>
                          {Icon && <Icon className="w-3.5 h-3.5 text-text-tertiary group-hover:text-accent" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-text-secondary group-hover:text-text-primary truncate">
                            {element.label}
                          </p>
                          <p className="text-[10px] text-text-disabled truncate">
                            {element.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Try It Prompt */}
            {currentStep.tryItPrompt && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-success-subtle border border-success-border mb-4">
                <Sparkles className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                <p className="text-xs text-success-text">
                  <strong>Try it:</strong> {currentStep.tryItPrompt}
                </p>
              </div>
            )}

            {/* Progress bar */}
            <div className="h-1.5 bg-border-subtle rounded-full mb-4 overflow-hidden">
              <div
                className="h-full bg-accent transition-all duration-300 rounded-full"
                style={{ width: `${(progress.current / progress.total) * 100}%` }}
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {!isFirstStep && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={previous}
                    leftIcon={<ChevronLeft className="w-4 h-4" />}
                  >
                    Back
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={restart}
                  leftIcon={<RotateCcw className="w-4 h-4" />}
                >
                  Restart
                </Button>
              </div>

              <Button
                size="sm"
                variant="primary"
                onClick={next}
                rightIcon={isLastStep ? <Check className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              >
                {isLastStep ? 'Complete' : 'Next'}
              </Button>
            </div>
          </div>

          {/* Timer indicator */}
          {currentStep.completionTrigger === 'timer' && currentStep.timerDuration && (
            <div className="px-4 pb-4">
              <div className="flex items-center gap-2 text-xs text-text-disabled">
                <div className="flex-1 h-1 bg-border-subtle rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-accent/50 rounded-full transition-all duration-100"
                    style={{ width: `${timerProgress}%` }}
                  />
                </div>
                <span>Auto-advancing...</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Minimized tour controls */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 pointer-events-auto">
        <div className={cn(
          'flex items-center gap-3 px-4 py-2.5 rounded-full',
          'bg-surface-raised border border-border-default',
          'shadow-xl'
        )}>
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-text-secondary">
              {activeTour.title}
            </span>
          </div>
          <div className="w-px h-4 bg-border-subtle" />
          <span className="text-sm font-semibold text-accent">
            {progress.current}/{progress.total}
          </span>
          <div className="w-px h-4 bg-border-subtle" />
          <button
            onClick={skip}
            className="text-xs text-text-disabled hover:text-text-tertiary transition-colors"
          >
            Exit Tour
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
