import React from 'react';
import { Layout } from 'antd';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar';  // Your custom Sidebar component
import Header from './components/Header/Header';    // Your custom Header component
import Groupers from './components/Grouper/Groupers';  // Your Groupers component

const App: React.FC = () => {
  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <Sidebar />
        <Layout style={{ marginLeft: 250, height: '100vh' }}>  {/* Adjust for sidebar width */}
          <Header />
          {/* Routing for different pages */}
          <Routes>
            <Route path="/groupers" element={<Groupers />} />
          </Routes>
        </Layout>
      </Layout>
    </Router>
  );
};

export default App;
