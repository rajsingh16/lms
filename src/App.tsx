import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { ProtectedRoute } from './components/ProtectedRoute';
import { MainLayout } from './components/Layout/MainLayout';
import { LoginPage } from './components/Auth/LoginPage';
import { RegisterPage } from './components/Auth/RegisterPage';
import { Dashboard } from './pages/Dashboard';
import { Centers } from './pages/Loan/Master/Centers';
import { Clients } from './pages/Loan/Master/Clients';
import { LoanApplicationPage } from './pages/Loan/Transaction/LoanApplication';
import { ProductBranchMappingPage } from './pages/Loan/Transaction/ProductBranchMapping';
import { OverdueDashboardPage } from './pages/Loan/Dashboard/OverdueDashboard';

// Placeholder components for other routes
const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      <p className="text-gray-600 mt-1">This page is under development</p>
    </div>
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="text-2xl">🚧</span>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Coming Soon</h3>
      <p className="text-gray-600">This feature is currently under development and will be available soon.</p>
    </div>
  </div>
);

function AppRoutes() {
  const { auth } = useAuth();

  return (
    <Routes>
      {/* Public routes */}
      <Route 
        path="/login" 
        element={auth.isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />} 
      />
      <Route 
        path="/register" 
        element={auth.isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage />} 
      />

      {/* Protected routes */}
      <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        
        {/* Loan Module Routes */}
        <Route path="loan/master/centers" element={<Centers />} />
        <Route path="loan/master/areas" element={<PlaceholderPage title="Areas" />} />
        <Route path="loan/master/villages" element={<PlaceholderPage title="Villages" />} />
        <Route path="loan/master/clients" element={<Clients />} />
        <Route path="loan/master/products" element={<PlaceholderPage title="Products" />} />
        <Route path="loan/master/districts" element={<PlaceholderPage title="Districts" />} />
        <Route path="loan/master/insurance" element={<PlaceholderPage title="Insurance" />} />
        <Route path="loan/master/purpose" element={<PlaceholderPage title="Purpose" />} />
        
        <Route path="loan/transaction/application" element={<LoanApplicationPage />} />
        <Route path="loan/transaction/details" element={<PlaceholderPage title="Loan Details" />} />
        <Route path="loan/transaction/credit-bureau" element={<PlaceholderPage title="Credit Bureau" />} />
        <Route path="loan/transaction/neft" element={<PlaceholderPage title="NEFT Disbursement" />} />
        <Route path="loan/transaction/product-branch-mapping" element={<ProductBranchMappingPage />} />
        <Route path="loan/transaction/meeting" element={<PlaceholderPage title="Center Meeting" />} />
        <Route path="loan/transaction/day-close" element={<PlaceholderPage title="Branch Day Close" />} />
        
        <Route path="loan/reports/summary" element={<PlaceholderPage title="Loan Summary" />} />
        <Route path="loan/reports/repayment" element={<PlaceholderPage title="Repayment Details" />} />
        
        <Route path="loan/dashboard/collection" element={<PlaceholderPage title="Collection Dashboard" />} />
        <Route path="loan/dashboard/overdue" element={<OverdueDashboardPage />} />
        <Route path="loan/dashboard/funnel" element={<PlaceholderPage title="Application Funnel" />} />
        
        {/* Other Module Routes */}
        <Route path="finance/master" element={<PlaceholderPage title="Finance Master" />} />
        <Route path="finance/transaction" element={<PlaceholderPage title="Finance Transaction" />} />
        <Route path="finance/reports" element={<PlaceholderPage title="Finance Reports" />} />
        
        <Route path="hr/master" element={<PlaceholderPage title="HR Master" />} />
        <Route path="hr/transaction" element={<PlaceholderPage title="HR Transaction" />} />
        <Route path="hr/reports" element={<PlaceholderPage title="HR Reports" />} />
        
        <Route path="funds/master" element={<PlaceholderPage title="Funds Master" />} />
        <Route path="funds/transaction" element={<PlaceholderPage title="Funds Transaction" />} />
        
        <Route path="business-partner/external-sanction" element={<PlaceholderPage title="External Sanction" />} />
        
        <Route path="settings" element={<PlaceholderPage title="Settings" />} />
      </Route>

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;