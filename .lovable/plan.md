

# ABLOS Implementation Plan

This is a greenfield build. The project currently has only the default Lovable starter template with shadcn UI components. Everything needs to be built from scratch.

The reference images show a clean enterprise dashboard with a left sidebar, top bar, card-based KPIs, data tables, timeline charts, and map visualizations. The user has also provided extensive feedback adding new modules and features beyond the original spec.

---

## Architecture

**State Management**: React Context with a central `BrandLaunchContext` holding all mock data. Actions in any module (approve, schedule, assign) update the shared state, causing dashboard metrics to recalculate live.

**Routing**: React Router with 14 routes, all wrapped in a shared `AppLayout` component (sidebar + top bar).

**Theme**: Custom CSS variables for Deep Royal Blue (`hsl(220, 60%, 20%)`) primary, Gold (`hsl(42, 75%, 55%)`) accent. Full dark mode via class toggle using `next-themes`.

---

## File Structure

```text
src/
  contexts/BrandLaunchContext.tsx    -- centralized state + demo data
  data/mockData.ts                  -- all demo brands, trials, batches, distributors
  data/indiaMapPaths.ts             -- SVG path data for India states
  layouts/AppLayout.tsx             -- sidebar + top bar shell
  components/
    Sidebar.tsx
    TopBar.tsx
    KPICard.tsx
    StatusBadge.tsx
    ReadinessGauge.tsx
    LifecycleTimeline.tsx
    IndiaMap.tsx
    LaunchFunnel.tsx
    NextActionEngine.tsx
    BrandSelector.tsx
    GlobalSearch.tsx
    SimulateApproval.tsx
    DelayCalculator.tsx
  pages/
    Dashboard.tsx
    BrandPipeline.tsx
    BrandLifecycle.tsx
    RDBlending.tsx
    PackagingLabels.tsx
    ComplianceTracker.tsx
    ProductionPlanning.tsx
    DistributorReadiness.tsx
    MarketingReadiness.tsx       -- NEW module
    LaunchRiskIntelligence.tsx
    Analytics.tsx
    Documents.tsx
    Admin.tsx
```

---

## Key Changes from Original Spec (per user feedback)

1. **Updated Lifecycle Timeline** (10 stages): Ideation → Blend Development → Sensory Approval → Packaging → Label Registration → Brand Registration → Price Approval → Production → Distributor Allocation → Market Launch

2. **Excise & State Registration Tracker** added to Compliance module with columns: State, Label Registration, Brand Registration, Price Approval, Excise Duty Category, Renewal Date, Status. Plus "Avg State Approval Time" KPI.

3. **Launch Readiness Engine** -- single composite score: Compliance 40% + Production 25% + Distributor 20% + Marketing 15%. Shown as hero metric on dashboard with breakdown bars.

4. **Marketing Readiness Module** -- new page with asset table (POS units, distributor deck, photography, campaign) with status, owner, due date.

5. **Launch Pipeline Funnel** chart on dashboard showing brand counts at each lifecycle stage.

6. **State Opportunity Map** -- India SVG map with hover showing projected revenue, distributor coverage, and approval status per state.

7. **Brand Selector** in top bar filtering all modules. **Global Search** across brands, distributors, states, batches, documents.

8. **Next Action Engine** -- card showing recommended next actions with owner and revenue impact.

9. **Demo brands**: Royal Ranthambore Reserve, Rampur Barrel Select, Magic Moments Luxe, Morpheus Black (with realistic data across all modules).

10. **Simulate Approval** button -- clicking it live-updates readiness score and projected revenue on dashboard.

---

## Implementation Phases

### Phase 1: Foundation
- Theme (CSS variables for royal blue/gold, dark mode)
- `AppLayout` with collapsible `Sidebar` (12 nav items matching reference screenshots) and `TopBar` (search, brand selector, notifications, user avatar, dark/light toggle)
- `BrandLaunchContext` with all mock data and reducer for state mutations
- Shared components: `KPICard`, `StatusBadge`, `ReadinessGauge`
- Route setup for all 14 pages

### Phase 2: Executive Dashboard
- 5 KPI cards (Brands in Pipeline, Launch Readiness composite score, Projected Revenue, Delayed Approvals, Avg Cycle Time)
- Launch Readiness Engine hero widget with breakdown (Compliance/Production/Distributor/Marketing)
- Brand Launch Pipeline table (name, stage badge, readiness progress bar, risk level)
- Launch Pipeline Funnel chart (Recharts)
- India State Opportunity Map (SVG with hover tooltips showing revenue + coverage + status)
- Revenue Forecast chart, Launch Delay Cost Calculator (interactive slider)
- Real-time Activity Log feed
- Next Action Engine card
- Simulate Approval button

### Phase 3: Brand Pipeline & Lifecycle
- Brand Pipeline page with filterable table, "Create Brand" modal (auto-generates lifecycle/compliance/production/distributor entries)
- Brand Lifecycle page with horizontal 10-stage timeline (per updated stages), tabs (Overview, Tasks, Approvals, Documents, Activity Log), current phase detail card, approval history, Brand Health Score

### Phase 4: Module Pages
- **R&D / Blending**: Trial history table, blend audit log, Final Blend Summary panel with component profile bars, "New Trial" button
- **Packaging & Labels**: Bottle design card, label artwork versions table, packaging SKUs, upload area
- **Compliance Tracker**: State-by-state table with Label/Brand/Price/Excise columns, Avg State Approval Time KPIs, compliance readiness score
- **Production Planning**: Gantt-style timeline (custom CSS bars), active batches table, state allocation & dispatch panel, KPI cards
- **Distributor Readiness**: KPI cards, distributor pipeline table with progress bars, pending compliance checklist, coverage map
- **Marketing Readiness**: Asset table with status/owner/due date, overall marketing readiness percentage
- **Launch Risk Intelligence**: Risk alert cards with revenue impact, approval delay trends chart, bottleneck analysis chart

### Phase 5: Analytics, Documents, Admin
- Analytics page with 4 charts (timeline trends, compliance time by state, production efficiency, distributor performance)
- Documents page with folder list and search
- Admin page with user table and settings

### Cross-cutting
- All approve/schedule/assign actions dispatch to context, recalculating the composite Launch Readiness Score and dashboard KPIs
- Brand Selector in TopBar filters all module data
- Global Search with command palette (cmdk) searching across all entities
- Dark mode toggle persisted via next-themes

---

## Technical Details

- **India Map**: Inline SVG with path data for major states (UP, MH, KA, Delhi, WB, TN, etc.). Each state path gets fill color based on approval status + onClick/onHover handlers showing tooltip with revenue/coverage.
- **Gantt Chart**: Custom implementation using positioned div bars within a grid (no external library needed). Each bar shows batch name, colored by status.
- **Launch Funnel**: Recharts FunnelChart or custom horizontal bar chart showing brand counts per stage.
- **Simulate Approval**: Button dispatches action to context (e.g., approve Maharashtra Label), which recalculates compliance score → composite readiness → projected revenue. Animated number transitions using CSS.
- **Readiness Gauge**: Circular progress or large number with colored breakdown bars beneath.

