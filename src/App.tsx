import React, { useEffect, useState } from 'react';
import { Layout, message, App as AntdApp } from 'antd';
import { BrowserRouter as Router } from 'react-router-dom';
import Sidebar from './components/layout/sidebar/Sidebar';
import Header from './components/layout/header/Header';
import ErrorBoundary from './ErrorBoundary';
import 'antd/dist/reset.css';
import { DEFAULT_COLORS, APP_CONFIGS } from './constants';
import { Startup, Welcome } from './pages';
import AppRoutes from './routes/AppRoutes';
import { useDispatch, useSelector } from 'react-redux';
import { checkClusterInsightsThunk } from './store/insights/slices/insightsSlice';
import type { RootState, AppDispatch } from './store';
import { FancySpinner } from './components/shared';

// Ensure messages are shown below the fixed header and are visible above content
message.config({ top: APP_CONFIGS.MESSAGE.TOP, maxCount: APP_CONFIGS.MESSAGE.MAX_COUNT });

const App: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const hasClusterInsight = useSelector((s: RootState) => s.insights.hasClusterInsight);
  const initialized = useSelector((s: RootState) => s.insights.initialized);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    // Always run a first check on boot to decide screen
    if (!initialized) {
      dispatch(checkClusterInsightsThunk());
    }
  }, [dispatch, initialized]);

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
        <FancySpinner label="Verifying cluster insights..." showLabel={true} />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Router>
        <AntdApp>
          {initialized && hasClusterInsight ? (
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
            <Startup onStartAnalyze={handleStartAnalyze} />
          )}
        </AntdApp>
        {showWelcome && <Welcome />}
      </Router>
    </ErrorBoundary>
  );
};

export default App;
