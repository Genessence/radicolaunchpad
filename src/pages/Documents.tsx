import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/PageHeader';
import { BrandBriefCard } from '@/components/BrandBriefCard';
import { FileText, Folder, Search } from 'lucide-react';

const folders = [
  { name: 'Brand Registrations', count: 12, type: 'Compliance' },
  { name: 'Label Artwork', count: 8, type: 'Design' },
  { name: 'Production Reports', count: 15, type: 'Operations' },
  { name: 'Distributor Agreements', count: 6, type: 'Legal' },
  { name: 'Excise Certificates', count: 9, type: 'Compliance' },
  { name: 'Marketing Collateral', count: 14, type: 'Marketing' },
];

const recentDocs = [
  { name: 'Royal Ranthambore - MH Label v3.2.pdf', date: 'Mar 5, 2026', size: '2.4 MB' },
  { name: 'UP Price Approval Application.docx', date: 'Mar 3, 2026', size: '890 KB' },
  { name: 'Batch B-310 Quality Report.pdf', date: 'Mar 1, 2026', size: '1.8 MB' },
  { name: 'Delhi Distributor License.pdf', date: 'Feb 28, 2026', size: '540 KB' },
  { name: 'Sensory Panel Report T1043.xlsx', date: 'Feb 25, 2026', size: '1.2 MB' },
];

export default function Documents() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Documents"
        description="Centralized document repository"
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Documents' }]}
        actions={
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search documents..." className="pl-9" />
          </div>
        }
      />

      <BrandBriefCard />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {folders.map(f => (
          <Card key={f.name} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4 text-center">
              <Folder className="h-8 w-8 mx-auto text-gold mb-2" />
              <p className="text-sm font-medium truncate">{f.name}</p>
              <p className="text-xs text-muted-foreground">{f.count} files</p>
              <Badge variant="secondary" className="text-[10px] mt-1">{f.type}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Recent Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {recentDocs.map(doc => (
              <div key={doc.name} className="flex items-center justify-between p-2.5 rounded hover:bg-muted/50 cursor-pointer">
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{doc.name}</p>
                    <p className="text-xs text-muted-foreground">{doc.date}</p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{doc.size}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
