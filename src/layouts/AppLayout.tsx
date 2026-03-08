import { Outlet, useLocation, Navigate } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { TopBar } from '@/components/TopBar';
import { useAuth } from '@/contexts/AuthContext';
import { isPathAllowedForRole } from '@/components/AppSidebar';

export default function AppLayout() {
  const { role } = useAuth();
  const location = useLocation();
  const pathname = location.pathname.replace(/\/$/, '') || '/';

  if (!isPathAllowedForRole(pathname, role)) {
    return <Navigate to="/" replace />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-background via-muted/20 to-background bg-[radial-gradient(ellipse_at_top_right,_hsl(var(--muted))_0%,_transparent_50%)]">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <TopBar />
          <main className="flex-1 overflow-auto p-6 animate-in-fade">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
