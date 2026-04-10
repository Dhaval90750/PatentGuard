import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Layout from './components/layout/Layout';
import LoginPage from './pages/auth/LoginPage';
import PatentList from './pages/patents/PatentList';
import DrugRegistry from './pages/drugs/DrugRegistry';
import ComplianceAuditLogs from './pages/compliance/ComplianceAuditLogs';
import useAuthStore from './store/authStore';
import Dashboard from './pages/dashboard/Dashboard';
import RegulatoryReports from './pages/reports/RegulatoryReports';
import DocumentVault from './pages/documents/DocumentVault';
import UserManagement from './pages/users/UserManagement';
import MappingEngine from './pages/mapping/MappingEngine';
import NotificationsPage from './pages/notifications/NotificationsPage';
import ApiRegistry from './pages/apis/ApiRegistry';
import ErrorBoundary from './components/ErrorBoundary';
import Profile from './pages/users/Profile';
import Preferences from './pages/users/Preferences';
import Support from './pages/support/Support';
import SmtpSettings from './pages/settings/SmtpSettings';
import StrategySimulator from './pages/strategy/StrategySimulator';
import SimilarityEngine from './pages/mapping/SimilarityEngine';
import RiskHeatmap from './pages/mapping/RiskHeatmap';
import ApprovalCenter from './pages/compliance/ApprovalCenter';

const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3, ease: 'easeInOut' }}
    style={{ width: '100%', height: '100%' }}
  >
    {children}
  </motion.div>
);

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <Layout>{children}</Layout> : <Navigate to="/login" />;
};

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<LoginPage />} />
        
        {/* Core Administrative & Strategic Routes */}
        <Route path="/" element={<ProtectedRoute><PageWrapper><Dashboard /></PageWrapper></ProtectedRoute>} />
        <Route path="/patents" element={<ProtectedRoute><PageWrapper><PatentList /></PageWrapper></ProtectedRoute>} />
        <Route path="/drugs" element={<ProtectedRoute><PageWrapper><DrugRegistry /></PageWrapper></ProtectedRoute>} />
        <Route path="/compliance" element={<ProtectedRoute><PageWrapper><ComplianceAuditLogs /></PageWrapper></ProtectedRoute>} />
        <Route path="/documents" element={<ProtectedRoute><PageWrapper><DocumentVault /></PageWrapper></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute><PageWrapper><RegulatoryReports /></PageWrapper></ProtectedRoute>} />
        <Route path="/users" element={<ProtectedRoute><PageWrapper><ErrorBoundary><UserManagement /></ErrorBoundary></PageWrapper></ProtectedRoute>} />
        <Route path="/mapping" element={<ProtectedRoute><PageWrapper><MappingEngine /></PageWrapper></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><PageWrapper><NotificationsPage /></PageWrapper></ProtectedRoute>} />
        <Route path="/apis" element={<ProtectedRoute><PageWrapper><ErrorBoundary><ApiRegistry /></ErrorBoundary></PageWrapper></ProtectedRoute>} />

        {/* User Experience & Support Routes (V5.0 Fulfillment) */}
        <Route path="/profile" element={<ProtectedRoute><PageWrapper><Profile /></PageWrapper></ProtectedRoute>} />
        <Route path="/preferences" element={<ProtectedRoute><PageWrapper><Preferences /></PageWrapper></ProtectedRoute>} />
        <Route path="/settings/smtp" element={<ProtectedRoute><PageWrapper><SmtpSettings /></PageWrapper></ProtectedRoute>} />
        <Route path="/strategy/simulator" element={<ProtectedRoute><PageWrapper><StrategySimulator /></PageWrapper></ProtectedRoute>} />
        <Route path="/mapping/similarity" element={<ProtectedRoute><PageWrapper><SimilarityEngine /></PageWrapper></ProtectedRoute>} />
        <Route path="/mapping/heatmap" element={<ProtectedRoute><PageWrapper><RiskHeatmap /></PageWrapper></ProtectedRoute>} />
        <Route path="/compliance/approvals" element={<ProtectedRoute><PageWrapper><ApprovalCenter /></PageWrapper></ProtectedRoute>} />
        <Route path="/support" element={<ProtectedRoute><PageWrapper><Support /></PageWrapper></ProtectedRoute>} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}

export default App;