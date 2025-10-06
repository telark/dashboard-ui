import React from 'react';
import { Layout, message, App as AntdApp } from 'antd';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/layout/sidebar/Sidebar';
import Header from './components/layout/header/Header';
import Groupers from './pages/grouper/Groupers';
import GrouperDetails from './pages/grouper/GrouperDetails';
import ErrorBoundary from './ErrorBoundary';
import 'antd/dist/reset.css';
import Dashboard from './pages/Dashboard';
import { DEFAULT_COLORS } from './constants';
import Startup from './pages/Startup';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkClusterInsightsThunk } from './store/slices/insightsSlice';
import type { RootState, AppDispatch } from './store';

// Ensure messages are shown below the fixed header and are visible above content
message.config({ top: 72, maxCount: 3 });

const App: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const hasClusterInsight = useSelector((s: RootState) => s.insights.hasClusterInsight);
  const initialized = useSelector((s: RootState) => s.insights.initialized);

  useEffect(() => {
    // Only check once on boot if not already persisted
    if (!initialized && !hasClusterInsight) {
      dispatch(checkClusterInsightsThunk());
    }
  }, [dispatch, initialized, hasClusterInsight]);

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
            // Show Startup while first check runs so it's not a jarring blank
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
      </Router>
    </ErrorBoundary>
  );
};

export default App;
