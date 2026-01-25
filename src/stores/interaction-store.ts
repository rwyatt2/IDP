import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Types for interactions
interface DeploymentApproval {
  deploymentId: string;
  status: 'approved' | 'rejected';
  approvedBy: string;
  timestamp: string;
  comment?: string;
}

interface IncidentUpdate {
  incidentId: string;
  status: string;
  assignee?: string;
  acknowledged: boolean;
  resolvedAt?: string;
}

interface AlertAcknowledgment {
  alertId: string;
  acknowledgedBy: string;
  timestamp: string;
}

interface InteractionState {
  // Deployment approvals
  deploymentApprovals: DeploymentApproval[];
  approveDeployment: (deploymentId: string, comment?: string) => void;
  rejectDeployment: (deploymentId: string, comment?: string) => void;
  getDeploymentApproval: (deploymentId: string) => DeploymentApproval | undefined;

  // Incident management
  incidentUpdates: Record<string, IncidentUpdate>;
  acknowledgeIncident: (incidentId: string) => void;
  assignIncident: (incidentId: string, assignee: string) => void;
  resolveIncident: (incidentId: string) => void;
  updateIncidentStatus: (incidentId: string, status: string) => void;
  getIncidentUpdate: (incidentId: string) => IncidentUpdate | undefined;

  // Alert acknowledgments
  alertAcknowledgments: AlertAcknowledgment[];
  acknowledgeAlert: (alertId: string) => void;
  isAlertAcknowledged: (alertId: string) => boolean;

  // Favorites
  favoriteApplications: string[];
  toggleFavoriteApp: (appId: string) => void;
  isFavoriteApp: (appId: string) => boolean;

  // Recently viewed
  recentlyViewed: Array<{ type: string; id: string; name: string; timestamp: string }>;
  addRecentlyViewed: (type: string, id: string, name: string) => void;

  // Quick actions history
  actionHistory: Array<{ action: string; target: string; timestamp: string }>;
  logAction: (action: string, target: string) => void;
}

export const useInteractionStore = create<InteractionState>()(
  persist(
    (set, get) => ({
      // Deployment approvals
      deploymentApprovals: [],
      approveDeployment: (deploymentId, comment) =>
        set((state) => ({
          deploymentApprovals: [
            ...state.deploymentApprovals.filter((a) => a.deploymentId !== deploymentId),
            {
              deploymentId,
              status: 'approved',
              approvedBy: 'Sarah Chen',
              timestamp: new Date().toISOString(),
              comment,
            },
          ],
        })),
      rejectDeployment: (deploymentId, comment) =>
        set((state) => ({
          deploymentApprovals: [
            ...state.deploymentApprovals.filter((a) => a.deploymentId !== deploymentId),
            {
              deploymentId,
              status: 'rejected',
              approvedBy: 'Sarah Chen',
              timestamp: new Date().toISOString(),
              comment,
            },
          ],
        })),
      getDeploymentApproval: (deploymentId) =>
        get().deploymentApprovals.find((a) => a.deploymentId === deploymentId),

      // Incident management
      incidentUpdates: {},
      acknowledgeIncident: (incidentId) =>
        set((state) => ({
          incidentUpdates: {
            ...state.incidentUpdates,
            [incidentId]: {
              ...(state.incidentUpdates[incidentId] || { incidentId, status: 'investigating' }),
              acknowledged: true,
            },
          },
        })),
      assignIncident: (incidentId, assignee) =>
        set((state) => ({
          incidentUpdates: {
            ...state.incidentUpdates,
            [incidentId]: {
              ...(state.incidentUpdates[incidentId] || { incidentId, status: 'investigating', acknowledged: false }),
              assignee,
            },
          },
        })),
      resolveIncident: (incidentId) =>
        set((state) => ({
          incidentUpdates: {
            ...state.incidentUpdates,
            [incidentId]: {
              ...(state.incidentUpdates[incidentId] || { incidentId, acknowledged: false }),
              status: 'resolved',
              resolvedAt: new Date().toISOString(),
            },
          },
        })),
      updateIncidentStatus: (incidentId, status) =>
        set((state) => ({
          incidentUpdates: {
            ...state.incidentUpdates,
            [incidentId]: {
              ...(state.incidentUpdates[incidentId] || { incidentId, acknowledged: false }),
              status,
            },
          },
        })),
      getIncidentUpdate: (incidentId) => get().incidentUpdates[incidentId],

      // Alert acknowledgments
      alertAcknowledgments: [],
      acknowledgeAlert: (alertId) =>
        set((state) => ({
          alertAcknowledgments: [
            ...state.alertAcknowledgments.filter((a) => a.alertId !== alertId),
            {
              alertId,
              acknowledgedBy: 'Sarah Chen',
              timestamp: new Date().toISOString(),
            },
          ],
        })),
      isAlertAcknowledged: (alertId) =>
        get().alertAcknowledgments.some((a) => a.alertId === alertId),

      // Favorites
      favoriteApplications: [],
      toggleFavoriteApp: (appId) =>
        set((state) => ({
          favoriteApplications: state.favoriteApplications.includes(appId)
            ? state.favoriteApplications.filter((id) => id !== appId)
            : [...state.favoriteApplications, appId],
        })),
      isFavoriteApp: (appId) => get().favoriteApplications.includes(appId),

      // Recently viewed
      recentlyViewed: [],
      addRecentlyViewed: (type, id, name) =>
        set((state) => ({
          recentlyViewed: [
            { type, id, name, timestamp: new Date().toISOString() },
            ...state.recentlyViewed.filter((r) => !(r.type === type && r.id === id)),
          ].slice(0, 10),
        })),

      // Action history
      actionHistory: [],
      logAction: (action, target) =>
        set((state) => ({
          actionHistory: [
            { action, target, timestamp: new Date().toISOString() },
            ...state.actionHistory,
          ].slice(0, 50),
        })),
    }),
    {
      name: 'interaction-storage',
    }
  )
);
