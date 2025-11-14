import React, { useEffect, useState } from 'react';
import { Layout, message, App as AntdApp } from 'antd';
import { BrowserRouter as Router, useLocation, Navigate } from 'react-router-dom';
import Sidebar from './components/layout/sidebar/Sidebar';
import Header from './components/layout/header/Header';
import ErrorBoundary from './ErrorBoundary';
import SessionExpiredModal from './components/auth/SessionExpiredModal';
import 'antd/dist/reset.css';
import { DEFAULT_COLORS, APP_CONFIGS, APP_ROUTES, COMMON_VALUES } from './constants';
import { Startup, Welcome } from './pages';
import AppRoutes from './routes/AppRoutes';
import { useDispatch, useSelector } from 'react-redux';
import { checkClusterInsightsThunk } from './store/insights/slices/insightsSlice';
import type { RootState, AppDispatch } from './store';
import { FancySpinner } from './components/shared';
import { hasSessionToken } from './utils/auth/session';
import { validateSession } from './utils/auth/sessionValidation';
import { isDevelopment } from './utils/helpers/env';
import logger from './logging';
import { AUTH_CONFIG } from './constants/auth/config';

// Ensure messages are shown below the fixed header and are visible above content
message.config({ top: APP_CONFIGS.MESSAGE.TOP, maxCount: APP_CONFIGS.MESSAGE.MAX_COUNT });

const AppContent: React.FC = () => {
  const location = useLocation();
  const isAuthRoute =
    location.pathname === APP_ROUTES.LOGIN || location.pathname === APP_ROUTES.REGISTER;
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
  useEffect(() => {
    if (!isAuthenticated || isAuthRoute) {
      return;
    }

    const checkSessionExpiration = async () => {
      try {
        const validationResult = await validateSession();
        if (validationResult.isExpired) {
          if (isDevelopment()) {
            logger.warn('Session expired:', validationResult);
          }
          setShowSessionExpiredModal(true);
        }
      } catch (error) {
        if (isDevelopment()) {
          logger.error('Error checking session expiration:', error);
        }
        // On error, don't show modal - let normal auth flow handle it
      }
    };

    // Run initial check
    checkSessionExpiration();

    // Set up interval for background checking
    const intervalId = globalThis.setInterval(
      checkSessionExpiration,
      AUTH_CONFIG.SESSION.VALIDATION.INTERVAL_SECONDS * 1000,
    );

    // Cleanup interval on unmount or when dependencies change
    return () => {
      globalThis.clearInterval(intervalId);
    };
  }, [isAuthenticated, isAuthRoute]);

  // Show a brief welcome overlay after analysis start completes
  useEffect(() => {
    if (hasClusterInsight) {
      try {
        const pending = globalThis.sessionStorage.getItem(APP_CONFIGS.WELCOME.STORAGE_KEY);
        if (pending === APP_CONFIGS.WELCOME.STORAGE_VALUE) {
          setShowWelcome(true);
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

  return (
    <AntdApp>
      {initialized && hasClusterInsight ? (
        isAuthRoute ? (
          <AppRoutes />
        ) : isAuthenticated ? (
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
        ) : (
          // Not authenticated and not on auth route - redirect immediately without rendering layout
          <Navigate to={APP_ROUTES.LOGIN} state={{ from: location }} replace />
        )
      ) : (
        <Startup onStartAnalyze={handleStartAnalyze} />
      )}
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
