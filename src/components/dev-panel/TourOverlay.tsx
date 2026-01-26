import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
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
  ArrowRight,
  Play,
  Hand,
  Server,
  Database,
  TrendingDown,
  ArrowUpRight,
  Crosshair,
  Move,
} from 'lucide-react';
import type { InteractiveElement } from '@/types/dev-panel';

// Icon mapping for interactive elements
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Search, Type, Filter, Code, Plus, Layout, Check, Eye,
  RotateCcw: Rollback, FileText, AlertTriangle, Phone, Book,
  History, Layers, Activity, GitCommit, Shield, MessageSquare,
  GitBranch, Circle, ZoomIn, Users, Calendar, ArrowUp,
  TrendingUp, Download, GitCompare, BarChart, DollarSign,
  Building, AlertCircle, CheckSquare, Clock, Settings, Share,
  Zap, Lightbulb, PieChart, Target, Briefcase, Rocket,
  Server, Database, TrendingDown,
};

// Large floating beacon that appears on page elements with arrow pointing to them
interface ElementBeaconProps {
  element: InteractiveElement;
  index: number;
  isActive: boolean;
  personaColor: string;
  onActivate: () => void;
}

function ElementBeacon({ element, index, isActive, personaColor, onActivate }: ElementBeaconProps) {
  const [position, setPosition] = useState<{ 
    top: number; 
    left: number; 
    width: number;
    height: number;
    visible: boolean;
  }>({ top: 0, left: 0, width: 0, height: 0, visible: false });

  useEffect(() => {
    const findElement = () => {
      const el = document.querySelector(element.selector);
      if (el) {
        const rect = el.getBoundingClientRect();
        setPosition({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
          visible: true,
        });
      } else {
        setPosition(prev => ({ ...prev, visible: false }));
      }
    };

    findElement();
    const timer = setTimeout(findElement, 500);
    const interval = setInterval(findElement, 1000);

    window.addEventListener('scroll', findElement, true);
    window.addEventListener('resize', findElement);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
      window.removeEventListener('scroll', findElement, true);
      window.removeEventListener('resize', findElement);
    };
  }, [element.selector]);

  if (!position.visible) return null;

  const Icon = element.icon ? iconMap[element.icon] : Circle;

  return (
    <>
      {/* Highlight box around the element */}
      <div
        className={cn(
          'fixed pointer-events-none z-[9997] transition-all duration-300',
          isActive ? 'opacity-100' : 'opacity-50'
        )}
        style={{
          top: position.top - 4,
          left: position.left - 4,
          width: position.width + 8,
          height: position.height + 8,
        }}
      >
        {/* Pulsing border */}
        <div className={cn(
          'absolute inset-0 rounded-lg border-2',
          isActive ? 'border-white animate-pulse' : 'border-white/50'
        )} />
        {isActive && (
          <div className="absolute inset-0 rounded-lg border-2 border-white animate-ping opacity-30" />
        )}
      </div>

      {/* Numbered badge positioned at top-left of element */}
      <div
        className={cn(
          'fixed z-[9998] pointer-events-auto cursor-pointer',
          'transition-all duration-300'
        )}
        style={{
          top: position.top - 20,
          left: position.left - 20,
        }}
        onClick={(e) => {
          e.stopPropagation();
          onActivate();
          const el = document.querySelector(element.selector);
          if (el && element.action === 'click') {
            (el as HTMLElement).click();
          }
        }}
      >
        {/* Large numbered circle */}
        <div className={cn(
          'w-10 h-10 rounded-full flex items-center justify-center',
          'shadow-xl border-2 border-white',
          'transition-transform duration-200',
          isActive && 'scale-110',
          personaColor
        )}>
          <span className="text-white text-lg font-bold">{index + 1}</span>
        </div>
        
        {/* Connecting line to element */}
        <svg 
          className="absolute top-1/2 left-1/2 pointer-events-none"
          width="30" 
          height="30" 
          style={{ transform: 'translate(0, 0)' }}
        >
          <line 
            x1="0" y1="0" 
            x2="24" y2="24" 
            stroke="white" 
            strokeWidth="2" 
            strokeDasharray="4 2"
          />
        </svg>
      </div>

      {/* Label below the element */}
      {isActive && (
        <div
          className={cn(
            'fixed z-[9998] pointer-events-none',
            'animate-fade-in'
          )}
          style={{
            top: position.top + position.height + 8,
            left: position.left,
            maxWidth: Math.max(position.width, 200),
          }}
        >
          <div className={cn(
            'px-3 py-2 rounded-lg shadow-lg',
            'bg-surface border border-white/30'
          )}>
            <div className="flex items-center gap-2">
              {Icon && <Icon className="w-4 h-4 text-white" />}
              <span className="text-sm font-semibold text-white">{element.label}</span>
            </div>
            <p className="text-xs text-white/80 mt-1">{element.description}</p>
          </div>
        </div>
      )}
    </>
  );
}

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

  const [activeElementIndex, setActiveElementIndex] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Handle route navigation for tour steps
  useEffect(() => {
    if (currentStep?.route && location.pathname !== currentStep.route) {
      setIsAnimating(true);
      navigate(currentStep.route);
      setTimeout(() => setIsAnimating(false), 500);
    }
  }, [currentStep, navigate, location.pathname]);

  // Reset active element when step changes
  useEffect(() => {
    setActiveElementIndex(0);
  }, [currentStep?.id]);

  // Persona-specific colors
  const personaColors = useMemo(() => {
    const colors: Record<string, { gradient: string; accent: string; badge: string; bg: string }> = {
      'developer': { 
        gradient: 'from-blue-500/20 via-indigo-500/10 to-purple-500/20',
        accent: 'text-blue-400',
        badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
        bg: 'bg-blue-500'
      },
      'tech-lead': { 
        gradient: 'from-violet-500/20 via-purple-500/10 to-pink-500/20',
        accent: 'text-violet-400',
        badge: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
        bg: 'bg-violet-500'
      },
      'engineering-manager': { 
        gradient: 'from-emerald-500/20 via-teal-500/10 to-cyan-500/20',
        accent: 'text-emerald-400',
        badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
        bg: 'bg-emerald-500'
      },
      'executive': { 
        gradient: 'from-amber-500/20 via-orange-500/10 to-yellow-500/20',
        accent: 'text-amber-400',
        badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
        bg: 'bg-amber-500'
      },
    };
    return colors[activeTour?.persona || 'developer'] || colors['developer'];
  }, [activeTour?.persona]);

  const cycleActiveElement = useCallback(() => {
    if (currentStep?.interactiveElements?.length) {
      setActiveElementIndex(prev => 
        (prev + 1) % currentStep.interactiveElements!.length
      );
    }
  }, [currentStep?.interactiveElements]);

  // Don't render if no active tour
  if (!activeTour) return null;

  // Completion screen
  if (tourCompleted) {
    return createPortal(
      <div className="fixed inset-0 z-[9999] flex items-center justify-center">
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md animate-fade-in" />

        <div className={cn(
          'relative z-10 w-[500px] overflow-hidden rounded-2xl',
          'bg-surface border border-border-default',
          'shadow-2xl animate-scale-in'
        )}>
          <div className={cn('p-8 text-center bg-gradient-to-br', personaColors.gradient)}>
            <div className="w-20 h-20 rounded-full bg-surface/80 backdrop-blur flex items-center justify-center mx-auto mb-4 shadow-lg">
              <PartyPopper className="w-10 h-10 text-success" />
            </div>
            <h2 className="text-2xl font-bold text-text-primary mb-2">
              {activeTour.completionMessage}
            </h2>
            <p className="text-4xl mb-2">{activeTour.completionEmoji}</p>
          </div>

          <div className="p-6">
            <p className="text-center text-text-secondary mb-6">
              You've completed the <strong className="text-text-primary">{activeTour.title}</strong>.
            </p>

            <div className="flex items-center justify-center gap-3">
              <Button variant="secondary" onClick={restart} leftIcon={<RotateCcw className="w-4 h-4" />}>
                Replay
              </Button>
              <Button variant="primary" onClick={skip} rightIcon={<ArrowRight className="w-4 h-4" />}>
                Continue
              </Button>
            </div>
          </div>
        </div>
      </div>,
      document.body
    );
  }

  if (!currentStep) return null;

  const hasInteractiveElements = currentStep.interactiveElements && currentStep.interactiveElements.length > 0;

  return createPortal(
    <div className="fixed inset-0 z-[9999] pointer-events-none">
      {/* Semi-transparent overlay - lighter so page is more visible */}
      <div 
        className="absolute inset-0 bg-black/50 pointer-events-auto"
        onClick={() => {}}
      />

      {/* Floating beacons on page elements */}
      {hasInteractiveElements && currentStep.interactiveElements!.map((element, idx) => (
        <ElementBeacon
          key={`${currentStep.id}-${idx}`}
          element={element}
          index={idx}
          isActive={activeElementIndex === idx}
          personaColor={personaColors.bg}
          onActivate={() => setActiveElementIndex(idx)}
        />
      ))}

      {/* RIGHT SIDE PANEL - Fixed position, always visible */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 w-[380px] pointer-events-auto">
        <div className={cn(
          'rounded-2xl overflow-hidden',
          'bg-surface border border-border-default',
          'shadow-2xl'
        )}>
          {/* Header with step count */}
          <div className={cn(
            'px-5 py-4 border-b border-border-subtle',
            'bg-gradient-to-r',
            personaColors.gradient
          )}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center',
                  personaColors.bg
                )}>
                  <Target className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-text-primary">
                    {activeTour.title}
                  </div>
                  <div className="text-xs text-text-tertiary">
                    Step {progress.current} of {progress.total}
                  </div>
                </div>
              </div>
              <button
                onClick={skip}
                className="p-2 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-surface-raised transition-colors"
                aria-label="Exit tour"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Progress bar */}
            <div className="h-1.5 bg-black/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-500"
                style={{ width: `${(progress.current / progress.total) * 100}%` }}
              />
            </div>
          </div>

          {/* Content */}
          <div className="p-5">
            {/* JTBD */}
            <div className={cn(
              'flex items-start gap-3 p-3 rounded-xl mb-4',
              'bg-accent-subtle border border-accent-border'
            )}>
              <Lightbulb className={cn('w-5 h-5 flex-shrink-0', personaColors.accent)} />
              <p className="text-sm text-accent-text leading-snug">
                {currentStep.jtbd}
              </p>
            </div>

            {/* Title & Description */}
            <h3 className="text-lg font-bold text-text-primary mb-2">
              {currentStep.title}
            </h3>
            <p className="text-sm text-text-secondary mb-4 leading-relaxed">
              {currentStep.description}
            </p>

            {/* Interactive elements list - THESE MATCH THE NUMBERED BEACONS */}
            {hasInteractiveElements && (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <Crosshair className={cn('w-4 h-4', personaColors.accent)} />
                  <span className="text-xs font-semibold text-text-tertiary uppercase tracking-wider">
                    Find on the page
                  </span>
                </div>
                <div className="space-y-2">
                  {currentStep.interactiveElements!.map((element, idx) => {
                    const Icon = element.icon ? iconMap[element.icon] : Circle;
                    const isActive = activeElementIndex === idx;
                    
                    return (
                      <button
                        key={idx}
                        className={cn(
                          'w-full flex items-center gap-3 p-3 rounded-xl text-left',
                          'border-2 transition-all duration-200',
                          isActive 
                            ? cn('border-white bg-white/10', personaColors.bg.replace('bg-', 'bg-') + '/20')
                            : 'border-border-subtle bg-surface-raised hover:border-border-default'
                        )}
                        onClick={() => {
                          setActiveElementIndex(idx);
                          // Scroll element into view
                          const el = document.querySelector(element.selector);
                          if (el) {
                            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                          }
                        }}
                      >
                        {/* Number badge */}
                        <div className={cn(
                          'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                          'text-white font-bold text-sm',
                          isActive ? personaColors.bg : 'bg-text-disabled'
                        )}>
                          {idx + 1}
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            {Icon && <Icon className={cn(
                              'w-4 h-4',
                              isActive ? 'text-white' : 'text-text-tertiary'
                            )} />}
                            <span className={cn(
                              'text-sm font-medium truncate',
                              isActive ? 'text-white' : 'text-text-primary'
                            )}>
                              {element.label}
                            </span>
                          </div>
                          <p className={cn(
                            'text-xs truncate',
                            isActive ? 'text-white/70' : 'text-text-tertiary'
                          )}>
                            {element.description}
                          </p>
                        </div>

                        {/* Arrow indicator */}
                        <ArrowUpRight className={cn(
                          'w-4 h-4 flex-shrink-0 transition-transform',
                          isActive ? 'text-white scale-110' : 'text-text-disabled'
                        )} />
                      </button>
                    );
                  })}
                </div>
                
                {/* Cycle through elements button */}
                {currentStep.interactiveElements!.length > 1 && (
                  <button
                    onClick={cycleActiveElement}
                    className="mt-3 w-full flex items-center justify-center gap-2 py-2 text-xs text-text-tertiary hover:text-text-secondary transition-colors"
                  >
                    <Move className="w-3 h-3" />
                    Click to highlight next element
                  </button>
                )}
              </div>
            )}

            {/* Try it prompt */}
            {currentStep.tryItPrompt && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-success-subtle border border-success-border mb-4">
                <Sparkles className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                <p className="text-xs text-success-text">
                  <strong>Try it:</strong> {currentStep.tryItPrompt}
                </p>
              </div>
            )}
          </div>

          {/* Navigation footer */}
          <div className="px-5 py-4 border-t border-border-subtle bg-surface-raised">
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
                size="md"
                variant="primary"
                onClick={next}
                rightIcon={isLastStep ? <Check className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              >
                {isLastStep ? 'Complete' : 'Next'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Instruction banner at top */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 pointer-events-auto">
        <div className={cn(
          'flex items-center gap-3 px-5 py-3 rounded-full',
          'bg-surface border border-border-default shadow-lg'
        )}>
          <div className={cn(
            'w-6 h-6 rounded-full flex items-center justify-center',
            personaColors.bg
          )}>
            <span className="text-white text-xs font-bold">{progress.current}</span>
          </div>
          <span className="text-sm text-text-secondary">
            Look for the <strong className="text-text-primary">numbered markers</strong> on the page
          </span>
          <button
            onClick={skip}
            className="text-xs text-text-disabled hover:text-text-tertiary ml-2"
          >
            Exit tour
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
