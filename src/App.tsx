
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import LandingPage from "./pages/LandingPage";
import DashboardHome from "./pages/dashboard/DashboardHome";
import DashboardAnalytics from "./pages/dashboard/DashboardAnalytics";
import DashboardSettings from "./pages/dashboard/DashboardSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/dashboard" element={<Dashboard />}>
            <Route path="/dashboard/home" element={<DashboardHome />} />
            <Route path="/dashboard/analytics" element={<DashboardAnalytics />} />
            <Route path="/dashboard/settings" element={<DashboardSettings />} />
            <Route path="/dashboard/create-agent" element={<Index />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
