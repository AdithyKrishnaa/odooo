export interface Customer {
  id: string;
  name: string;
  email: string;
  company: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface Subscription {
  id: string;
  customerName: string;
  planName: string;
  billingInterval: 'monthly' | 'yearly';
  amount: number;
  status: 'active' | 'paused' | 'canceled' | 'trialing';
  startDate: string;
}

export interface Invoice {
  id: string;
  customerName: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  dueDate: string;
  issuedDate: string;
}

export interface Payment {
  id: string;
  invoiceId: string;
  customerName: string;
  amount: number;
  method: 'Credit Card' | 'ACH Transfer' | 'PayPal';
  status: 'completed' | 'failed' | 'refunded';
  date: string;
}

export const mockCustomers: Customer[] = [
  { id: 'CUST-001', name: 'Acme Corp', email: 'billing@acme.com', company: 'Acme Inc', status: 'active', createdAt: '2026-01-15' },
  { id: 'CUST-002', name: 'Global Tech', email: 'contact@globaltech.io', company: 'Global Tech', status: 'active', createdAt: '2026-02-01' },
  { id: 'CUST-003', name: 'Stark Industries', email: 'tony@stark.com', company: 'Stark Ind', status: 'inactive', createdAt: '2026-03-10' },
];

export const mockSubscriptions: Subscription[] = [
  { id: 'SUB-1001', customerName: 'Acme Corp', planName: 'Enterprise SaaS Plan', billingInterval: 'monthly', amount: 499, status: 'active', startDate: '2026-01-15' },
  { id: 'SUB-1002', customerName: 'Global Tech', planName: 'Pro Tier Plan', billingInterval: 'yearly', amount: 1200, status: 'trialing', startDate: '2026-02-01' },
  { id: 'SUB-1003', customerName: 'Stark Industries', planName: 'Basic Tier Plan', billingInterval: 'monthly', amount: 99, status: 'paused', startDate: '2026-03-10' },
];

export const mockInvoices: Invoice[] = [
  { id: 'INV-2026-001', customerName: 'Acme Corp', amount: 499, status: 'paid', dueDate: '2026-02-01', issuedDate: '2026-01-15' },
  { id: 'INV-2026-002', customerName: 'Global Tech', amount: 1200, status: 'pending', dueDate: '2026-02-15', issuedDate: '2026-02-01' },
  { id: 'INV-2026-003', customerName: 'Stark Industries', amount: 99, status: 'overdue', dueDate: '2026-01-30', issuedDate: '2026-01-10' },
];

export const mockPayments: Payment[] = [
  { id: 'PAY-8801', invoiceId: 'INV-2026-001', customerName: 'Acme Corp', amount: 499, method: 'Credit Card', status: 'completed', date: '2026-01-28' },
  { id: 'PAY-8802', invoiceId: 'INV-2026-002', customerName: 'Global Tech', amount: 1200, method: 'ACH Transfer', status: 'completed', date: '2026-02-02' },
  { id: 'PAY-8803', invoiceId: 'INV-2026-003', customerName: 'Stark Industries', amount: 99, method: 'Credit Card', status: 'failed', date: '2026-01-31' },
];
export interface Product {
  id: string;
  name: string;
  category: 'Digital' | 'Physical' | 'Service';
  price: number;
  status: 'active' | 'archived';
}

export interface Plan {
  id: string;
  name: string;
  interval: 'monthly' | 'yearly';
  price: number;
  activeSubscribers: number;
  status: 'active' | 'draft';
}

// ... keep your existing mockCustomers, mockSubscriptions, mockInvoices, mockPayments ...

export const mockProducts: Product[] = [
  { id: 'PROD-01', name: 'Cloud Server Node (Standard)', category: 'Digital', price: 49, status: 'active' },
  { id: 'PROD-02', name: 'Dedicated Support Add-on', category: 'Service', price: 150, status: 'active' },
  { id: 'PROD-03', name: 'Enterprise Hardware Gateway', category: 'Physical', price: 850, status: 'archived' },
];

export const mockPlans: Plan[] = [
  { id: 'PLAN-101', name: 'Basic Tier Plan', interval: 'monthly', price: 99, activeSubscribers: 42, status: 'active' },
  { id: 'PLAN-102', name: 'Pro Tier Plan', interval: 'yearly', price: 1200, activeSubscribers: 128, status: 'active' },
  { id: 'PLAN-103', name: 'Enterprise SaaS Plan', interval: 'monthly', price: 499, activeSubscribers: 19, status: 'active' },
];
export interface Quotation {
  id: string;
  customerName: string;
  planName: string;
  amount: number;
  status: 'draft' | 'sent' | 'accepted' | 'declined';
  validUntil: string;
}

export interface Discount {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  redemptions: number;
  status: 'active' | 'expired';
}

// ... keep existing mock data exports ...

export const mockQuotations: Quotation[] = [
  { id: 'QUO-2026-01', customerName: 'Acme Corp', planName: 'Enterprise SaaS Plan', amount: 5988, status: 'accepted', validUntil: '2026-11-15' },
  { id: 'QUO-2026-02', customerName: 'Wayne Enterprises', planName: 'Pro Tier Plan', amount: 1200, status: 'sent', validUntil: '2026-11-20' },
  { id: 'QUO-2026-03', customerName: 'Cyberdyne Systems', planName: 'Basic Tier Plan', amount: 1188, status: 'draft', validUntil: '2026-12-01' },
];

export const mockDiscounts: Discount[] = [
  { id: 'DISC-01', code: 'BLACKFRIDAY20', type: 'percentage', value: 20, redemptions: 142, status: 'active' },
  { id: 'DISC-02', code: 'STARTUP100', type: 'fixed', value: 100, redemptions: 38, status: 'active' },
  { id: 'DISC-03', code: 'EARLYBIRD50', type: 'fixed', value: 50, redemptions: 95, status: 'expired' },
];
export interface Tax {
  id: string;
  name: string;
  rate: number;
  region: string;
  status: 'active' | 'inactive';
}

export interface ReportMetric {
  id: string;
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
}

export interface Reminder {
  id: string;
  customerName: string;
  type: 'Renewal' | 'Overdue Payment' | 'Trial Ending';
  scheduledDate: string;
  status: 'sent' | 'pending';
}

// ... keep all existing exports ...

export const mockTaxes: Tax[] = [
  { id: 'TAX-01', name: 'US Standard Sales Tax', rate: 7.5, region: 'United States', status: 'active' },
  { id: 'TAX-02', name: 'EU Digital VAT', rate: 20.0, region: 'European Union', status: 'active' },
  { id: 'TAX-03', name: 'UK Standard VAT', rate: 20.0, region: 'United Kingdom', status: 'active' },
];

export const mockReportMetrics: ReportMetric[] = [
  { id: 'REP-01', title: 'Monthly Recurring Revenue (MRR)', value: '$45,210', change: '+12.4%', trend: 'up' },
  { id: 'REP-02', title: 'Annual Recurring Revenue (ARR)', value: '$542,520', change: '+14.1%', trend: 'up' },
  { id: 'REP-03', title: 'Net Revenue Churn Rate', value: '1.8%', change: '-0.4%', trend: 'down' },
  { id: 'REP-04', title: 'Average Revenue Per User (ARPU)', value: '$245', change: '+5.2%', trend: 'up' },
];

export const mockReminders: Reminder[] = [
  { id: 'REM-101', customerName: 'Acme Corp', type: 'Renewal', scheduledDate: '2026-11-10', status: 'pending' },
  { id: 'REM-102', customerName: 'Stark Industries', type: 'Overdue Payment', scheduledDate: '2026-11-01', status: 'sent' },
  { id: 'REM-103', customerName: 'Global Tech', type: 'Trial Ending', scheduledDate: '2026-11-05', status: 'pending' },
];