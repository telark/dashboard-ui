import React from 'react';
import { Layout, message, App as AntdApp } from 'antd';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/layout/sidebar/Sidebar';
import Header from './components/layout/header/Header';
import ErrorBoundary from './ErrorBoundary';
import 'antd/dist/reset.css';
import { DEFAULT_COLORS, APP_CONFIGS, APP_ROUTES } from './constants';
import { Dashboard, Groupers, GrouperDetails, Startup, Welcome } from './pages';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkClusterInsightsThunk } from './store/slices/insightsSlice';
import type { RootState, AppDispatch } from './store';

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
        const pending = window.sessionStorage.getItem(APP_CONFIGS.WELCOME.STORAGE_KEY);
        if (pending === APP_CONFIGS.WELCOME.STORAGE_VALUE) {
          setShowWelcome(true);
          window.sessionStorage.removeItem(APP_CONFIGS.WELCOME.STORAGE_KEY);
          window.setTimeout(() => setShowWelcome(false), APP_CONFIGS.WELCOME.DURATION);
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

  return (
    <ErrorBoundary>
      <Router>
        <AntdApp>
          {!initialized ? (
            <Startup onStartAnalyze={handleStartAnalyze} />
          ) : !hasClusterInsight ? (
            <Startup onStartAnalyze={handleStartAnalyze} />
          ) : (
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
                <Routes>
                  <Route path={APP_ROUTES.HOME} element={<Dashboard />} />
                  <Route path={APP_ROUTES.GROUPERS} element={<Groupers />} />
                  <Route path={APP_ROUTES.GROUPER_DETAILS} element={<GrouperDetails />} />
                </Routes>
              </Layout>
            </Layout>
          )}
        </AntdApp>
        {showWelcome && <Welcome />}
      </Router>
    </ErrorBoundary>
  );
};

export default App;
