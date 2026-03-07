import { Bell, Moon, Sun, Search, User } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useBrandLaunch } from '@/contexts/BrandLaunchContext';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Popover, PopoverContent, PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

export function TopBar() {
  const { theme, setTheme } = useTheme();
  const { state, dispatch } = useBrandLaunch();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const activeAlerts = state.riskAlerts.filter(r => r.status === 'active').length;

  return (
    <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="text-muted-foreground hover:text-foreground" />

        <Popover open={searchOpen} onOpenChange={setSearchOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="w-64 justify-start gap-2 text-muted-foreground font-normal">
              <Search className="h-3.5 w-3.5" />
              <span>Search brands, states, batches...</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-2" align="start">
            <Input
              placeholder="Type to search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            {searchQuery && (
              <div className="mt-2 space-y-1">
                {state.brands
                  .filter(b => b.name.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map(b => (
                    <div key={b.id} className="px-2 py-1.5 text-sm rounded hover:bg-muted cursor-pointer">
                      <span className="font-medium">{b.name}</span>
                      <span className="text-muted-foreground ml-2">{b.category}</span>
                    </div>
                  ))}
                {state.stateOpportunities
                  .filter(s => s.state.toLowerCase().includes(searchQuery.toLowerCase()))
                  .slice(0, 3)
                  .map(s => (
                    <div key={s.stateCode} className="px-2 py-1.5 text-sm rounded hover:bg-muted cursor-pointer">
                      <span className="font-medium">{s.state}</span>
                      <span className="text-muted-foreground ml-2">₹{s.projectedRevenue} Cr</span>
                    </div>
                  ))}
              </div>
            )}
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex items-center gap-2">
        <Select
          value={state.selectedBrandId}
          onValueChange={(v) => dispatch({ type: 'SELECT_BRAND', brandId: v })}
        >
          <SelectTrigger className="w-52 h-9 text-sm">
            <SelectValue placeholder="All Brands" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Brands</SelectItem>
            {state.brands.map(b => (
              <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              {activeAlerts > 0 && (
                <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-destructive text-destructive-foreground">
                  {activeAlerts}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-3" align="end">
            <h4 className="font-semibold text-sm mb-2">Active Alerts</h4>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {state.riskAlerts.filter(r => r.status === 'active').map(alert => (
                <div key={alert.id} className="text-sm p-2 rounded bg-muted">
                  <p className="font-medium">{alert.type}</p>
                  <p className="text-muted-foreground text-xs">Impact: ₹{alert.projectedRevenueImpact} Cr</p>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>

        <div className="flex items-center gap-2 pl-2 border-l border-border">
          <div className="w-8 h-8 rounded-full bg-royal flex items-center justify-center">
            <User className="h-4 w-4 text-primary-foreground" />
          </div>
          <div className="hidden lg:block">
            <p className="text-xs font-medium leading-none">Admin User</p>
            <p className="text-[10px] text-muted-foreground">Radico Khaitan</p>
          </div>
        </div>
      </div>
    </header>
  );
}
