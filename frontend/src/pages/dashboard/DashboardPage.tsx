import React from 'react';
import { mockSubscriptions, mockInvoices, Invoice } from '../../mocks/mockData';
import { StatusBadge } from '../../components/common/StatusBadge';
import { TrendingUp, Users, CreditCard, AlertCircle } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const totalMRR = mockSubscriptions
    .filter((s) => s.status === 'active')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const activeSubscriptions = mockSubscriptions.filter((s) => s.status === 'active').length;
  const pendingInvoices = mockInvoices.filter((inv: Invoice) => inv.status === 'pending').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Executive Dashboard</h1>
        <p className="text-sm text-gray-500">Overview of recurring revenue, active contracts, and recent billing transactions.</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-brand-50 rounded-lg text-brand-600">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase">Monthly Recurring Revenue</p>
            <p className="text-2xl font-bold text-gray-900">${totalMRR}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-green-50 rounded-lg text-green-600">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase">Active Subscriptions</p>
            <p className="text-2xl font-bold text-gray-900">{activeSubscriptions}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-yellow-50 rounded-lg text-yellow-600">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase">Pending Invoices</p>
            <p className="text-2xl font-bold text-gray-900">{pendingInvoices}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-purple-50 rounded-lg text-purple-600">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase">Average Plan Value</p>
            <p className="text-2xl font-bold text-gray-900">$599</p>
          </div>
        </div>
      </div>

      {/* Recent Invoices */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">Recent Transactions & Invoices</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 font-medium">
              <tr>
                <th className="px-6 py-3">Invoice Number</th>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Due Date</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-gray-700">
              {mockInvoices.map((inv: Invoice) => (
                <tr key={inv.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono text-brand-600">{inv.id}</td>
                  <td className="px-6 py-4 font-semibold text-gray-900">{inv.customerName}</td>
                  <td className="px-6 py-4">${inv.amount}</td>
                  <td className="px-6 py-4 text-gray-500">{inv.dueDate}</td>
                  <td className="px-6 py-4">
                    <StatusBadge
                      status={inv.status}
                      type={inv.status === 'paid' ? 'success' : inv.status === 'pending' ? 'warning' : 'danger'}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};