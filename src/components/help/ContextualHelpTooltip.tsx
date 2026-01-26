import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import { 
  HelpCircle, 
  X, 
  ExternalLink, 
  BookOpen, 
  Video, 
  Copy, 
  Check,
  ChevronRight,
  Lightbulb,
} from 'lucide-react';
import type { HelpContent, CodeExample } from '@/types/documentation';

interface ContextualHelpTooltipProps {
  content: HelpContent;
  children: React.ReactNode;
  trigger?: 'hover' | 'click' | 'focus';
  position?: 'top' | 'bottom' | 'left' | 'right' | 'auto';
  showIcon?: boolean;
  className?: string;
}

export function ContextualHelpTooltip({
  content,
  children,
  trigger = 'hover',
  position = 'auto',
  showIcon = true,
  className,
}: ContextualHelpTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showDetailed, setShowDetailed] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [actualPosition, setActualPosition] = useState(position);

  useEffect(() => {
    if (isOpen && triggerRef.current && tooltipRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const viewport = { width: window.innerWidth, height: window.innerHeight };

      let pos = position;
      if (position === 'auto') {
        // Determine best position
        const spaceAbove = triggerRect.top;
        const spaceBelow = viewport.height - triggerRect.bottom;
        const spaceRight = viewport.width - triggerRect.right;

        if (spaceBelow >= tooltipRect.height + 10) {
          pos = 'bottom';
        } else if (spaceAbove >= tooltipRect.height + 10) {
          pos = 'top';
        } else if (spaceRight >= tooltipRect.width + 10) {
          pos = 'right';
        } else {
          pos = 'left';
        }
      }

      let top = 0;
      let left = 0;

      switch (pos) {
        case 'top':
          top = triggerRect.top - tooltipRect.height - 8;
          left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
          break;
        case 'bottom':
          top = triggerRect.bottom + 8;
          left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
          break;
        case 'left':
          top = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
          left = triggerRect.left - tooltipRect.width - 8;
          break;
        case 'right':
          top = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
          left = triggerRect.right + 8;
          break;
      }

      // Keep within viewport
      left = Math.max(10, Math.min(left, viewport.width - tooltipRect.width - 10));
      top = Math.max(10, Math.min(top, viewport.height - tooltipRect.height - 10));

      setTooltipPosition({ top, left });
      setActualPosition(pos);
    }
  }, [isOpen, position]);

  const handleCopyCode = async (code: string, id: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleTrigger = () => {
    if (trigger === 'click') {
      setIsOpen(!isOpen);
    }
  };

  const handleMouseEnter = () => {
    if (trigger === 'hover') {
      setIsOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (trigger === 'hover') {
      setIsOpen(false);
      setShowDetailed(false);
    }
  };

  const handleFocus = () => {
    if (trigger === 'focus') {
      setIsOpen(true);
    }
  };

  const handleBlur = () => {
    if (trigger === 'focus') {
      setIsOpen(false);
      setShowDetailed(false);
    }
  };

  const arrowClasses = {
    top: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45',
    bottom: 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45',
    left: 'right-0 top-1/2 -translate-y-1/2 translate-x-1/2 rotate-45',
    right: 'left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 rotate-45',
    auto: 'hidden',
  };

  return (
    <>
      <div
        ref={triggerRef}
        className={cn('inline-flex items-center gap-1', className)}
        onClick={handleTrigger}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        tabIndex={trigger === 'focus' ? 0 : undefined}
      >
        {children}
        {showIcon && (
          <HelpCircle className="w-4 h-4 text-text-tertiary hover:text-accent cursor-help transition-colors" />
        )}
      </div>

      {isOpen &&
        createPortal(
          <div
            ref={tooltipRef}
            className={cn(
              'fixed z-[9999] max-w-md animate-fade-in',
              'bg-surface-overlay border border-border-subtle rounded-lg shadow-xl'
            )}
            style={{ top: tooltipPosition.top, left: tooltipPosition.left }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {/* Arrow */}
            <div
              className={cn(
                'absolute w-2 h-2 bg-surface-overlay border-l border-t border-border-subtle',
                arrowClasses[actualPosition]
              )}
            />

            <div className="p-4">
              {/* Quick help */}
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
                  <Lightbulb className="w-4 h-4 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-text-primary leading-relaxed">
                    {content.quick}
                  </p>
                </div>
                {trigger === 'click' && (
                  <button
                    onClick={() => setIsOpen(false)}
                    className="flex-shrink-0 p-1 hover:bg-surface-raised rounded transition-colors"
                  >
                    <X className="w-4 h-4 text-text-tertiary" />
                  </button>
                )}
              </div>

              {/* Show more toggle */}
              {content.detailed && !showDetailed && (
                <button
                  onClick={() => setShowDetailed(true)}
                  className="mt-3 flex items-center gap-1 text-xs text-accent hover:text-accent-hover transition-colors"
                >
                  <span>Learn more</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              )}

              {/* Detailed content */}
              {showDetailed && content.detailed && (
                <div className="mt-4 pt-4 border-t border-border-subtle space-y-4">
                  <p className="text-sm text-text-secondary whitespace-pre-line">
                    {content.detailed}
                  </p>

                  {/* Code examples */}
                  {content.examples && content.examples.length > 0 && (
                    <div className="space-y-3">
                      {content.examples.map((example: CodeExample) => (
                        <div key={example.id}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-text-tertiary">
                              {example.title}
                            </span>
                            <button
                              onClick={() => handleCopyCode(example.code, example.id)}
                              className="p-1 hover:bg-surface-raised rounded transition-colors"
                              title="Copy code"
                            >
                              {copiedCode === example.id ? (
                                <Check className="w-3 h-3 text-success" />
                              ) : (
                                <Copy className="w-3 h-3 text-text-tertiary" />
                              )}
                            </button>
                          </div>
                          <pre className="p-3 bg-surface rounded-lg text-xs text-text-secondary overflow-x-auto">
                            <code>{example.code}</code>
                          </pre>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Related links */}
                  {content.relatedLinks && content.relatedLinks.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-text-tertiary">Related</p>
                      <div className="space-y-1">
                        {content.relatedLinks.map((link, i) => (
                          <a
                            key={i}
                            href={link.url}
                            target={link.type === 'external' ? '_blank' : undefined}
                            rel={link.type === 'external' ? 'noopener noreferrer' : undefined}
                            className="flex items-center gap-2 text-sm text-accent hover:text-accent-hover transition-colors"
                          >
                            {link.type === 'external' ? (
                              <ExternalLink className="w-3 h-3" />
                            ) : (
                              <BookOpen className="w-3 h-3" />
                            )}
                            <span>{link.label}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Video link */}
                  {content.videoUrl && (
                    <a
                      href={content.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-accent hover:text-accent-hover transition-colors"
                    >
                      <Video className="w-4 h-4" />
                      <span>Watch video tutorial</span>
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
