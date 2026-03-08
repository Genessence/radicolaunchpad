import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/PageHeader';
import { BrandBriefCard } from '@/components/BrandBriefCard';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
} from 'recharts';

const timelineTrends = [
  { quarter: 'Q1 25', launched: 1, pipeline: 6 },
  { quarter: 'Q2 25', launched: 2, pipeline: 7 },
  { quarter: 'Q3 25', launched: 2, pipeline: 8 },
  { quarter: 'Q4 25', launched: 3, pipeline: 8 },
  { quarter: 'Q1 26', launched: 3, pipeline: 9 },
  { quarter: 'Q2 26', launched: 4, pipeline: 10 },
];

const complianceByState = [
  { state: 'UP', avgDays: 21 }, { state: 'MH', avgDays: 45 },
  { state: 'KA', avgDays: 32 }, { state: 'Delhi', avgDays: 18 },
  { state: 'RJ', avgDays: 38 }, { state: 'WB', avgDays: 52 },
];

const productionEfficiency = [
  { month: 'Oct', efficiency: 78 }, { month: 'Nov', efficiency: 82 },
  { month: 'Dec', efficiency: 85 }, { month: 'Jan', efficiency: 80 },
  { month: 'Feb', efficiency: 88 }, { month: 'Mar', efficiency: 91 },
];

const distributorPerformance = [
  { name: 'UP', readiness: 72, coverage: 85 },
  { name: 'MH', readiness: 45, coverage: 60 },
  { name: 'KA', readiness: 35, coverage: 40 },
  { name: 'Delhi', readiness: 82, coverage: 90 },
];

const COLORS = ['hsl(220, 60%, 20%)', 'hsl(42, 75%, 55%)', 'hsl(199, 89%, 48%)', 'hsl(142, 71%, 45%)'];

export default function Analytics() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description="Operational analytics and performance insights"
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Analytics' }]}
      />

      <BrandBriefCard />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Launch Timeline Trends</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={timelineTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="quarter" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} />
                <Area type="monotone" dataKey="pipeline" fill="hsl(220, 60%, 20%, 0.2)" stroke="hsl(220, 60%, 20%)" />
                <Area type="monotone" dataKey="launched" fill="hsl(42, 75%, 55%, 0.2)" stroke="hsl(42, 75%, 55%)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Compliance Approval Time by State</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={complianceByState} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis type="category" dataKey="state" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" width={50} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} formatter={(v: number) => [`${v} days`, 'Avg Approval']} />
                <Bar dataKey="avgDays" radius={[0, 4, 4, 0]}>
                  {complianceByState.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Production Efficiency</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={productionEfficiency}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" domain={[60, 100]} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} />
                <Line type="monotone" dataKey="efficiency" stroke="hsl(142, 71%, 45%)" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Distributor Performance</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={distributorPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} />
                <Bar dataKey="readiness" fill="hsl(220, 60%, 20%)" radius={[4, 4, 0, 0]} name="Readiness" />
                <Bar dataKey="coverage" fill="hsl(42, 75%, 55%)" radius={[4, 4, 0, 0]} name="Coverage" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
