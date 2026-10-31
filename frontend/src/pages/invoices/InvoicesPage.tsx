import React, { useState } from 'react';
import { mockInvoices, Invoice } from '../../mocks/mockData';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';
import { Search, FileText, Download } from 'lucide-react';

export const InvoicesPage: React.FC = () => {
  const [invoices] = useState<Invoice[]>(mockInvoices);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredInvoices = invoices.filter(
    (inv) =>
      inv.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
          <p className="text-sm text-gray-500">Track customer billing statements, due dates, and payment statuses</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by Invoice ID or Customer..."
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
                <th className="px-6 py-3.5">Invoice #</th>
                <th className="px-6 py-3.5">Customer</th>
                <th className="px-6 py-3.5">Issued Date</th>
                <th className="px-6 py-3.5">Due Date</th>
                <th className="px-6 py-3.5">Amount</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-gray-700">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-mono font-medium text-brand-600 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-400" />
                    {inv.id}
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900">{inv.customerName}</td>
                  <td className="px-6 py-4 text-gray-500">{inv.issuedDate}</td>
                  <td className="px-6 py-4 text-gray-500">{inv.dueDate}</td>
                  <td className="px-6 py-4 font-semibold text-gray-900">${inv.amount}</td>
                  <td className="px-6 py-4">
                    <StatusBadge
                      status={inv.status}
                      type={inv.status === 'paid' ? 'success' : inv.status === 'pending' ? 'warning' : 'danger'}
                    />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="secondary" onClick={() => alert(`Downloading PDF for ${inv.id}`)}>
                      <Download className="w-4 h-4 mr-1 inline" /> PDF
                    </Button>
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