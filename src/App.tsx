import React from 'react';
import { Layout, message, App as AntdApp } from 'antd';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/layout/sidebar/Sidebar';
import Header from './components/layout/header/Header';
import ErrorBoundary from './ErrorBoundary';
import 'antd/dist/reset.css';
import { DEFAULT_COLORS } from './constants';
import { Dashboard, Groupers, GrouperDetails, Startup, Welcome } from './pages';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkClusterInsightsThunk } from './store/slices/insightsSlice';
import type { RootState, AppDispatch } from './store';

// Ensure messages are shown below the fixed header and are visible above content
message.config({ top: 72, maxCount: 3 });

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
        const pending = window.sessionStorage.getItem('WELCOME_PENDING');
        if (pending === '1') {
          setShowWelcome(true);
          window.sessionStorage.removeItem('WELCOME_PENDING');
          window.setTimeout(() => setShowWelcome(false), 3000);
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
            <Layout style={{ minHeight: '100vh' }}>
              <Sidebar />
              <Layout
                style={{
                  marginLeft: 'var(--sidebar-width)',
                  height: '100vh',
                  transition: 'margin-left 0.3s ease',
                  background: DEFAULT_COLORS.PAGE_BG,
                }}
              >
                <Header />
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/groupers" element={<Groupers />} />
                  <Route path="/groupers/:name/details" element={<GrouperDetails />} />
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
