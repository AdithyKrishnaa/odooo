import React, { useState } from 'react';
import { mockQuotations, Quotation } from '../../mocks/mockData';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Search, FileSpreadsheet } from 'lucide-react';

export const QuotationsPage: React.FC = () => {
  const [quotations] = useState<Quotation[]>(mockQuotations);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredQuotations = quotations.filter(
    (q) =>
      q.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Quotations & Proposals</h1>
        <p className="text-sm text-gray-500">Create, send, and convert pricing proposals into active subscription contracts.</p>
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search quotes by ID or Customer..."
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
                <th className="px-6 py-3.5">Quote #</th>
                <th className="px-6 py-3.5">Customer</th>
                <th className="px-6 py-3.5">Proposed Plan</th>
                <th className="px-6 py-3.5">Total Value</th>
                <th className="px-6 py-3.5">Valid Until</th>
                <th className="px-6 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-gray-700">
              {filteredQuotations.map((q) => (
                <tr key={q.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-mono font-medium text-brand-600 flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-gray-400" />
                    {q.id}
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900">{q.customerName}</td>
                  <td className="px-6 py-4 text-gray-600">{q.planName}</td>
                  <td className="px-6 py-4 font-semibold text-gray-900">${q.amount}</td>
                  <td className="px-6 py-4 text-gray-500">{q.validUntil}</td>
                  <td className="px-6 py-4">
                    <StatusBadge
                      status={q.status}
                      type={q.status === 'accepted' ? 'success' : q.status === 'sent' ? 'warning' : 'danger'}
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