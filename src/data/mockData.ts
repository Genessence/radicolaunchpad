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
