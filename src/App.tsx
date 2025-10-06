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
import { useEffect, useState } from 'react';
import { checkClusterInsights } from './clients/exporter';

// Ensure messages are shown below the fixed header and are visible above content
message.config({ top: 72, maxCount: 3 });

const App: React.FC = () => {
  const [showStartup, setShowStartup] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await checkClusterInsights();
        const hasInsights = Boolean(res?.data);
        setShowStartup(!hasInsights);
      } catch {
        // On unexpected errors, do not block the app; continue normal flow
        setShowStartup(false);
      }
    })();
  }, []);

  const handleStartAnalyze = () => {
    // Placeholder for next step; currently, just keep showing the page
  };

  return (
    <ErrorBoundary>
      <Router>
        <AntdApp>
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
              {showStartup ? (
                <Startup onStartAnalyze={handleStartAnalyze} />
              ) : (
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/groupers" element={<Groupers />} />
                  <Route path="/groupers/:name/details" element={<GrouperDetails />} />
                </Routes>
              )}
            </Layout>
          </Layout>
        </AntdApp>
      </Router>
    </ErrorBoundary>
  );
};

export default App;
