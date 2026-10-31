import React, { useState } from 'react';
import { mockPayments, Payment } from '../../mocks/mockData';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Search, CreditCard } from 'lucide-react';

export const PaymentsPage: React.FC = () => {
  const [payments] = useState<Payment[]>(mockPayments);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPayments = payments.filter(
    (pay) =>
      pay.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pay.invoiceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pay.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Payments & Transactions</h1>
        <p className="text-sm text-gray-500">View real-time payment gateway logs, processor statuses, and payment methods</p>
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by Payment ID, Invoice, or Customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 font-medium">
              <tr>
                <th className="px-6 py-3.5">Transaction ID</th>
                <th className="px-6 py-3.5">Invoice #</th>
                <th className="px-6 py-3.5">Customer</th>
                <th className="px-6 py-3.5">Method</th>
                <th className="px-6 py-3.5">Date</th>
                <th className="px-6 py-3.5">Amount</th>
                <th className="px-6 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-gray-700">
              {filteredPayments.map((pay) => (
                <tr key={pay.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-mono font-medium text-brand-600 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-gray-400" />
                    {pay.id}
                  </td>
                  <td className="px-6 py-4 font-mono text-gray-600">{pay.invoiceId}</td>
                  <td className="px-6 py-4 font-semibold text-gray-900">{pay.customerName}</td>
                  <td className="px-6 py-4 text-gray-600">{pay.method}</td>
                  <td className="px-6 py-4 text-gray-500">{pay.date}</td>
                  <td className="px-6 py-4 font-semibold text-gray-900">${pay.amount}</td>
                  <td className="px-6 py-4">
                    <StatusBadge
                      status={pay.status}
                      type={pay.status === 'completed' ? 'success' : pay.status === 'refunded' ? 'warning' : 'danger'}
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