import {
  LayoutDashboard, GitBranch, CircleDot, FlaskConical, Package, ShieldCheck,
  Factory, Truck, Rocket, BarChart3, FileText, Settings, Megaphone, AlertTriangle,
} from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useLocation } from 'react-router-dom';
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,
} from '@/components/ui/sidebar';

const navItems = [
  { title: 'Dashboard', url: '/', icon: LayoutDashboard },
  { title: 'Brand Pipeline', url: '/pipeline', icon: GitBranch },
  { title: 'Brand Lifecycle', url: '/lifecycle', icon: CircleDot },
  { title: 'R&D / Blending', url: '/rd-blending', icon: FlaskConical },
  { title: 'Packaging & Labels', url: '/packaging', icon: Package },
  { title: 'Compliance Tracker', url: '/compliance', icon: ShieldCheck },
  { title: 'Production Planning', url: '/production', icon: Factory },
  { title: 'Distributor Readiness', url: '/distributors', icon: Truck },
  { title: 'Marketing Readiness', url: '/marketing', icon: Megaphone },
  { title: 'Launch Risk Intelligence', url: '/risk', icon: AlertTriangle },
  { title: 'Analytics', url: '/analytics', icon: BarChart3 },
  { title: 'Documents', url: '/documents', icon: FileText },
  { title: 'Admin', url: '/admin', icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const location = useLocation();

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <div className="flex items-center gap-2 px-4 py-5 border-b border-sidebar-border">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gold text-gold-foreground font-bold text-sm shrink-0">
          A
        </div>
        {!collapsed && (
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold text-sidebar-accent-foreground tracking-wide">ABLOS</span>
            <span className="text-[10px] text-sidebar-foreground/60 truncate">Brand Launch OS</span>
          </div>
        )}
      </div>
      <SidebarContent className="px-2 py-3">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <NavLink
                        to={item.url}
                        end={item.url === '/'}
                        className="flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        activeClassName="bg-sidebar-accent text-gold font-medium"
                      >
                        <item.icon className="h-4 w-4 shrink-0" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
