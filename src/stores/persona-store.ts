import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PersonaType, Persona, DeveloperMetrics, TechLeadMetrics, ManagerMetrics, ExecutiveMetrics } from '@/types/persona';
import { PERSONAS, WIDGET_REGISTRY } from '@/types/persona';

interface PersonaState {
  // Current persona
  currentPersona: PersonaType;
  setPersona: (persona: PersonaType) => void;
  
  // Persona data
  getPersona: () => Persona;
  getWidgetsForPersona: () => string[];
  getQuickActions: () => Persona['quickActions'];
  
  // Metrics per persona
  developerMetrics: DeveloperMetrics;
  techLeadMetrics: TechLeadMetrics;
  managerMetrics: ManagerMetrics;
  executiveMetrics: ExecutiveMetrics;
  
  // User info
  user: {
    name: string;
    email: string;
    avatar?: string;
    team: string;
    role: string;
  };
}

// Mock data for each persona
const mockDeveloperMetrics: DeveloperMetrics = {
  myServices: 3,
  activeDeployments: 1,
  pendingPRs: 4,
  incidentsAssigned: 0,
  recentSearches: ['authentication api', 'payment service', 'user dashboard'],
  favoriteServices: ['api-gateway', 'auth-service', 'user-dashboard'],
};

const mockTechLeadMetrics: TechLeadMetrics = {
  teamMembers: 6,
  teamServices: 8,
  pendingApprovals: 2,
  activeIncidents: 1,
  deploymentSuccessRate: 94.5,
  teamVelocity: 42,
  onCallToday: 'Emily Wang',
};

const mockManagerMetrics: ManagerMetrics = {
  totalTeams: 4,
  totalEngineers: 28,
  monthlySpend: 145850,
  spendTrend: 8.5,
  crossTeamDependencies: 12,
  complianceScore: 94,
  avgDeployFrequency: 3.2,
};

const mockExecutiveMetrics: ExecutiveMetrics = {
  technologyROI: 3.2,
  operationalRisk: 'low',
  complianceStatus: 'compliant',
  engineeringEfficiency: 87,
  customerImpactScore: 94,
  innovationIndex: 72,
};

export const usePersonaStore = create<PersonaState>()(
  persist(
    (set, get) => ({
      currentPersona: 'developer',
      
      setPersona: (persona) => set({ currentPersona: persona }),
      
      getPersona: () => PERSONAS[get().currentPersona],
      
      getWidgetsForPersona: () => {
        const persona = get().currentPersona;
        return WIDGET_REGISTRY
          .filter(w => w.personas.includes(persona))
          .map(w => w.id);
      },
      
      getQuickActions: () => PERSONAS[get().currentPersona].quickActions,
      
      developerMetrics: mockDeveloperMetrics,
      techLeadMetrics: mockTechLeadMetrics,
      managerMetrics: mockManagerMetrics,
      executiveMetrics: mockExecutiveMetrics,
      
      user: {
        name: 'Sarah Chen',
        email: 'sarah.chen@company.com',
        avatar: undefined,
        team: 'Platform Engineering',
        role: 'Senior Engineer',
      },
    }),
    {
      name: 'persona-storage',
      partialize: (state) => ({ currentPersona: state.currentPersona }),
    }
  )
);

// Helper hook for getting persona-specific data
export function usePersona() {
  const store = usePersonaStore();
  const persona = PERSONAS[store.currentPersona];
  
  return {
    persona,
    personaType: store.currentPersona,
    setPersona: store.setPersona,
    widgets: store.getWidgetsForPersona(),
    quickActions: persona.quickActions,
    jobsToBeDone: persona.jobsToBeDone,
    user: store.user,
    metrics: {
      developer: store.developerMetrics,
      techLead: store.techLeadMetrics,
      manager: store.managerMetrics,
      executive: store.executiveMetrics,
    },
  };
}
