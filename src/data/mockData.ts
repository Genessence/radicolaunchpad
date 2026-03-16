export type LifecycleStage =
  | 'ideation'
  | 'blend-development'
  | 'sensory-approval'
  | 'packaging'
  | 'label-registration'
  | 'brand-registration'
  | 'price-approval'
  | 'production'
  | 'distributor-allocation'
  | 'market-launch';

/** 7-stage high-level model (Radico Khaitan / Global Alcohol Brand Launch Lifecycle) */
export type StageGateKey =
  | 'brand-approval'
  | 'rd-blend'
  | 'packaging'
  | 'regulatory'
  | 'manufacturing'
  | 'marketing'
  | 'launch';

export type StageGateStatus = 'not-started' | 'in-progress' | 'pending-approval' | 'completed';

export interface StageSubTask {
  id: string;
  label: string;
  completed: boolean;
}

export interface StageGate {
  key: StageGateKey;
  label: string;
  status: StageGateStatus;
  owner: string;
  plannedStart: string;
  plannedEnd: string;
  actualStart?: string;
  actualEnd?: string;
  budget?: number;
  actualCost?: number;
  subTasks: StageSubTask[];
  adminApprovedAt?: string;
  adminApprovedBy?: string;
  rejectionComment?: string;
}

export const STAGE_GROUPS: Record<StageGateKey, LifecycleStage[]> = {
  'brand-approval': ['ideation'],
  'rd-blend': ['blend-development', 'sensory-approval'],
  packaging: ['packaging'],
  regulatory: ['label-registration', 'brand-registration', 'price-approval'],
  manufacturing: ['production'],
  marketing: [],
  launch: ['distributor-allocation', 'market-launch'],
};

export const STAGE_GATE_CONFIG: Record<StageGateKey, { requiresApproval: boolean }> = {
  'brand-approval': { requiresApproval: true },
  'rd-blend': { requiresApproval: true },
  packaging: { requiresApproval: true },
  regulatory: { requiresApproval: true },
  manufacturing: { requiresApproval: true },
  marketing: { requiresApproval: true },
  launch: { requiresApproval: true },
};

export const STAGE_SUB_TASKS: Record<StageGateKey, { id: string; label: string }[]> = {
  'brand-approval': [
    { id: 'ba1', label: 'Market research & concept definition' },
    { id: 'ba2', label: 'Business planning' },
    { id: 'ba3', label: 'Team & partners assembled' },
  ],
  'rd-blend': [
    { id: 'rd1', label: 'Formulation & testing' },
    { id: 'rd2', label: 'Stability/shelf-life testing' },
    { id: 'rd3', label: 'Scale-up trials' },
  ],
  packaging: [
    { id: 'pk1', label: 'Brand identity & trademark' },
    { id: 'pk2', label: 'Bottle/label design' },
    { id: 'pk3', label: 'Prototyping' },
  ],
  regulatory: [
    { id: 'rg1', label: 'Permits & licenses' },
    { id: 'rg2', label: 'Label & formula approval' },
    { id: 'rg3', label: 'Trademark registration' },
    { id: 'rg4', label: 'Compliance checks' },
  ],
  manufacturing: [
    { id: 'mf1', label: 'Production scheduling' },
    { id: 'mf2', label: 'Quality assurance' },
    { id: 'mf3', label: 'Inventory & warehousing' },
  ],
  marketing: [
    { id: 'mk1', label: 'Digital presence' },
    { id: 'mk2', label: 'Promotions & sampling' },
    { id: 'mk3', label: 'Advertising & PR' },
    { id: 'mk4', label: 'Marketing compliance' },
  ],
  launch: [
    { id: 'ln1', label: 'Distribution agreements' },
    { id: 'ln2', label: 'Logistics' },
    { id: 'ln3', label: 'Launch timing' },
    { id: 'ln4', label: 'Sales support' },
  ],
};

/** Default durations in days (for suggesting planned dates) */
export const STAGE_DEFAULT_DURATIONS: Record<StageGateKey, { minDays: number; maxDays: number; hint: string }> = {
  'brand-approval': { minDays: 30, maxDays: 90, hint: '1–3 months' },
  'rd-blend': { minDays: 180, maxDays: 365, hint: '6–12 months' },
  packaging: { minDays: 30, maxDays: 90, hint: '4–12 weeks design + months procurement' },
  regulatory: { minDays: 90, maxDays: 180, hint: '3–6 months permits' },
  manufacturing: { minDays: 60, maxDays: 180, hint: 'Several months' },
  marketing: { minDays: 90, maxDays: 180, hint: '3–6 months pre-launch' },
  launch: { minDays: 30, maxDays: 60, hint: '1–2 months' },
};

export const STAGE_GATE_LABELS: Record<StageGateKey, string> = {
  'brand-approval': 'Brand Approval',
  'rd-blend': 'R&D / Blend Development',
  packaging: 'Packaging',
  regulatory: 'Regulatory',
  manufacturing: 'Manufacturing',
  marketing: 'Marketing',
  launch: 'Launch',
};

export function createDefaultStageGates(overrides?: Partial<Record<StageGateKey, Partial<StageGate>>>): StageGate[] {
  const keys: StageGateKey[] = ['brand-approval', 'rd-blend', 'packaging', 'regulatory', 'manufacturing', 'marketing', 'launch'];
  return keys.map((key, i) => {
    const defaultTask: StageGate = {
      key,
      label: STAGE_GATE_LABELS[key],
      status: 'not-started',
      owner: '',
      plannedStart: '',
      plannedEnd: '',
      subTasks: STAGE_SUB_TASKS[key].map((t) => ({ ...t, completed: false })),
    };
    return { ...defaultTask, ...overrides?.[key] };
  });
}

export function getStageDelay(plannedEnd: string, actualEnd?: string): number | null {
  if (!actualEnd || !plannedEnd) return null;
  const planned = new Date(plannedEnd).getTime();
  const actual = new Date(actualEnd).getTime();
  const diffDays = Math.ceil((actual - planned) / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
}

export const LIFECYCLE_STAGES: { key: LifecycleStage; label: string }[] = [
  { key: 'ideation', label: 'Ideation' },
  { key: 'blend-development', label: 'Blend Development' },
  { key: 'sensory-approval', label: 'Sensory Approval' },
  { key: 'packaging', label: 'Packaging' },
  { key: 'label-registration', label: 'Label Registration' },
  { key: 'brand-registration', label: 'Brand Registration' },
  { key: 'price-approval', label: 'Price Approval' },
  { key: 'production', label: 'Production' },
  { key: 'distributor-allocation', label: 'Distributor Allocation' },
  { key: 'market-launch', label: 'Market Launch' },
];

export type ApprovalStatus = 'approved' | 'pending' | 'delayed' | 'not-started';
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface Brand {
  id: string;
  name: string;
  category: string;
  targetLaunchDate: string;
  targetStates: string[];
  owner: string;
  currentStage: LifecycleStage;
  readiness: {
    compliance: number;
    production: number;
    distributor: number;
    marketing: number;
  };
  projectedRevenue: number;
  riskLevel: RiskLevel;
  lifecycleStages: {
    stage: LifecycleStage;
    status: 'completed' | 'in-progress' | 'upcoming';
    owner: string;
    deadline: string;
  }[];
  /** 7-stage gate model for Radico Khaitan workflow */
  stageGates: StageGate[];
}

export interface BlendTrial {
  id: string;
  brandId: string;
  trialId: string;
  abv: number;
  grainRatio: number;
  maltRatio: number;
  ageStatement: string;
  status: 'approved' | 'rejected' | 'in-progress' | 'pending-review';
  sensoryScore: number;
  flavorProfile: { name: string; value: number }[];
}

export interface StateCompliance {
  id: string;
  brandId: string;
  state: string;
  labelRegistration: ApprovalStatus;
  brandRegistration: ApprovalStatus;
  priceApproval: ApprovalStatus;
  exciseDutyCategory: string;
  renewalDate: string;
  avgApprovalDays: number;
}

export interface ProductionBatch {
  id: string;
  brandId: string;
  batchId: string;
  plant: string;
  product: string;
  batchSize: number;
  startDate: string;
  endDate: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'delayed';
}

export interface Distributor {
  id: string;
  brandId: string;
  state: string;
  name: string;
  licenseStatus: ApprovalStatus;
  inventoryReadiness: number;
  coverageArea: string;
  readinessScore: number;
}

export interface MarketingAsset {
  id: string;
  brandId: string;
  asset: string;
  status: 'ready' | 'pending' | 'in-progress' | 'completed';
  owner: string;
  dueDate: string;
}

export interface BottleDesign {
  id: string;
  brandId: string;
  name: string;
  volume: string;
  material: string;
  closure: string;
  status: ApprovalStatus | 'in-progress';
}

export interface LabelVersion {
  id: string;
  brandId: string;
  version: string;
  status: ApprovalStatus | 'rejected';
  submittedBy: string;
  date: string;
}

export interface PackagingSKU {
  id: string;
  brandId: string;
  sku: string;
  description: string;
  packSize: string;
  status: 'active' | 'pending';
}

export interface RiskAlert {
  id: string;
  brandId: string;
  type: string;
  severity: RiskLevel;
  projectedRevenueImpact: number;
  estimatedDelay: number;
  recommendedAction: string;
  status: 'active' | 'mitigated' | 'resolved';
}

export interface ActivityItem {
  id: string;
  brandId: string;
  action: string;
  user: string;
  timestamp: string;
  type: 'approval' | 'submission' | 'schedule' | 'alert' | 'update';
}

export interface NextAction {
  id: string;
  brandId: string;
  action: string;
  owner: string;
  impact: string;
  revenueImpact: number;
  priority: 'high' | 'medium' | 'low';
}

export interface StateOpportunity {
  state: string;
  stateCode: string;
  projectedRevenue: number;
  distributorCoverage: number;
  approvalStatus: ApprovalStatus;
  labelApproval: ApprovalStatus;
  priceApproval: ApprovalStatus;
}

// Demo Brands
export const demoBrands: Brand[] = [
  {
    id: 'b1',
    name: 'Royal Ranthambore Reserve',
    category: 'Premium Whisky',
    targetLaunchDate: 'Oct 2026',
    targetStates: ['UP', 'MH', 'KA', 'Delhi'],
    owner: 'Arun Sharma',
    currentStage: 'price-approval',
    readiness: { compliance: 80, production: 60, distributor: 65, marketing: 70 },
    projectedRevenue: 82,
    riskLevel: 'medium',
    lifecycleStages: [
      { stage: 'ideation', status: 'completed', owner: 'Brand Team', deadline: 'Jan 2025' },
      { stage: 'blend-development', status: 'completed', owner: 'R&D Lab', deadline: 'Apr 2025' },
      { stage: 'sensory-approval', status: 'completed', owner: 'Master Blender', deadline: 'Jun 2025' },
      { stage: 'packaging', status: 'completed', owner: 'Design Studio', deadline: 'Aug 2025' },
      { stage: 'label-registration', status: 'completed', owner: 'Compliance', deadline: 'Oct 2025' },
      { stage: 'brand-registration', status: 'completed', owner: 'Compliance', deadline: 'Dec 2025' },
      { stage: 'price-approval', status: 'in-progress', owner: 'Regulatory', deadline: 'Mar 2026' },
      { stage: 'production', status: 'upcoming', owner: 'Rampur Distillery', deadline: 'Jun 2026' },
      { stage: 'distributor-allocation', status: 'upcoming', owner: 'Distribution', deadline: 'Aug 2026' },
      { stage: 'market-launch', status: 'upcoming', owner: 'Marketing', deadline: 'Oct 2026' },
    ],
    stageGates: createDefaultStageGates({
      'brand-approval': { status: 'completed', owner: 'Brand Team', plannedStart: 'Oct 2024', plannedEnd: 'Jan 2025', actualStart: 'Oct 2024', actualEnd: 'Jan 2025', subTasks: STAGE_SUB_TASKS['brand-approval'].map((t) => ({ ...t, completed: true })) },
      'rd-blend': { status: 'completed', owner: 'R&D Lab', plannedStart: 'Jan 2025', plannedEnd: 'Jun 2025', actualStart: 'Jan 2025', actualEnd: 'Jun 2025', subTasks: STAGE_SUB_TASKS['rd-blend'].map((t) => ({ ...t, completed: true })) },
      packaging: { status: 'completed', owner: 'Design Studio', plannedStart: 'Jun 2025', plannedEnd: 'Aug 2025', actualStart: 'Jun 2025', actualEnd: 'Aug 2025', subTasks: STAGE_SUB_TASKS.packaging.map((t) => ({ ...t, completed: true })) },
      regulatory: { status: 'pending-approval', owner: 'Compliance', plannedStart: 'Aug 2025', plannedEnd: 'Mar 2026', actualStart: 'Aug 2025', subTasks: STAGE_SUB_TASKS.regulatory.map((t) => ({ ...t, completed: true })) },
      manufacturing: { status: 'not-started', owner: 'Rampur Distillery', plannedStart: 'Apr 2026', plannedEnd: 'Jun 2026', subTasks: STAGE_SUB_TASKS.manufacturing.map((t) => ({ ...t, completed: false })) },
      marketing: { status: 'in-progress', owner: 'Marketing Team', plannedStart: 'Mar 2026', plannedEnd: 'Sep 2026', subTasks: STAGE_SUB_TASKS.marketing.map((t, i) => ({ ...t, completed: i < 2 })) },
      launch: { status: 'not-started', owner: 'Distribution', plannedStart: 'Aug 2026', plannedEnd: 'Oct 2026', subTasks: STAGE_SUB_TASKS.launch.map((t) => ({ ...t, completed: false })) },
    }),
  },
  {
    id: 'b2',
    name: 'Rampur Barrel Select',
    category: 'Single Malt Whisky',
    targetLaunchDate: 'Dec 2026',
    targetStates: ['Delhi', 'MH', 'KA', 'Goa'],
    owner: 'Priya Mehta',
    currentStage: 'sensory-approval',
    readiness: { compliance: 30, production: 10, distributor: 15, marketing: 25 },
    projectedRevenue: 45,
    riskLevel: 'low',
    lifecycleStages: [
      { stage: 'ideation', status: 'completed', owner: 'Brand Team', deadline: 'Mar 2025' },
      { stage: 'blend-development', status: 'completed', owner: 'R&D Lab', deadline: 'Jul 2025' },
      { stage: 'sensory-approval', status: 'in-progress', owner: 'Master Blender', deadline: 'Sep 2025' },
      { stage: 'packaging', status: 'upcoming', owner: 'Design Studio', deadline: 'Dec 2025' },
      { stage: 'label-registration', status: 'upcoming', owner: 'Compliance', deadline: 'Feb 2026' },
      { stage: 'brand-registration', status: 'upcoming', owner: 'Compliance', deadline: 'Apr 2026' },
      { stage: 'price-approval', status: 'upcoming', owner: 'Regulatory', deadline: 'Jun 2026' },
      { stage: 'production', status: 'upcoming', owner: 'Rampur Distillery', deadline: 'Aug 2026' },
      { stage: 'distributor-allocation', status: 'upcoming', owner: 'Distribution', deadline: 'Oct 2026' },
      { stage: 'market-launch', status: 'upcoming', owner: 'Marketing', deadline: 'Dec 2026' },
    ],
    stageGates: createDefaultStageGates({
      'brand-approval': { status: 'completed', owner: 'Brand Team', plannedStart: 'Dec 2024', plannedEnd: 'Mar 2025', actualStart: 'Dec 2024', actualEnd: 'Mar 2025', subTasks: STAGE_SUB_TASKS['brand-approval'].map((t) => ({ ...t, completed: true })) },
      'rd-blend': { status: 'in-progress', owner: 'Master Blender', plannedStart: 'Mar 2025', plannedEnd: 'Sep 2025', actualStart: 'Mar 2025', subTasks: STAGE_SUB_TASKS['rd-blend'].map((t, i) => ({ ...t, completed: i < 2 })) },
      packaging: { status: 'not-started', owner: 'Design Studio', plannedStart: 'Sep 2025', plannedEnd: 'Dec 2025', subTasks: STAGE_SUB_TASKS.packaging.map((t) => ({ ...t, completed: false })) },
      regulatory: { status: 'not-started', owner: 'Compliance', plannedStart: 'Dec 2025', plannedEnd: 'Jun 2026', subTasks: STAGE_SUB_TASKS.regulatory.map((t) => ({ ...t, completed: false })) },
      manufacturing: { status: 'not-started', owner: 'Rampur Distillery', plannedStart: 'Jun 2026', plannedEnd: 'Aug 2026', subTasks: STAGE_SUB_TASKS.manufacturing.map((t) => ({ ...t, completed: false })) },
      marketing: { status: 'not-started', owner: 'Marketing', plannedStart: 'Aug 2026', plannedEnd: 'Nov 2026', subTasks: STAGE_SUB_TASKS.marketing.map((t) => ({ ...t, completed: false })) },
      launch: { status: 'not-started', owner: 'Distribution', plannedStart: 'Oct 2026', plannedEnd: 'Dec 2026', subTasks: STAGE_SUB_TASKS.launch.map((t) => ({ ...t, completed: false })) },
    }),
  },
  {
    id: 'b3',
    name: 'Magic Moments Luxe',
    category: 'Premium Vodka',
    targetLaunchDate: 'Aug 2026',
    targetStates: ['UP', 'MH', 'Delhi', 'Rajasthan', 'WB'],
    owner: 'Vikram Singh',
    currentStage: 'production',
    readiness: { compliance: 95, production: 70, distributor: 50, marketing: 60 },
    projectedRevenue: 110,
    riskLevel: 'medium',
    lifecycleStages: [
      { stage: 'ideation', status: 'completed', owner: 'Brand Team', deadline: 'Jun 2024' },
      { stage: 'blend-development', status: 'completed', owner: 'R&D Lab', deadline: 'Sep 2024' },
      { stage: 'sensory-approval', status: 'completed', owner: 'Master Blender', deadline: 'Nov 2024' },
      { stage: 'packaging', status: 'completed', owner: 'Design Studio', deadline: 'Jan 2025' },
      { stage: 'label-registration', status: 'completed', owner: 'Compliance', deadline: 'Mar 2025' },
      { stage: 'brand-registration', status: 'completed', owner: 'Compliance', deadline: 'May 2025' },
      { stage: 'price-approval', status: 'completed', owner: 'Regulatory', deadline: 'Jul 2025' },
      { stage: 'production', status: 'in-progress', owner: 'Sitapur Plant', deadline: 'Apr 2026' },
      { stage: 'distributor-allocation', status: 'upcoming', owner: 'Distribution', deadline: 'Jun 2026' },
      { stage: 'market-launch', status: 'upcoming', owner: 'Marketing', deadline: 'Aug 2026' },
    ],
    stageGates: createDefaultStageGates({
      'brand-approval': { status: 'completed', owner: 'Brand Team', plannedStart: 'Mar 2024', plannedEnd: 'Jun 2024', actualStart: 'Mar 2024', actualEnd: 'Jun 2024', subTasks: STAGE_SUB_TASKS['brand-approval'].map((t) => ({ ...t, completed: true })) },
      'rd-blend': { status: 'completed', owner: 'R&D Lab', plannedStart: 'Jun 2024', plannedEnd: 'Nov 2024', actualStart: 'Jun 2024', actualEnd: 'Nov 2024', subTasks: STAGE_SUB_TASKS['rd-blend'].map((t) => ({ ...t, completed: true })) },
      packaging: { status: 'completed', owner: 'Design Studio', plannedStart: 'Nov 2024', plannedEnd: 'Jan 2025', actualStart: 'Nov 2024', actualEnd: 'Jan 2025', subTasks: STAGE_SUB_TASKS.packaging.map((t) => ({ ...t, completed: true })) },
      regulatory: { status: 'completed', owner: 'Compliance', plannedStart: 'Jan 2025', plannedEnd: 'Jul 2025', actualStart: 'Jan 2025', actualEnd: 'Jul 2025', subTasks: STAGE_SUB_TASKS.regulatory.map((t) => ({ ...t, completed: true })) },
      manufacturing: { status: 'in-progress', owner: 'Sitapur Plant', plannedStart: 'Jan 2026', plannedEnd: 'Apr 2026', actualStart: 'Jan 2026', subTasks: STAGE_SUB_TASKS.manufacturing.map((t, i) => ({ ...t, completed: i < 2 })) },
      marketing: { status: 'in-progress', owner: 'Marketing Team', plannedStart: 'Feb 2026', plannedEnd: 'Jul 2026', subTasks: STAGE_SUB_TASKS.marketing.map((t, i) => ({ ...t, completed: i < 2 })) },
      launch: { status: 'not-started', owner: 'Distribution', plannedStart: 'Jun 2026', plannedEnd: 'Aug 2026', subTasks: STAGE_SUB_TASKS.launch.map((t) => ({ ...t, completed: false })) },
    }),
  },
  {
    id: 'b4',
    name: 'Morpheus Black',
    category: 'Brandy',
    targetLaunchDate: 'Mar 2027',
    targetStates: ['KA', 'TN', 'KL', 'AP'],
    owner: 'Deepa Nair',
    currentStage: 'packaging',
    readiness: { compliance: 20, production: 5, distributor: 10, marketing: 15 },
    projectedRevenue: 35,
    riskLevel: 'low',
    lifecycleStages: [
      { stage: 'ideation', status: 'completed', owner: 'Brand Team', deadline: 'Sep 2025' },
      { stage: 'blend-development', status: 'completed', owner: 'R&D Lab', deadline: 'Dec 2025' },
      { stage: 'sensory-approval', status: 'completed', owner: 'Master Blender', deadline: 'Feb 2026' },
      { stage: 'packaging', status: 'in-progress', owner: 'Design Studio', deadline: 'May 2026' },
      { stage: 'label-registration', status: 'upcoming', owner: 'Compliance', deadline: 'Jul 2026' },
      { stage: 'brand-registration', status: 'upcoming', owner: 'Compliance', deadline: 'Sep 2026' },
      { stage: 'price-approval', status: 'upcoming', owner: 'Regulatory', deadline: 'Nov 2026' },
      { stage: 'production', status: 'upcoming', owner: 'Rampur Distillery', deadline: 'Jan 2027' },
      { stage: 'distributor-allocation', status: 'upcoming', owner: 'Distribution', deadline: 'Feb 2027' },
      { stage: 'market-launch', status: 'upcoming', owner: 'Marketing', deadline: 'Mar 2027' },
    ],
    stageGates: createDefaultStageGates({
      'brand-approval': { status: 'completed', owner: 'Brand Team', plannedStart: 'Jun 2025', plannedEnd: 'Sep 2025', actualStart: 'Jun 2025', actualEnd: 'Sep 2025', subTasks: STAGE_SUB_TASKS['brand-approval'].map((t) => ({ ...t, completed: true })) },
      'rd-blend': { status: 'completed', owner: 'R&D Lab', plannedStart: 'Sep 2025', plannedEnd: 'Feb 2026', actualStart: 'Sep 2025', actualEnd: 'Feb 2026', subTasks: STAGE_SUB_TASKS['rd-blend'].map((t) => ({ ...t, completed: true })) },
      packaging: { status: 'in-progress', owner: 'Design Studio', plannedStart: 'Feb 2026', plannedEnd: 'May 2026', actualStart: 'Feb 2026', subTasks: STAGE_SUB_TASKS.packaging.map((t, i) => ({ ...t, completed: i < 2 })) },
      regulatory: { status: 'not-started', owner: 'Compliance', plannedStart: 'May 2026', plannedEnd: 'Nov 2026', subTasks: STAGE_SUB_TASKS.regulatory.map((t) => ({ ...t, completed: false })) },
      manufacturing: { status: 'not-started', owner: 'Rampur Distillery', plannedStart: 'Nov 2026', plannedEnd: 'Jan 2027', subTasks: STAGE_SUB_TASKS.manufacturing.map((t) => ({ ...t, completed: false })) },
      marketing: { status: 'not-started', owner: 'Marketing', plannedStart: 'Dec 2026', plannedEnd: 'Feb 2027', subTasks: STAGE_SUB_TASKS.marketing.map((t) => ({ ...t, completed: false })) },
      launch: { status: 'not-started', owner: 'Distribution', plannedStart: 'Feb 2027', plannedEnd: 'Mar 2027', subTasks: STAGE_SUB_TASKS.launch.map((t) => ({ ...t, completed: false })) },
    }),
  },
];

export const demoBlendTrials: BlendTrial[] = [
  {
    id: 'bt1', brandId: 'b1', trialId: 'T1043', abv: 42.8, grainRatio: 75, maltRatio: 25,
    ageStatement: '4 Years', status: 'approved', sensoryScore: 88,
    flavorProfile: [{ name: 'Smoky', value: 72 }, { name: 'Fruity', value: 65 }, { name: 'Spicy', value: 80 }, { name: 'Sweet', value: 58 }, { name: 'Woody', value: 85 }],
  },
  {
    id: 'bt2', brandId: 'b1', trialId: 'T1042', abv: 43.2, grainRatio: 70, maltRatio: 30,
    ageStatement: '4 Years', status: 'rejected', sensoryScore: 72,
    flavorProfile: [{ name: 'Smoky', value: 60 }, { name: 'Fruity', value: 70 }, { name: 'Spicy', value: 55 }, { name: 'Sweet', value: 68 }, { name: 'Woody', value: 75 }],
  },
  {
    id: 'bt3', brandId: 'b1', trialId: 'T1041', abv: 42.0, grainRatio: 80, maltRatio: 20,
    ageStatement: '3 Years', status: 'rejected', sensoryScore: 65,
    flavorProfile: [{ name: 'Smoky', value: 50 }, { name: 'Fruity', value: 55 }, { name: 'Spicy', value: 45 }, { name: 'Sweet', value: 72 }, { name: 'Woody', value: 60 }],
  },
  {
    id: 'bt4', brandId: 'b2', trialId: 'T2010', abv: 46.0, grainRatio: 0, maltRatio: 100,
    ageStatement: '8 Years', status: 'in-progress', sensoryScore: 91,
    flavorProfile: [{ name: 'Smoky', value: 45 }, { name: 'Fruity', value: 88 }, { name: 'Spicy', value: 60 }, { name: 'Sweet', value: 82 }, { name: 'Woody', value: 90 }],
  },
  {
    id: 'bt5', brandId: 'b3', trialId: 'T3005', abv: 37.5, grainRatio: 100, maltRatio: 0,
    ageStatement: 'N/A', status: 'approved', sensoryScore: 85,
    flavorProfile: [{ name: 'Clean', value: 92 }, { name: 'Citrus', value: 78 }, { name: 'Smooth', value: 88 }, { name: 'Crisp', value: 85 }, { name: 'Neutral', value: 95 }],
  },
];

export const demoStateCompliance: StateCompliance[] = [
  { id: 'sc1', brandId: 'b1', state: 'UP', labelRegistration: 'approved', brandRegistration: 'approved', priceApproval: 'pending', exciseDutyCategory: 'Premium Whisky', renewalDate: 'Dec 2027', avgApprovalDays: 21 },
  { id: 'sc2', brandId: 'b1', state: 'MH', labelRegistration: 'pending', brandRegistration: 'approved', priceApproval: 'not-started', exciseDutyCategory: 'Premium Whisky', renewalDate: 'Dec 2027', avgApprovalDays: 45 },
  { id: 'sc3', brandId: 'b1', state: 'KA', labelRegistration: 'approved', brandRegistration: 'pending', priceApproval: 'not-started', exciseDutyCategory: 'Premium Whisky', renewalDate: 'Dec 2027', avgApprovalDays: 32 },
  { id: 'sc4', brandId: 'b1', state: 'Delhi', labelRegistration: 'approved', brandRegistration: 'approved', priceApproval: 'approved', exciseDutyCategory: 'Premium Whisky', renewalDate: 'Dec 2027', avgApprovalDays: 18 },
  { id: 'sc5', brandId: 'b3', state: 'UP', labelRegistration: 'approved', brandRegistration: 'approved', priceApproval: 'approved', exciseDutyCategory: 'Premium Vodka', renewalDate: 'Jun 2027', avgApprovalDays: 25 },
  { id: 'sc6', brandId: 'b3', state: 'MH', labelRegistration: 'approved', brandRegistration: 'approved', priceApproval: 'approved', exciseDutyCategory: 'Premium Vodka', renewalDate: 'Jun 2027', avgApprovalDays: 40 },
  { id: 'sc7', brandId: 'b3', state: 'Delhi', labelRegistration: 'approved', brandRegistration: 'approved', priceApproval: 'pending', exciseDutyCategory: 'Premium Vodka', renewalDate: 'Jun 2027', avgApprovalDays: 15 },
];

export const demoProductionBatches: ProductionBatch[] = [
  { id: 'pb1', brandId: 'b1', batchId: 'B-402', plant: 'Rampur Distillery', product: 'Royal Ranthambore Reserve', batchSize: 25000, startDate: 'Jun 2026', endDate: 'Jul 2026', status: 'scheduled' },
  { id: 'pb2', brandId: 'b1', batchId: 'B-403', plant: 'Sitapur Plant', product: 'Royal Ranthambore Reserve', batchSize: 15000, startDate: 'Jul 2026', endDate: 'Aug 2026', status: 'scheduled' },
  { id: 'pb3', brandId: 'b3', batchId: 'B-310', plant: 'Sitapur Plant', product: 'Magic Moments Luxe', batchSize: 50000, startDate: 'Mar 2026', endDate: 'May 2026', status: 'in-progress' },
  { id: 'pb4', brandId: 'b3', batchId: 'B-311', plant: 'Rampur Distillery', product: 'Magic Moments Luxe', batchSize: 30000, startDate: 'Apr 2026', endDate: 'Jun 2026', status: 'scheduled' },
];

export const demoDistributors: Distributor[] = [
  { id: 'd1', brandId: 'b1', state: 'UP', name: 'Agra Spirits Pvt Ltd', licenseStatus: 'approved', inventoryReadiness: 75, coverageArea: 'Western UP', readinessScore: 78 },
  { id: 'd2', brandId: 'b1', state: 'UP', name: 'Lucknow Beverages', licenseStatus: 'approved', inventoryReadiness: 60, coverageArea: 'Central UP', readinessScore: 65 },
  { id: 'd3', brandId: 'b1', state: 'MH', name: 'Mumbai Spirits Co', licenseStatus: 'pending', inventoryReadiness: 40, coverageArea: 'Mumbai Metro', readinessScore: 45 },
  { id: 'd4', brandId: 'b1', state: 'KA', name: 'Bangalore Beverages', licenseStatus: 'pending', inventoryReadiness: 30, coverageArea: 'Bangalore Urban', readinessScore: 35 },
  { id: 'd5', brandId: 'b1', state: 'Delhi', name: 'Delhi Premium Dist.', licenseStatus: 'approved', inventoryReadiness: 80, coverageArea: 'NCR Region', readinessScore: 82 },
  { id: 'd6', brandId: 'b3', state: 'UP', name: 'Agra Spirits Pvt Ltd', licenseStatus: 'approved', inventoryReadiness: 90, coverageArea: 'Western UP', readinessScore: 88 },
  { id: 'd7', brandId: 'b3', state: 'MH', name: 'Pune Distributors', licenseStatus: 'approved', inventoryReadiness: 70, coverageArea: 'Pune Region', readinessScore: 72 },
];

export const demoMarketingAssets: MarketingAsset[] = [
  { id: 'ma1', brandId: 'b1', asset: 'POS Display Units', status: 'ready', owner: 'Marketing Team', dueDate: 'Jul 2026' },
  { id: 'ma2', brandId: 'b1', asset: 'Distributor Deck', status: 'pending', owner: 'Brand Manager', dueDate: 'Jun 2026' },
  { id: 'ma3', brandId: 'b1', asset: 'Bottle Photography', status: 'completed', owner: 'Creative Agency', dueDate: 'May 2026' },
  { id: 'ma4', brandId: 'b1', asset: 'Launch Campaign', status: 'in-progress', owner: 'Digital Team', dueDate: 'Sep 2026' },
  { id: 'ma5', brandId: 'b1', asset: 'Trade Presentation', status: 'pending', owner: 'Sales Team', dueDate: 'Aug 2026' },
  { id: 'ma6', brandId: 'b3', asset: 'POS Display Units', status: 'completed', owner: 'Marketing Team', dueDate: 'Apr 2026' },
  { id: 'ma7', brandId: 'b3', asset: 'Social Media Kit', status: 'in-progress', owner: 'Digital Team', dueDate: 'May 2026' },
  { id: 'ma8', brandId: 'b3', asset: 'Influencer Pack', status: 'pending', owner: 'PR Agency', dueDate: 'Jun 2026' },
];

export const demoBottleDesigns: BottleDesign[] = [
  { id: 'bd1', brandId: 'b1', name: 'Royal Ranthambore Reserve 750ml', volume: '750ml', material: 'Premium Glass', closure: 'Cork Top', status: 'approved' },
  { id: 'bd2', brandId: 'b1', name: 'Royal Ranthambore Reserve 375ml', volume: '375ml', material: 'Premium Glass', closure: 'Screw Cap', status: 'in-progress' },
  { id: 'bd3', brandId: 'b2', name: 'Rampur Barrel Select 700ml', volume: '700ml', material: 'Premium Glass', closure: 'Cork Top', status: 'pending' },
  { id: 'bd4', brandId: 'b3', name: 'Magic Moments Luxe 750ml', volume: '750ml', material: 'Premium Glass', closure: 'Screw Cap', status: 'approved' },
  { id: 'bd5', brandId: 'b4', name: 'Morpheus Black 750ml', volume: '750ml', material: 'Premium Glass', closure: 'Cork Top', status: 'in-progress' },
];

export const demoLabelVersions: LabelVersion[] = [
  { id: 'lv1', brandId: 'b1', version: 'v3.2', status: 'approved', submittedBy: 'Design Studio', date: 'Feb 2026' },
  { id: 'lv2', brandId: 'b1', version: 'v3.1', status: 'rejected', submittedBy: 'Design Studio', date: 'Jan 2026' },
  { id: 'lv3', brandId: 'b1', version: 'v3.0', status: 'rejected', submittedBy: 'Creative Agency', date: 'Dec 2025' },
  { id: 'lv4', brandId: 'b3', version: 'v2.0', status: 'approved', submittedBy: 'Design Studio', date: 'Mar 2026' },
  { id: 'lv5', brandId: 'b4', version: 'v1.2', status: 'pending', submittedBy: 'Design Studio', date: 'Apr 2026' },
];

export const demoPackagingSKUs: PackagingSKU[] = [
  { id: 'ps1', brandId: 'b1', sku: 'RRR-750-STD', description: 'Standard 750ml', packSize: '12 units', status: 'active' },
  { id: 'ps2', brandId: 'b1', sku: 'RRR-375-STD', description: 'Standard 375ml', packSize: '24 units', status: 'pending' },
  { id: 'ps3', brandId: 'b1', sku: 'RRR-750-GFT', description: 'Gift Box 750ml', packSize: '6 units', status: 'pending' },
  { id: 'ps4', brandId: 'b2', sku: 'RBS-700-STD', description: 'Standard 700ml', packSize: '12 units', status: 'pending' },
  { id: 'ps5', brandId: 'b3', sku: 'MML-750-STD', description: 'Standard 750ml', packSize: '12 units', status: 'active' },
  { id: 'ps6', brandId: 'b4', sku: 'MB-750-STD', description: 'Standard 750ml', packSize: '12 units', status: 'pending' },
];

export const demoRiskAlerts: RiskAlert[] = [
  { id: 'ra1', brandId: 'b1', type: 'Label Approval Delay', severity: 'high', projectedRevenueImpact: 28, estimatedDelay: 30, recommendedAction: 'Escalate MH label submission to Regional Commissioner', status: 'active' },
  { id: 'ra2', brandId: 'b1', type: 'Supply Chain Bottleneck', severity: 'medium', projectedRevenueImpact: 12, estimatedDelay: 15, recommendedAction: 'Activate secondary glass supplier from Firozabad', status: 'active' },
  { id: 'ra3', brandId: 'b3', type: 'Distributor License Expiry', severity: 'high', projectedRevenueImpact: 18, estimatedDelay: 45, recommendedAction: 'Initiate renewal for Delhi Premium Dist. license expiring Q2', status: 'active' },
  { id: 'ra4', brandId: 'b1', type: 'Price Approval Stall', severity: 'critical', projectedRevenueImpact: 35, estimatedDelay: 60, recommendedAction: 'Schedule meeting with UP Excise Commissioner', status: 'active' },
];

export const demoActivities: ActivityItem[] = [
  { id: 'a1', brandId: 'b1', action: 'Blend Trial T1043 approved by Master Blender', user: 'Rajesh Kumar', timestamp: '2 hours ago', type: 'approval' },
  { id: 'a2', brandId: 'b1', action: 'Delhi label registration submitted', user: 'Compliance Team', timestamp: '4 hours ago', type: 'submission' },
  { id: 'a3', brandId: 'b3', action: 'Production Batch B-310 started at Sitapur', user: 'Plant Manager', timestamp: '6 hours ago', type: 'schedule' },
  { id: 'a4', brandId: 'b1', action: 'MH distributor onboarding initiated', user: 'Distribution Head', timestamp: '1 day ago', type: 'update' },
  { id: 'a5', brandId: 'b2', action: 'Sensory panel review scheduled', user: 'R&D Head', timestamp: '1 day ago', type: 'schedule' },
  { id: 'a6', brandId: 'b3', action: 'UP price approval received', user: 'Regulatory', timestamp: '2 days ago', type: 'approval' },
  { id: 'a7', brandId: 'b4', action: 'Packaging design v3 uploaded', user: 'Design Studio', timestamp: '2 days ago', type: 'submission' },
  { id: 'a8', brandId: 'b1', action: 'Supply chain risk alert triggered', user: 'System', timestamp: '3 days ago', type: 'alert' },
];

export const demoNextActions: NextAction[] = [
  { id: 'na1', brandId: 'b1', action: 'Submit Maharashtra Label Registration', owner: 'Compliance Team', impact: 'Unlock ₹28 Cr MH market', revenueImpact: 28, priority: 'high' },
  { id: 'na2', brandId: 'b1', action: 'Schedule UP Price Approval Meeting', owner: 'Regulatory Head', impact: 'Clear ₹35 Cr UP revenue path', revenueImpact: 35, priority: 'high' },
  { id: 'na3', brandId: 'b3', action: 'Renew Delhi Distributor License', owner: 'Distribution Head', impact: 'Maintain ₹18 Cr Delhi channel', revenueImpact: 18, priority: 'medium' },
  { id: 'na4', brandId: 'b1', action: 'Finalize Distributor Deck', owner: 'Brand Manager', impact: 'Enable trade onboarding', revenueImpact: 0, priority: 'medium' },
];

export const demoStateOpportunities: StateOpportunity[] = [
  { state: 'Uttar Pradesh', stateCode: 'UP', projectedRevenue: 35, distributorCoverage: 72, approvalStatus: 'pending', labelApproval: 'approved', priceApproval: 'pending' },
  { state: 'Maharashtra', stateCode: 'MH', projectedRevenue: 28, distributorCoverage: 45, approvalStatus: 'pending', labelApproval: 'pending', priceApproval: 'not-started' },
  { state: 'Karnataka', stateCode: 'KA', projectedRevenue: 22, distributorCoverage: 35, approvalStatus: 'pending', labelApproval: 'approved', priceApproval: 'not-started' },
  { state: 'Delhi', stateCode: 'Delhi', projectedRevenue: 18, distributorCoverage: 82, approvalStatus: 'approved', labelApproval: 'approved', priceApproval: 'approved' },
  { state: 'West Bengal', stateCode: 'WB', projectedRevenue: 15, distributorCoverage: 20, approvalStatus: 'not-started', labelApproval: 'not-started', priceApproval: 'not-started' },
  { state: 'Rajasthan', stateCode: 'RJ', projectedRevenue: 12, distributorCoverage: 30, approvalStatus: 'pending', labelApproval: 'pending', priceApproval: 'not-started' },
  { state: 'Tamil Nadu', stateCode: 'TN', projectedRevenue: 20, distributorCoverage: 0, approvalStatus: 'not-started', labelApproval: 'not-started', priceApproval: 'not-started' },
  { state: 'Kerala', stateCode: 'KL', projectedRevenue: 10, distributorCoverage: 0, approvalStatus: 'not-started', labelApproval: 'not-started', priceApproval: 'not-started' },
  { state: 'Goa', stateCode: 'GA', projectedRevenue: 8, distributorCoverage: 0, approvalStatus: 'not-started', labelApproval: 'not-started', priceApproval: 'not-started' },
  { state: 'Andhra Pradesh', stateCode: 'AP', projectedRevenue: 14, distributorCoverage: 0, approvalStatus: 'not-started', labelApproval: 'not-started', priceApproval: 'not-started' },
];

// ─── Team Process Types ─────────────────────────────────────────────────────

export type TeamRole = 'rd' | 'marketing' | 'packing' | 'production';

export type TeamStageStatus = 'not-started' | 'in-progress' | 'completed';

export interface TeamSubTask {
  id: string;
  label: string;
  completed: boolean;
}

export interface TeamStage {
  id: string;
  name: string;
  description: string;
  order: number;
  status: TeamStageStatus;
  subTasks: TeamSubTask[];
  createdAt: string;
}

export interface TeamProcess {
  teamRole: TeamRole;
  teamLabel: string;
  stages: TeamStage[];
}

export const initialTeamProcesses: TeamProcess[] = [
  {
    teamRole: 'rd',
    teamLabel: 'R&D Team',
    stages: [
      { id: 'rd-s1', name: 'Ideation', description: 'Concept development and initial market research for new blend or variant.', order: 1, status: 'completed', subTasks: [], createdAt: '2025-01-10' },
      { id: 'rd-s2', name: 'Formulation', description: 'Define recipe, ingredient proportions, and process parameters.', order: 2, status: 'completed', subTasks: [], createdAt: '2025-01-10' },
      { id: 'rd-s3', name: 'Lab Trials', description: 'Conduct small-scale lab trials and document observations.', order: 3, status: 'in-progress', subTasks: [], createdAt: '2025-01-10' },
      { id: 'rd-s4', name: 'Sensory Evaluation', description: 'Panel tasting and sensory scoring against benchmarks.', order: 4, status: 'not-started', subTasks: [], createdAt: '2025-01-10' },
      { id: 'rd-s5', name: 'Scale-Up Trials', description: 'Pilot production to validate the formula at larger volumes.', order: 5, status: 'not-started', subTasks: [], createdAt: '2025-01-10' },
      { id: 'rd-s6', name: 'Sign-Off', description: 'Final R&D sign-off and formula handover to production.', order: 6, status: 'not-started', subTasks: [], createdAt: '2025-01-10' },
    ],
  },
  {
    teamRole: 'marketing',
    teamLabel: 'Marketing Team',
    stages: [
      { id: 'mkt-s1', name: 'Brief & Positioning', description: 'Define target audience, brand positioning, and campaign brief.', order: 1, status: 'completed', subTasks: [], createdAt: '2025-02-01' },
      { id: 'mkt-s2', name: 'Creative Development', description: 'Develop visuals, copy, and creative assets aligned to brand identity.', order: 2, status: 'in-progress', subTasks: [], createdAt: '2025-02-01' },
      { id: 'mkt-s3', name: 'Campaign Planning', description: 'Plan media mix, timelines, budget allocation, and channel strategy.', order: 3, status: 'not-started', subTasks: [], createdAt: '2025-02-01' },
      { id: 'mkt-s4', name: 'Approvals', description: 'Internal and regulatory review of all campaign materials.', order: 4, status: 'not-started', subTasks: [], createdAt: '2025-02-01' },
      { id: 'mkt-s5', name: 'Launch Execution', description: 'Execute campaign across channels and manage live assets.', order: 5, status: 'not-started', subTasks: [], createdAt: '2025-02-01' },
      { id: 'mkt-s6', name: 'Post-Launch Review', description: 'Analyze campaign performance, collect learnings, and report ROI.', order: 6, status: 'not-started', subTasks: [], createdAt: '2025-02-01' },
    ],
  },
  {
    teamRole: 'packing',
    teamLabel: 'Packing Team',
    stages: [
      { id: 'pk-s1', name: 'Design Specification', description: 'Define packaging dimensions, materials, and finish requirements.', order: 1, status: 'completed', subTasks: [], createdAt: '2025-01-20' },
      { id: 'pk-s2', name: 'Prototype', description: 'Create and review physical packaging prototypes with design team.', order: 2, status: 'in-progress', subTasks: [], createdAt: '2025-01-20' },
      { id: 'pk-s3', name: 'Compliance Check', description: 'Verify packaging against regulatory label and safety requirements.', order: 3, status: 'not-started', subTasks: [], createdAt: '2025-01-20' },
      { id: 'pk-s4', name: 'Production Sampling', description: 'Run a production sample batch and inspect quality.', order: 4, status: 'not-started', subTasks: [], createdAt: '2025-01-20' },
      { id: 'pk-s5', name: 'Final Approval', description: 'Sign-off from brand and compliance teams before full production.', order: 5, status: 'not-started', subTasks: [], createdAt: '2025-01-20' },
    ],
  },
  {
    teamRole: 'production',
    teamLabel: 'Production Team',
    stages: [
      { id: 'prod-s1', name: 'Batch Planning', description: 'Schedule batch runs based on demand forecast and capacity.', order: 1, status: 'completed', subTasks: [], createdAt: '2025-01-15' },
      { id: 'prod-s2', name: 'Raw Material Sourcing', description: 'Procure all required raw materials and packaging components.', order: 2, status: 'completed', subTasks: [], createdAt: '2025-01-15' },
      { id: 'prod-s3', name: 'Pilot Run', description: 'Run a controlled pilot batch to validate production parameters.', order: 3, status: 'in-progress', subTasks: [], createdAt: '2025-01-15' },
      { id: 'prod-s4', name: 'Quality Control', description: 'Conduct QC tests, sampling, and compliance checks on pilot output.', order: 4, status: 'not-started', subTasks: [], createdAt: '2025-01-15' },
      { id: 'prod-s5', name: 'Full Production', description: 'Execute full-scale production run across designated plants.', order: 5, status: 'not-started', subTasks: [], createdAt: '2025-01-15' },
      { id: 'prod-s6', name: 'Dispatch', description: 'Coordinate warehousing, inventory tagging, and distribution dispatch.', order: 6, status: 'not-started', subTasks: [], createdAt: '2025-01-15' },
    ],
  },
];

export function calculateLaunchReadiness(r: Brand['readiness']): number {
  return Math.round(r.compliance * 0.4 + r.production * 0.25 + r.distributor * 0.2 + r.marketing * 0.15);
}

export function getTotalProjectedRevenue(brands: Brand[]): number {
  return brands.reduce((sum, b) => sum + b.projectedRevenue, 0);
}

export function getDelayedApprovals(compliance: StateCompliance[]): number {
  return compliance.filter(c =>
    c.labelRegistration === 'delayed' || c.brandRegistration === 'delayed' || c.priceApproval === 'delayed'
  ).length;
}

export function getPendingApprovals(compliance: StateCompliance[]): number {
  return compliance.filter(c =>
    c.labelRegistration === 'pending' || c.brandRegistration === 'pending' || c.priceApproval === 'pending'
  ).length;
}
