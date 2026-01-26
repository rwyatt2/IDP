import { useState } from 'react';
import { cn } from '@/lib/utils';
import { usePersonaStore } from '@/stores';
import { PERSONAS, type PersonaType } from '@/types/persona';
import {
  Code,
  Users,
  BarChart3,
  Briefcase,
  ChevronDown,
  Check,
} from 'lucide-react';

const personaIcons: Record<PersonaType, React.ReactNode> = {
  developer: <Code className="w-4 h-4" aria-hidden="true" />,
  'tech-lead': <Users className="w-4 h-4" aria-hidden="true" />,
  'engineering-manager': <BarChart3 className="w-4 h-4" aria-hidden="true" />,
  executive: <Briefcase className="w-4 h-4" aria-hidden="true" />,
};

const personaColors: Record<PersonaType, string> = {
  developer: 'text-blue-400',
  'tech-lead': 'text-violet-400',
  'engineering-manager': 'text-emerald-400',
  executive: 'text-amber-400',
};

export function PersonaSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentPersona, setPersona } = usePersonaStore();
  const persona = PERSONAS[currentPersona];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2.5 px-3.5 py-2 rounded-lg',
          'bg-surface-raised border border-border-subtle',
          'text-sm font-medium text-text-secondary',
          'hover:border-border-default hover:text-text-primary',
          'transition-all duration-fast',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent'
        )}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={`Current persona: ${persona.name}. Click to change.`}
      >
        <span className={personaColors[currentPersona]}>
          {personaIcons[currentPersona]}
        </span>
        <span className="hidden sm:inline">{persona.name}</span>
        <ChevronDown 
          className={cn(
            'w-4 h-4 text-text-tertiary transition-transform duration-fast',
            isOpen && 'rotate-180'
          )} 
          aria-hidden="true" 
        />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-dropdown" 
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          
          {/* Dropdown */}
          <div 
            className={cn(
              'absolute right-0 mt-2 w-72 z-dropdown',
              'bg-surface-raised border border-border-default rounded-xl',
              'shadow-xl animate-scale-in overflow-hidden'
            )}
            role="menu"
            aria-label="Select persona"
          >
            <div className="p-3 border-b border-border-subtle">
              <p className="text-xs font-medium text-text-tertiary uppercase tracking-wider">
                Switch Persona View
              </p>
              <p className="text-xs text-text-disabled mt-1">
                Experience the platform as different roles
              </p>
            </div>
            
            <div className="p-2">
              {(Object.keys(PERSONAS) as PersonaType[]).map((personaKey) => {
                const p = PERSONAS[personaKey];
                const isSelected = currentPersona === personaKey;
                
                return (
                  <button
                    key={personaKey}
                    onClick={() => {
                      setPersona(personaKey);
                      setIsOpen(false);
                    }}
                    className={cn(
                      'w-full flex items-start gap-3 p-3 rounded-lg text-left',
                      'transition-all duration-fast',
                      isSelected 
                        ? 'bg-accent-subtle border border-accent-border' 
                        : 'hover:bg-surface-overlay border border-transparent'
                    )}
                    role="menuitem"
                    aria-current={isSelected ? 'true' : undefined}
                  >
                    <div className={cn(
                      'w-8 h-8 rounded-lg flex items-center justify-center',
                      'bg-surface border border-border-subtle',
                      personaColors[personaKey]
                    )}>
                      {personaIcons[personaKey]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm text-text-primary">
                          {p.name}
                        </span>
                        {isSelected && (
                          <Check className="w-3.5 h-3.5 text-accent" aria-hidden="true" />
                        )}
                      </div>
                      <p className="text-xs text-text-tertiary mt-0.5">
                        {p.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
            
            <div className="p-3 border-t border-border-subtle bg-canvas/50">
              <p className="text-xs text-text-disabled">
                Persona switching is for demo purposes. In production, this would be based on your role.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
