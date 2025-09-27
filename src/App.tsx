import React from 'react';
import { Layout } from 'antd';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/layout/sidebar/Sidebar';
import Header from './components/layout/header/Header';
import Groupers from './pages/grouper/Groupers';
import GrouperDetails from './pages/grouper/GrouperDetails';
import ErrorBoundary from './ErrorBoundary';
import 'antd/dist/reset.css';
import Dashboard from './pages/Dashboard';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Router>
        <Layout style={{ minHeight: '100vh' }}>
          <Sidebar />
          <Layout style={{ marginLeft: 'var(--sidebar-width)', height: '100vh', transition: 'margin-left 0.3s ease' }}>
            <Header />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/groupers" element={<Groupers />} />
              <Route path="/groupers/:name/details" element={<GrouperDetails />} />
            </Routes>
          </Layout>
        </Layout>
      </Router>
    </ErrorBoundary>
  );
};

export default App;
