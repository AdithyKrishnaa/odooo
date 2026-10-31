import React, { useState } from 'react';
import { mockTaxes, Tax } from '../../mocks/mockData';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Search, Percent } from 'lucide-react';

export const TaxesPage: React.FC = () => {
  const [taxes] = useState<Tax[]>(mockTaxes);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTaxes = taxes.filter(
    (t) =>
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.region.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Taxes & Regional Settings</h1>
        <p className="text-sm text-gray-500">Configure jurisdictional tax rates, regional VAT rules, and automated tax calculations.</p>
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search tax rule or region..."
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
                <th className="px-6 py-3.5">Tax ID</th>
                <th className="px-6 py-3.5">Rule Name</th>
                <th className="px-6 py-3.5">Jurisdiction / Region</th>
                <th className="px-6 py-3.5">Tax Rate</th>
                <th className="px-6 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-gray-700">
              {filteredTaxes.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-mono font-medium text-brand-600 flex items-center gap-2">
                    <Percent className="w-4 h-4 text-gray-400" />
                    {t.id}
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900">{t.name}</td>
                  <td className="px-6 py-4 text-gray-600">{t.region}</td>
                  <td className="px-6 py-4 font-bold text-gray-900">{t.rate}%</td>
                  <td className="px-6 py-4">
                    <StatusBadge
                      status={t.status}
                      type={t.status === 'active' ? 'success' : 'warning'}
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