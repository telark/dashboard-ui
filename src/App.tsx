import React from "react";
import { Layout } from "antd";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar/Sidebar";  // Custom Sidebar component
import Header from "./components/Header/Header";    // Custom Header component
import Groupers from "./components/Grouper/Groupers";  // Your Groupers component

const App: React.FC = () => {
  return (
    <Router>
      <Layout style={{ minHeight: "100vh" }}>
        <Sidebar />
        <Layout style={{ marginLeft: 250 }}>  {/* Adjust for sidebar width */}
          <Header />
          <Routes>
            <Route path="/groupers" element={<Groupers />} />
            <Route path="/dashboard" element={<Groupers />} />
          </Routes>
        </Layout>
      </Layout>
    </Router>
  );
};

export default App;
