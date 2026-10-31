import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/auth/LoginPage';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { ProductsPage } from './pages/products/ProductsPage';
import { PlansPage } from './pages/plans/PlansPage';
import { CustomersPage } from './pages/customers/CustomersPage';
import { QuotationsPage } from './pages/quotations/QuotationsPage';
import { SubscriptionsPage } from './pages/subscriptions/SubscriptionsPage';
import { InvoicesPage } from './pages/invoices/InvoicesPage';
import { PaymentsPage } from './pages/payments/PaymentsPage';
import { DiscountsPage } from './pages/discounts/DiscountsPage';
import { TaxesPage } from './pages/taxes/TaxesPage';
import { ReportsPage } from './pages/reports/ReportsPage';
import { RemindersPage } from './pages/reminders/RemindersPage';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Route */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Main Dashboard Layout Routes */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/plans" element={<PlansPage />} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/quotations" element={<QuotationsPage />} />
          <Route path="/subscriptions" element={<SubscriptionsPage />} />
          <Route path="/invoices" element={<InvoicesPage />} />
          <Route path="/payments" element={<PaymentsPage />} />
          <Route path="/discounts" element={<DiscountsPage />} />
          <Route path="/taxes" element={<TaxesPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/reminders" element={<RemindersPage />} />
        </Route>

        {/* Default Redirect */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
