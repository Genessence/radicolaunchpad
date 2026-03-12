import {
  LayoutDashboard, GitBranch, CircleDot, FlaskConical, Package, ShieldCheck,
  Factory, Truck, BarChart3, FileText, Settings, Megaphone, AlertTriangle, ClipboardCheck,
} from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useLocation } from 'react-router-dom';
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,
} from '@/components/ui/sidebar';
import { useAuth, type Role } from '@/contexts/AuthContext';

const ALL_NAV_ITEMS = [
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
  { title: 'Approval Queue', url: '/admin/approvals', icon: ClipboardCheck },
];

const ROLE_ALLOWED_URLS: Record<Role, string[]> = {
  admin: ALL_NAV_ITEMS.map((i) => i.url),
  rd: ['/', '/pipeline', '/lifecycle', '/rd-blending', '/documents'],
  packing: ['/', '/pipeline', '/packaging', '/documents'],
  production: ['/', '/pipeline', '/lifecycle', '/compliance', '/production', '/distributors', '/documents'],
  marketing: ['/', '/pipeline', '/lifecycle', '/marketing', '/analytics', '/documents'],
};

const RELATED_SECTION_URLS = ['/rd-blending', '/packaging', '/compliance', '/production', '/marketing', '/distributors'];

export function getNavItemsForRole(role: Role | null) {
  if (!role) return [];
  const allowed = ROLE_ALLOWED_URLS[role] ?? [];
  return ALL_NAV_ITEMS.filter((item) => allowed.includes(item.url));
}

export function isPathAllowedForRole(pathname: string, role: Role | null): boolean {
  if (!role) return false;
  const allowed = ROLE_ALLOWED_URLS[role] ?? [];
  const normalized = pathname === '' ? '/' : pathname;
  return allowed.includes(normalized);
}

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const location = useLocation();
  const { role } = useAuth();
  const navItems = getNavItemsForRole(role).filter((item) => !RELATED_SECTION_URLS.includes(item.url));

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
              {navItems.filter((item) => item.url !== "/lifecycle").map((item) => {
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
