import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { DashboardLayout } from './components/layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ErrorBoundary } from './components/ErrorBoundary';
import { 
  LoginPage, 
  DashboardPage, 
  StudentsPage, 
  AccessLogsPage,
  CampusStatePage,
  StudentEntryPage,
  StudentExitPage,
  VisitorEntryPage,
  VisitorExitPage,
} from './pages';
import { useAuthStore, useUIStore } from './store';
import { ROUTES } from './constants';
import './App.css';

// Create a query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  const { loadUser } = useAuthStore();
  const { theme, setTheme } = useUIStore();

  useEffect(() => {
    // Load user from storage
    loadUser();
    
    // Initialize theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
  }, [loadUser, setTheme]);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />

            {/* Protected routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to={ROUTES.DASHBOARD} replace />} />
              <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
              <Route path={ROUTES.STUDENTS} element={<StudentsPage />} />
              <Route path="/students/entry" element={<StudentEntryPage />} />
              <Route path="/students/exit" element={<StudentExitPage />} />
              <Route path={ROUTES.VISITORS} element={<StudentsPage />} />
              <Route path="/visitors/entry" element={<VisitorEntryPage />} />
              <Route path="/visitors/exit" element={<VisitorExitPage />} />
              <Route path={ROUTES.ACCESS_LOGS} element={<AccessLogsPage />} />
              <Route path={ROUTES.CAMPUS_STATE} element={<CampusStatePage />} />
              <Route path={ROUTES.ANALYTICS} element={<DashboardPage />} />
              <Route path={ROUTES.SETTINGS} element={<DashboardPage />} />
              <Route path={ROUTES.PROFILE} element={<DashboardPage />} />
            </Route>

            {/* Catch all - redirect to dashboard */}
            <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
          </Routes>
        </BrowserRouter>

        {/* Toast notifications */}
        <Toaster 
          position="top-right" 
          richColors 
          closeButton
          theme={theme}
        />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
