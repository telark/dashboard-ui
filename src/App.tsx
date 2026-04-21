import React, { useEffect, useState, startTransition } from 'react';
import { Layout, message, App as AntdApp } from 'antd';
import { BrowserRouter as Router, useLocation, Navigate } from 'react-router-dom';
import Sidebar from './components/layout/sidebar/Sidebar';
import Header from './components/layout/header/Header';
import ErrorBoundary from './ErrorBoundary';
import { SessionExpiredModal } from './features/auth/components';
import 'antd/dist/reset.css';
import { DEFAULT_COLORS, APP_CONFIGS, APP_ROUTES, COMMON_VALUES } from './constants';
import { Startup, Welcome } from './features/insights/pages';
import { checkClusterInsightsThunk } from './features/insights/store';
import AppRoutes from './routes/AppRoutes';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';
import { FancySpinner } from './components/animation';
import { hasSessionToken, useSessionExpirationCheck } from './features/auth/utils';
import { useInitializeCategories } from './features/access-and-permissions/categories/hooks';
import { useInitializeRoles } from './features/access-and-permissions/roles/hooks';

message.config({ top: APP_CONFIGS.MESSAGE.TOP, maxCount: APP_CONFIGS.MESSAGE.MAX_COUNT });

const AppContent: React.FC = () => {
  const location = useLocation();
  const isAuthRoute =
    location.pathname === APP_ROUTES.LOGIN ||
    location.pathname === APP_ROUTES.REGISTER ||
    location.pathname === APP_ROUTES.GOOGLE_CALLBACK;
  const isAuthenticated = hasSessionToken();
  const dispatch: AppDispatch = useDispatch();
  const hasClusterInsight = useSelector((s: RootState) => s.insights.hasClusterInsight);
  const initialized = useSelector((s: RootState) => s.insights.initialized);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showSessionExpiredModal, setShowSessionExpiredModal] = useState(false);

  useEffect(() => {
    // Always run a first check on boot to decide screen
    if (!initialized) {
      dispatch(checkClusterInsightsThunk());
    }
  }, [dispatch, initialized]);

  // Check session expiration as background task when authenticated
  useSessionExpirationCheck({
    isAuthenticated,
    isAuthRoute,
    onSessionExpired: () => setShowSessionExpiredModal(true),
  });

  // Initialize built-in categories and roles when authenticated
  useInitializeCategories(isAuthenticated);
  useInitializeRoles(isAuthenticated);

  // Show a brief welcome overlay after analysis start completes
  useEffect(() => {
    if (hasClusterInsight) {
      try {
        const pending = globalThis.sessionStorage.getItem(APP_CONFIGS.WELCOME.STORAGE_KEY);
        if (pending === APP_CONFIGS.WELCOME.STORAGE_VALUE) {
          startTransition(() => {
            setShowWelcome(true);
          });
          globalThis.sessionStorage.removeItem(APP_CONFIGS.WELCOME.STORAGE_KEY);
          globalThis.setTimeout(() => setShowWelcome(false), APP_CONFIGS.WELCOME.DURATION);
        }
      } catch {
        // ignore
      }
    }
  }, [hasClusterInsight]);

  const handleStartAnalyze = () => {
    // Placeholder: user will define action next step
    // For now, re-check insights on click
    dispatch(checkClusterInsightsThunk());
  };

  // If we have persisted insights but haven't verified yet, show loading
  if (hasClusterInsight && !initialized) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: '#ffffff',
        }}
      >
        <FancySpinner label={COMMON_VALUES.LOADING.VERIFYING_CLUSTER_INSIGHTS} showLabel={true} />
      </div>
    );
  }

  const renderMainContent = () => {
    if (!initialized || !hasClusterInsight) {
      return <Startup onStartAnalyze={handleStartAnalyze} />;
    }

    if (isAuthRoute) {
      return <AppRoutes />;
    }

    if (isAuthenticated) {
      return (
        <Layout style={{ minHeight: APP_CONFIGS.LAYOUT.MIN_HEIGHT }}>
          <Sidebar />
          <Layout
            style={{
              marginLeft: APP_CONFIGS.LAYOUT.MARGIN_LEFT,
              height: APP_CONFIGS.LAYOUT.HEIGHT,
              transition: APP_CONFIGS.LAYOUT.TRANSITION,
              background: DEFAULT_COLORS.PAGE_BG,
            }}
          >
            <Header />
            <AppRoutes />
          </Layout>
        </Layout>
      );
    }

    return <Navigate to={APP_ROUTES.LOGIN} state={{ from: location }} replace />;
  };

  return (
    <AntdApp>
      {renderMainContent()}
      {showWelcome && <Welcome />}
      <SessionExpiredModal
        open={showSessionExpiredModal}
        onClose={() => setShowSessionExpiredModal(false)}
      />
    </AntdApp>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Router>
        <AppContent />
      </Router>
    </ErrorBoundary>
  );
};

export default App;
