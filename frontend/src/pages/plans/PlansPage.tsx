import React, { useState } from 'react';
import { mockPlans, Plan } from '../../mocks/mockData';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Search, Layers } from 'lucide-react';

export const PlansPage: React.FC = () => {
  const [plans] = useState<Plan[]>(mockPlans);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPlans = plans.filter((plan) =>
    plan.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Subscription Plans</h1>
        <p className="text-sm text-gray-500">Configure recurring billing intervals, tier pricing, and subscription packages.</p>
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search plans by name..."
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
                <th className="px-6 py-3.5">Plan ID</th>
                <th className="px-6 py-3.5">Plan Name</th>
                <th className="px-6 py-3.5">Billing Interval</th>
                <th className="px-6 py-3.5">Price</th>
                <th className="px-6 py-3.5">Active Subscribers</th>
                <th className="px-6 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-gray-700">
              {filteredPlans.map((plan) => (
                <tr key={plan.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-mono font-medium text-brand-600 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-gray-400" />
                    {plan.id}
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900">{plan.name}</td>
                  <td className="px-6 py-4 capitalize text-gray-600">{plan.interval}</td>
                  <td className="px-6 py-4 font-semibold text-gray-900">${plan.price}</td>
                  <td className="px-6 py-4 text-gray-700">{plan.activeSubscribers} users</td>
                  <td className="px-6 py-4">
                    <StatusBadge
                      status={plan.status}
                      type={plan.status === 'active' ? 'success' : 'warning'}
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