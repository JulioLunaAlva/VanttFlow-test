import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { FinanceProvider } from "@/context/FinanceContext";
import { IdentityProvider, useIdentity } from "@/context/IdentityContext";
import { Layout } from "@/components/layout/Layout";
import { DashboardPage } from "@/pages/DashboardPage";
import { TransactionsPage } from "@/pages/TransactionsPage";
import { ScheduledPage } from "@/pages/ScheduledPage";
import { BudgetPage } from "@/pages/BudgetPage";
import { GoalsPage } from "@/pages/GoalsPage";
import { ReportsPage } from "@/pages/ReportsPage";
import { CategoriesPage } from "@/pages/CategoriesPage";
import { CreditCardsPage } from "@/pages/CreditCardsPage";
import { SubscriptionsPage } from "@/pages/SubscriptionsPage";
import { AnalyticsPage } from "@/pages/AnalyticsPage";
import { ImportPage } from "@/pages/ImportPage";
import { MarketPage } from "@/pages/MarketPage";
import { LandingPage } from "@/pages/LandingPage";
import { LoginPage } from "@/pages/LoginPage";
import { OnboardingWizard } from "@/pages/OnboardingWizard";
import { SettingsPage } from "@/pages/SettingsPage";

import { Toaster } from "sonner";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ThemeProvider } from "@/context/ThemeProvider";
import { GamificationProvider } from "@/context/GamificationContext";
import { MarketProvider } from "@/context/MarketContext";
import { OfflineIndicator } from "@/components/pwa/OfflineIndicator";
import { InstallPrompt } from "@/components/pwa/InstallPrompt";

// Wrapper for protected routes
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useIdentity();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Layout>{children}</Layout>;
};

// Root Component to handle Landing vs Dashboard
const RootRoute = () => {
  const { user, isAuthenticated } = useIdentity();
  if (user && isAuthenticated) {
    return <Layout><DashboardPage /></Layout>;
  } else if (user && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  } else {
    return <LandingPage />;
  }
};

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
          <IdentityProvider>
            <GamificationProvider>
              <MarketProvider>
                <FinanceProvider>
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<RootRoute />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/setup" element={<OnboardingWizard />} />

                    {/* Protected Routes */}
                    <Route path="/transactions" element={<ProtectedRoute><TransactionsPage /></ProtectedRoute>} />
                    <Route path="/scheduled" element={<ProtectedRoute><ScheduledPage /></ProtectedRoute>} />
                    <Route path="/budget" element={<ProtectedRoute><BudgetPage /></ProtectedRoute>} />
                    <Route path="/goals" element={<ProtectedRoute><GoalsPage /></ProtectedRoute>} />
                    <Route path="/reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
                    <Route path="/categories" element={<ProtectedRoute><CategoriesPage /></ProtectedRoute>} />
                    <Route path="/cards" element={<ProtectedRoute><CreditCardsPage /></ProtectedRoute>} />
                    <Route path="/subscriptions" element={<ProtectedRoute><SubscriptionsPage /></ProtectedRoute>} />
                    <Route path="/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
                    <Route path="/import" element={<ProtectedRoute><ImportPage /></ProtectedRoute>} />
                    <Route path="/market" element={<ProtectedRoute><MarketPage /></ProtectedRoute>} />

                    <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                  <Toaster />
                </FinanceProvider>
              </MarketProvider>
            </GamificationProvider>
          </IdentityProvider>
        </ThemeProvider>
        {/* PWA Components */}
        <OfflineIndicator />
        <InstallPrompt />
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
