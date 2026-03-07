import { useBrandLaunch } from '@/contexts/BrandLaunchContext';
import { calculateLaunchReadiness, LIFECYCLE_STAGES } from '@/data/mockData';
import { StatusBadge } from '@/components/StatusBadge';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Filter } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';

export default function BrandPipeline() {
  const { state } = useBrandLaunch();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('all');

  const brands = state.brands.filter(b => {
    const matchSearch = b.name.toLowerCase().includes(search.toLowerCase());
    const matchStage = stageFilter === 'all' || b.currentStage === stageFilter;
    return matchSearch && matchStage;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Brand Pipeline</h1>
          <p className="text-sm text-muted-foreground">{state.brands.length} brands in portfolio</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Create Brand
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Brand</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div><Label>Brand Name</Label><Input placeholder="e.g. Royal Ranthambore Reserve" /></div>
              <div>
                <Label>Category</Label>
                <Select><SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="whisky">Premium Whisky</SelectItem>
                    <SelectItem value="vodka">Premium Vodka</SelectItem>
                    <SelectItem value="brandy">Brandy</SelectItem>
                    <SelectItem value="rum">Rum</SelectItem>
                    <SelectItem value="gin">Craft Gin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Target Launch Date</Label><Input type="month" /></div>
              <div><Label>Target States</Label><Input placeholder="UP, MH, KA, Delhi" /></div>
              <Button className="w-full">Create Brand & Generate Lifecycle</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search brands..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={stageFilter} onValueChange={setStageFilter}>
          <SelectTrigger className="w-48">
            <Filter className="h-3.5 w-3.5 mr-2" />
            <SelectValue placeholder="Filter by stage" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stages</SelectItem>
            {LIFECYCLE_STAGES.map(s => (
              <SelectItem key={s.key} value={s.key}>{s.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {brands.map(brand => {
          const score = calculateLaunchReadiness(brand.readiness);
          const stageLabel = LIFECYCLE_STAGES.find(s => s.key === brand.currentStage)?.label || '';
          return (
            <Card
              key={brand.id}
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate('/lifecycle', { state: { brandId: brand.id } })}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-royal/10 flex items-center justify-center">
                      <span className="text-lg font-bold text-royal">{brand.name[0]}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">{brand.name}</h3>
                      <p className="text-sm text-muted-foreground">{brand.category} · {brand.owner}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Stage</p>
                      <Badge variant="outline" className="text-xs">{stageLabel}</Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Launch</p>
                      <p className="text-sm font-medium">{brand.targetLaunchDate}</p>
                    </div>
                    <div className="text-right w-28">
                      <p className="text-xs text-muted-foreground">Readiness</p>
                      <div className="flex items-center gap-2">
                        <Progress value={score} className="h-1.5" />
                        <span className="text-sm font-medium">{score}%</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Revenue</p>
                      <p className="text-sm font-semibold text-gold">₹{brand.projectedRevenue} Cr</p>
                    </div>
                    <StatusBadge status={brand.riskLevel} />
                  </div>
                </div>
                <div className="mt-3 flex gap-1">
                  {brand.targetStates.map(s => (
                    <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
