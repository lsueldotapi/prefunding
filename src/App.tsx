import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Wallet } from 'lucide-react';
import FundingPage from './pages/FundingPage';
import AdminPage from './pages/AdminPage';
import HomePage from './pages/HomePage';
import FundingPageV2 from './pages/FundingPageV2';
import AdminPageV2 from './pages/AdminPageV2';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/funding/:clientId" element={<FundingPage />} />
        <Route path="/admin/:adminId" element={<AdminPage />} />
        <Route path="/funding-v2/:clientId" element={<FundingPageV2 />} />
        <Route path="/admin-v2/:adminId" element={<AdminPageV2 />} />
      </Routes>
    </Router>
  );
}

export default App;