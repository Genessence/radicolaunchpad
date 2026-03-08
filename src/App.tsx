import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/contexts/AuthContext";
import { BrandLaunchProvider } from "@/contexts/BrandLaunchContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import AppLayout from "@/layouts/AppLayout";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import BrandPipeline from "@/pages/BrandPipeline";
import BrandLifecycle from "@/pages/BrandLifecycle";
import RDBlending from "@/pages/RDBlending";
import PackagingLabels from "@/pages/PackagingLabels";
import ComplianceTracker from "@/pages/ComplianceTracker";
import ProductionPlanning from "@/pages/ProductionPlanning";
import DistributorReadiness from "@/pages/DistributorReadiness";
import MarketingReadiness from "@/pages/MarketingReadiness";
import LaunchRiskIntelligence from "@/pages/LaunchRiskIntelligence";
import Analytics from "@/pages/Analytics";
import Documents from "@/pages/Documents";
import Admin from "@/pages/Admin";
import { ApprovalQueue } from "@/components/ApprovalQueue";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <AuthProvider>
        <BrandLaunchProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                  element={
                    <ProtectedRoute>
                      <AppLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route path="/" element={<Dashboard />} />
                <Route path="/pipeline" element={<BrandPipeline />} />
                <Route path="/lifecycle" element={<BrandLifecycle />} />
                <Route path="/rd-blending" element={<RDBlending />} />
                <Route path="/packaging" element={<PackagingLabels />} />
                <Route path="/compliance" element={<ComplianceTracker />} />
                <Route path="/production" element={<ProductionPlanning />} />
                <Route path="/distributors" element={<DistributorReadiness />} />
                <Route path="/marketing" element={<MarketingReadiness />} />
                <Route path="/risk" element={<LaunchRiskIntelligence />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/documents" element={<Documents />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/admin/approvals" element={<ApprovalQueue />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </BrandLaunchProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
