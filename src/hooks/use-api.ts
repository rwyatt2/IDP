import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Application, Deployment, Incident, CostData, Activity, Extension } from '@/types';
import {
  applications,
  deployments,
  incidents,
  costData,
  activities,
  extensions,
  teams,
} from '@/data/mock-data';

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// ============================================================================
// Applications
// ============================================================================

export function useApplications() {
  return useQuery({
    queryKey: ['applications'],
    queryFn: async (): Promise<Application[]> => {
      await delay(300);
      return applications;
    },
  });
}

export function useApplication(id: string) {
  return useQuery({
    queryKey: ['applications', id],
    queryFn: async (): Promise<Application | undefined> => {
      await delay(200);
      return applications.find((app) => app.id === id);
    },
    enabled: !!id,
  });
}

export function useMyApplications(userId: string) {
  return useQuery({
    queryKey: ['applications', 'owned', userId],
    queryFn: async (): Promise<Application[]> => {
      await delay(250);
      return applications.filter((app) => app.owners.includes(userId));
    },
    enabled: !!userId,
  });
}

export function useApplicationsByTeam(teamId: string) {
  return useQuery({
    queryKey: ['applications', 'team', teamId],
    queryFn: async (): Promise<Application[]> => {
      await delay(250);
      return applications.filter((app) => app.team.id === teamId);
    },
    enabled: !!teamId,
  });
}

// ============================================================================
// Deployments
// ============================================================================

export function useDeployments() {
  return useQuery({
    queryKey: ['deployments'],
    queryFn: async (): Promise<Deployment[]> => {
      await delay(300);
      return deployments;
    },
  });
}

export function useDeployment(id: string) {
  return useQuery({
    queryKey: ['deployments', id],
    queryFn: async (): Promise<Deployment | undefined> => {
      await delay(200);
      return deployments.find((d) => d.id === id);
    },
    enabled: !!id,
  });
}

export function useRecentDeployments(limit = 5) {
  return useQuery({
    queryKey: ['deployments', 'recent', limit],
    queryFn: async (): Promise<Deployment[]> => {
      await delay(250);
      return deployments
        .sort((a, b) => new Date(b.triggeredAt).getTime() - new Date(a.triggeredAt).getTime())
        .slice(0, limit);
    },
  });
}

export function useDeploymentsByApplication(applicationId: string) {
  return useQuery({
    queryKey: ['deployments', 'application', applicationId],
    queryFn: async (): Promise<Deployment[]> => {
      await delay(250);
      return deployments.filter((d) => d.applicationId === applicationId);
    },
    enabled: !!applicationId,
  });
}

export function useApproveDeployment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ deploymentId, approved }: { deploymentId: string; approved: boolean }) => {
      await delay(500);
      // In a real app, this would make an API call
      return { deploymentId, approved };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deployments'] });
    },
  });
}

// ============================================================================
// Incidents
// ============================================================================

export function useIncidents() {
  return useQuery({
    queryKey: ['incidents'],
    queryFn: async (): Promise<Incident[]> => {
      await delay(300);
      return incidents;
    },
  });
}

export function useIncident(id: string) {
  return useQuery({
    queryKey: ['incidents', id],
    queryFn: async (): Promise<Incident | undefined> => {
      await delay(200);
      return incidents.find((i) => i.id === id);
    },
    enabled: !!id,
  });
}

export function useActiveIncidents() {
  return useQuery({
    queryKey: ['incidents', 'active'],
    queryFn: async (): Promise<Incident[]> => {
      await delay(250);
      return incidents.filter((i) => i.status !== 'resolved');
    },
  });
}

// ============================================================================
// Costs
// ============================================================================

export function useCostData() {
  return useQuery({
    queryKey: ['costs'],
    queryFn: async (): Promise<CostData[]> => {
      await delay(300);
      return costData;
    },
  });
}

export function useCostByApplication(applicationId: string) {
  return useQuery({
    queryKey: ['costs', applicationId],
    queryFn: async (): Promise<CostData | undefined> => {
      await delay(200);
      return costData.find((c) => c.applicationId === applicationId);
    },
    enabled: !!applicationId,
  });
}

export function useTotalCosts() {
  return useQuery({
    queryKey: ['costs', 'total'],
    queryFn: async () => {
      await delay(200);
      const total = costData.reduce((sum, c) => sum + c.currentMonth, 0);
      const previous = costData.reduce((sum, c) => sum + c.previousMonth, 0);
      const forecast = costData.reduce((sum, c) => sum + c.forecast, 0);
      return {
        currentMonth: total,
        previousMonth: previous,
        forecast,
        trend: ((total - previous) / previous) * 100,
      };
    },
  });
}

// ============================================================================
// Activities
// ============================================================================

export function useActivities(limit = 10) {
  return useQuery({
    queryKey: ['activities', limit],
    queryFn: async (): Promise<Activity[]> => {
      await delay(250);
      return activities
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, limit);
    },
  });
}

// ============================================================================
// Extensions
// ============================================================================

export function useExtensions() {
  return useQuery({
    queryKey: ['extensions'],
    queryFn: async (): Promise<Extension[]> => {
      await delay(300);
      return extensions;
    },
  });
}

export function useExtension(id: string) {
  return useQuery({
    queryKey: ['extensions', id],
    queryFn: async (): Promise<Extension | undefined> => {
      await delay(200);
      return extensions.find((e) => e.id === id);
    },
    enabled: !!id,
  });
}

// ============================================================================
// Teams
// ============================================================================

export function useTeams() {
  return useQuery({
    queryKey: ['teams'],
    queryFn: async () => {
      await delay(250);
      return teams;
    },
  });
}

export function useTeam(id: string) {
  return useQuery({
    queryKey: ['teams', id],
    queryFn: async () => {
      await delay(200);
      return teams.find((t) => t.id === id);
    },
    enabled: !!id,
  });
}

// ============================================================================
// System Health
// ============================================================================

export function useSystemHealth() {
  return useQuery({
    queryKey: ['health', 'system'],
    queryFn: async () => {
      await delay(200);
      const healthy = applications.filter((a) => a.status === 'healthy').length;
      const degraded = applications.filter((a) => a.status === 'degraded').length;
      const critical = applications.filter((a) => a.status === 'critical').length;
      const total = applications.length;
      
      return {
        healthy,
        degraded,
        critical,
        total,
        overallHealth: healthy / total,
        activeIncidents: incidents.filter((i) => i.status !== 'resolved').length,
      };
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });
}

// ============================================================================
// Pending Approvals
// ============================================================================

export function usePendingApprovals() {
  return useQuery({
    queryKey: ['approvals', 'pending'],
    queryFn: async () => {
      await delay(200);
      return deployments.filter((d) => d.status === 'awaiting-approval');
    },
  });
}
