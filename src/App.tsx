import React from 'react';
import { Layout } from 'antd';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/layout/sidebar/Sidebar';
import Header from './components/layout/header/Header';
import Groupers from './pages/Groupers';
import GrouperDetails from './pages/GrouperDetails';
import ErrorBoundary from './ErrorBoundary';
import 'antd/dist/reset.css';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Router>
        <Layout style={{ minHeight: '100vh' }}>
          <Sidebar />
          <Layout style={{ marginLeft: 250, height: '100vh' }}>
            <Header />
            <Routes>
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
