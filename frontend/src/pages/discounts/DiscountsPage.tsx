import React, { useState } from 'react';
import { mockDiscounts, Discount } from '../../mocks/mockData';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Search, Tag } from 'lucide-react';

export const DiscountsPage: React.FC = () => {
  const [discounts] = useState<Discount[]>(mockDiscounts);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDiscounts = discounts.filter((d) =>
    d.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Discounts & Coupons</h1>
        <p className="text-sm text-gray-500">Manage promotional coupon codes, percentage discounts, and fixed monetary rules.</p>
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search coupon code..."
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
                <th className="px-6 py-3.5">Discount ID</th>
                <th className="px-6 py-3.5">Promo Code</th>
                <th className="px-6 py-3.5">Discount Type</th>
                <th className="px-6 py-3.5">Value</th>
                <th className="px-6 py-3.5">Redemptions</th>
                <th className="px-6 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-gray-700">
              {filteredDiscounts.map((d) => (
                <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-mono font-medium text-brand-600 flex items-center gap-2">
                    <Tag className="w-4 h-4 text-gray-400" />
                    {d.id}
                  </td>
                  <td className="px-6 py-4 font-mono font-bold text-gray-900">{d.code}</td>
                  <td className="px-6 py-4 capitalize text-gray-600">{d.type}</td>
                  <td className="px-6 py-4 font-semibold text-gray-900">
                    {d.type === 'percentage' ? `${d.value}%` : `$${d.value}`}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{d.redemptions} used</td>
                  <td className="px-6 py-4">
                    <StatusBadge
                      status={d.status}
                      type={d.status === 'active' ? 'success' : 'warning'}
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