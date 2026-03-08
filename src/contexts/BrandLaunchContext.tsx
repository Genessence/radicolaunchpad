import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import {
  Brand, BlendTrial, StateCompliance, ProductionBatch, Distributor,
  MarketingAsset, RiskAlert, ActivityItem, NextAction, StateOpportunity,
  demoBrands, demoBlendTrials, demoStateCompliance, demoProductionBatches,
  demoDistributors, demoMarketingAssets, demoRiskAlerts, demoActivities,
  demoNextActions, demoStateOpportunities, calculateLaunchReadiness,
  StageGateKey,
} from '@/data/mockData';

interface AppState {
  brands: Brand[];
  blendTrials: BlendTrial[];
  stateCompliance: StateCompliance[];
  productionBatches: ProductionBatch[];
  distributors: Distributor[];
  marketingAssets: MarketingAsset[];
  riskAlerts: RiskAlert[];
  activities: ActivityItem[];
  nextActions: NextAction[];
  stateOpportunities: StateOpportunity[];
  selectedBrandId: string | 'all';
}

type Action =
  | { type: 'SELECT_BRAND'; brandId: string | 'all' }
  | { type: 'APPROVE_COMPLIANCE'; complianceId: string; field: 'labelRegistration' | 'brandRegistration' | 'priceApproval' }
  | { type: 'UPDATE_BRAND_READINESS'; brandId: string; field: keyof Brand['readiness']; value: number }
  | { type: 'SIMULATE_APPROVAL'; brandId: string; state: string }
  | { type: 'ADD_ACTIVITY'; activity: ActivityItem }
  | { type: 'UPDATE_STAGE_DATES'; brandId: string; stageKey: StageGateKey; plannedStart?: string; plannedEnd?: string; actualStart?: string; actualEnd?: string }
  | { type: 'SUBMIT_FOR_APPROVAL'; brandId: string; stageKey: StageGateKey }
  | { type: 'APPROVE_STAGE'; brandId: string; stageKey: StageGateKey; approvedBy: string }
  | { type: 'REJECT_STAGE'; brandId: string; stageKey: StageGateKey; comment: string }
  | { type: 'COMPLETE_SUB_TASK'; brandId: string; stageKey: StageGateKey; subTaskId: string }
  | { type: 'UPDATE_STAGE_COST'; brandId: string; stageKey: StageGateKey; budget?: number; actualCost?: number };

const initialState: AppState = {
  brands: demoBrands,
  blendTrials: demoBlendTrials,
  stateCompliance: demoStateCompliance,
  productionBatches: demoProductionBatches,
  distributors: demoDistributors,
  marketingAssets: demoMarketingAssets,
  riskAlerts: demoRiskAlerts,
  activities: demoActivities,
  nextActions: demoNextActions,
  stateOpportunities: demoStateOpportunities,
  selectedBrandId: 'all',
};

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SELECT_BRAND':
      return { ...state, selectedBrandId: action.brandId };

    case 'APPROVE_COMPLIANCE': {
      const updatedCompliance = state.stateCompliance.map(c =>
        c.id === action.complianceId ? { ...c, [action.field]: 'approved' as const } : c
      );
      // Recalculate brand compliance readiness
      const brandId = state.stateCompliance.find(c => c.id === action.complianceId)?.brandId;
      const updatedBrands = brandId ? state.brands.map(b => {
        if (b.id !== brandId) return b;
        const brandCompliance = updatedCompliance.filter(c => c.brandId === brandId);
        const totalFields = brandCompliance.length * 3;
        const approvedFields = brandCompliance.reduce((sum, c) => {
          return sum + (c.labelRegistration === 'approved' ? 1 : 0) + (c.brandRegistration === 'approved' ? 1 : 0) + (c.priceApproval === 'approved' ? 1 : 0);
        }, 0);
        const newCompliance = Math.round((approvedFields / totalFields) * 100);
        return { ...b, readiness: { ...b.readiness, compliance: newCompliance } };
      }) : state.brands;

      return { ...state, stateCompliance: updatedCompliance, brands: updatedBrands };
    }

    case 'UPDATE_BRAND_READINESS':
      return {
        ...state,
        brands: state.brands.map(b =>
          b.id === action.brandId
            ? { ...b, readiness: { ...b.readiness, [action.field]: action.value } }
            : b
        ),
      };

    case 'SIMULATE_APPROVAL': {
      // Find pending compliance for this brand+state and approve everything
      const updatedCompliance = state.stateCompliance.map(c => {
        if (c.brandId === action.brandId && c.state === action.state) {
          return { ...c, labelRegistration: 'approved' as const, brandRegistration: 'approved' as const, priceApproval: 'approved' as const };
        }
        return c;
      });

      const updatedBrands = state.brands.map(b => {
        if (b.id !== action.brandId) return b;
        const brandCompliance = updatedCompliance.filter(c => c.brandId === b.id);
        const totalFields = brandCompliance.length * 3;
        const approvedFields = brandCompliance.reduce((sum, c) => {
          return sum + (c.labelRegistration === 'approved' ? 1 : 0) + (c.brandRegistration === 'approved' ? 1 : 0) + (c.priceApproval === 'approved' ? 1 : 0);
        }, 0);
        const newCompliance = Math.round((approvedFields / totalFields) * 100);
        const newReadiness = { ...b.readiness, compliance: newCompliance };
        // Boost projected revenue
        const stateOpp = state.stateOpportunities.find(s => s.stateCode === action.state);
        const revBoost = stateOpp ? Math.round(stateOpp.projectedRevenue * 0.3) : 5;
        return { ...b, readiness: newReadiness, projectedRevenue: b.projectedRevenue + revBoost };
      });

      const updatedOpps = state.stateOpportunities.map(s =>
        s.stateCode === action.state ? { ...s, approvalStatus: 'approved' as const, labelApproval: 'approved' as const, priceApproval: 'approved' as const } : s
      );

      const newActivity: ActivityItem = {
        id: `a-sim-${Date.now()}`,
        brandId: action.brandId,
        action: `All approvals simulated for ${action.state}`,
        user: 'Simulation Engine',
        timestamp: 'Just now',
        type: 'approval',
      };

      return {
        ...state,
        stateCompliance: updatedCompliance,
        brands: updatedBrands,
        stateOpportunities: updatedOpps,
        activities: [newActivity, ...state.activities],
      };
    }

    case 'ADD_ACTIVITY':
      return { ...state, activities: [action.activity, ...state.activities] };

    case 'UPDATE_STAGE_DATES': {
      const updatedBrands = state.brands.map(b => {
        if (b.id !== action.brandId) return b;
        return {
          ...b,
          stageGates: b.stageGates.map(g => {
            if (g.key !== action.stageKey) return g;
            return {
              ...g,
              ...(action.plannedStart != null && { plannedStart: action.plannedStart }),
              ...(action.plannedEnd != null && { plannedEnd: action.plannedEnd }),
              ...(action.actualStart != null && { actualStart: action.actualStart }),
              ...(action.actualEnd != null && { actualEnd: action.actualEnd }),
            };
          }),
        };
      });
      return { ...state, brands: updatedBrands };
    }

    case 'SUBMIT_FOR_APPROVAL': {
      const updatedBrands = state.brands.map(b => {
        if (b.id !== action.brandId) return b;
        return {
          ...b,
          stageGates: b.stageGates.map(g => {
            if (g.key !== action.stageKey) return g;
            const allComplete = g.subTasks.every(t => t.completed);
            if (!allComplete) return g;
            return { ...g, status: 'pending-approval' as const };
          }),
        };
      });
      const brand = updatedBrands.find(b => b.id === action.brandId);
      const gate = brand?.stageGates.find(g => g.key === action.stageKey);
      if (gate?.status === 'pending-approval') {
        const newActivity: ActivityItem = {
          id: `a-${Date.now()}`,
          brandId: action.brandId,
          action: `${gate.label} submitted for approval`,
          user: gate.owner,
          timestamp: 'Just now',
          type: 'submission',
        };
        return { ...state, brands: updatedBrands, activities: [newActivity, ...state.activities] };
      }
      return { ...state, brands: updatedBrands };
    }

    case 'APPROVE_STAGE': {
      const updatedBrands = state.brands.map(b => {
        if (b.id !== action.brandId) return b;
        return {
          ...b,
          stageGates: b.stageGates.map(g => {
            if (g.key !== action.stageKey) return g;
            if (g.status !== 'pending-approval') return g;
            return {
              ...g,
              status: 'completed' as const,
              actualEnd: new Date().toISOString().slice(0, 10),
              adminApprovedAt: new Date().toISOString(),
              adminApprovedBy: action.approvedBy,
              rejectionComment: undefined,
            };
          }),
        };
      });
      const brand = updatedBrands.find(b => b.id === action.brandId);
      const gate = brand?.stageGates.find(g => g.key === action.stageKey);
      if (gate?.status === 'completed') {
        const newActivity: ActivityItem = {
          id: `a-${Date.now()}`,
          brandId: action.brandId,
          action: `${gate.label} approved by ${action.approvedBy}`,
          user: action.approvedBy,
          timestamp: 'Just now',
          type: 'approval',
        };
        return { ...state, brands: updatedBrands, activities: [newActivity, ...state.activities] };
      }
      return { ...state, brands: updatedBrands };
    }

    case 'REJECT_STAGE': {
      const updatedBrands = state.brands.map(b => {
        if (b.id !== action.brandId) return b;
        return {
          ...b,
          stageGates: b.stageGates.map(g => {
            if (g.key !== action.stageKey) return g;
            if (g.status !== 'pending-approval') return g;
            return {
              ...g,
              status: 'in-progress' as const,
              rejectionComment: action.comment,
            };
          }),
        };
      });
      const brand = updatedBrands.find(b => b.id === action.brandId);
      const gate = brand?.stageGates.find(g => g.key === action.stageKey);
      if (gate?.status === 'in-progress' && gate?.rejectionComment) {
        const newActivity: ActivityItem = {
          id: `a-${Date.now()}`,
          brandId: action.brandId,
          action: `${gate.label} rejected: ${action.comment}`,
          user: 'Admin',
          timestamp: 'Just now',
          type: 'alert',
        };
        return { ...state, brands: updatedBrands, activities: [newActivity, ...state.activities] };
      }
      return { ...state, brands: updatedBrands };
    }

    case 'COMPLETE_SUB_TASK': {
      const updatedBrands = state.brands.map(b => {
        if (b.id !== action.brandId) return b;
        return {
          ...b,
          stageGates: b.stageGates.map(g => {
            if (g.key !== action.stageKey) return g;
            return {
              ...g,
              subTasks: g.subTasks.map(t =>
                t.id === action.subTaskId ? { ...t, completed: true } : t
              ),
            };
          }),
        };
      });
      return { ...state, brands: updatedBrands };
    }

    case 'UPDATE_STAGE_COST': {
      const updatedBrands = state.brands.map(b => {
        if (b.id !== action.brandId) return b;
        return {
          ...b,
          stageGates: b.stageGates.map(g => {
            if (g.key !== action.stageKey) return g;
            return {
              ...g,
              ...(action.budget != null && { budget: action.budget }),
              ...(action.actualCost != null && { actualCost: action.actualCost }),
            };
          }),
        };
      });
      return { ...state, brands: updatedBrands };
    }

    default:
      return state;
  }
}

interface ContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  getFilteredBrands: () => Brand[];
  getOverallReadiness: () => number;
  getPendingApprovalBrands: () => { brand: Brand; stageKey: StageGateKey }[];
}

const BrandLaunchContext = createContext<ContextType | null>(null);

export function BrandLaunchProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const getFilteredBrands = () => {
    if (state.selectedBrandId === 'all') return state.brands;
    return state.brands.filter(b => b.id === state.selectedBrandId);
  };

  const getOverallReadiness = () => {
    const brands = getFilteredBrands();
    if (brands.length === 0) return 0;
    return Math.round(brands.reduce((sum, b) => sum + calculateLaunchReadiness(b.readiness), 0) / brands.length);
  };

  const getPendingApprovalBrands = () => {
    const result: { brand: Brand; stageKey: StageGateKey }[] = [];
    for (const brand of state.brands) {
      for (const gate of brand.stageGates) {
        if (gate.status === 'pending-approval') {
          result.push({ brand, stageKey: gate.key });
        }
      }
    }
    return result;
  };

  return (
    <BrandLaunchContext.Provider value={{ state, dispatch, getFilteredBrands, getOverallReadiness, getPendingApprovalBrands }}>
      {children}
    </BrandLaunchContext.Provider>
  );
}

export function useBrandLaunch() {
  const ctx = useContext(BrandLaunchContext);
  if (!ctx) throw new Error('useBrandLaunch must be used within BrandLaunchProvider');
  return ctx;
}
