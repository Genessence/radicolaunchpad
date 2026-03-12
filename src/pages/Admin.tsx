import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { PageHeader } from '@/components/PageHeader';
import { useBrandLaunch } from '@/contexts/BrandLaunchContext';
import { Settings, Users, ClipboardCheck } from 'lucide-react';

const users = [
  { name: 'Arun Sharma', role: 'Brand Manager', email: 'arun@radico.com', status: 'Active' },
  { name: 'Priya Mehta', role: 'Compliance Head', email: 'priya@radico.com', status: 'Active' },
  { name: 'Vikram Singh', role: 'Production Manager', email: 'vikram@radico.com', status: 'Active' },
  { name: 'Deepa Nair', role: 'R&D Lead', email: 'deepa@radico.com', status: 'Active' },
  { name: 'Rajesh Kumar', role: 'Master Blender', email: 'rajesh@radico.com', status: 'Active' },
];

export default function Admin() {
  const { getPendingApprovalBrands } = useBrandLaunch();
  const pendingCount = getPendingApprovalBrands().length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin"
        description="User management and system settings"
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Admin' }]}
        showBrandSelector={false}
      />

      {pendingCount > 0 && (
        <Card className="border-gold/50 bg-gold/5">
          <CardContent className="py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5 text-gold" />
              <span className="font-medium">{pendingCount} stage gate(s) pending approval</span>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link to="/admin/approvals">Review Approval Queue</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Users className="h-4 w-4" /> User Management
            </CardTitle>
            <Button size="sm">Add User</Button>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead><tr className="border-b">
                <th className="text-left py-2 text-xs text-muted-foreground">Name</th>
                <th className="text-left py-2 text-xs text-muted-foreground">Role</th>
                <th className="text-left py-2 text-xs text-muted-foreground">Email</th>
                <th className="text-left py-2 text-xs text-muted-foreground">Status</th>
              </tr></thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.email} className="border-b border-border/50">
                    <td className="py-2.5 font-medium">{u.name}</td>
                    <td className="py-2.5"><Badge variant="secondary" className="text-xs">{u.role}</Badge></td>
                    <td className="py-2.5 text-muted-foreground text-xs">{u.email}</td>
                    <td className="py-2.5"><Badge variant="outline" className="text-xs text-success">{u.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Settings className="h-4 w-4" /> System Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm">Email Notifications</Label>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-sm">Auto-Approve Low Risk</Label>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-sm">Risk Alert Threshold</Label>
              <Input className="w-20 h-8 text-sm" defaultValue="₹10 Cr" />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-sm">Default Launch Cycle</Label>
              <Input className="w-20 h-8 text-sm" defaultValue="180" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
