import React, { useState } from 'react';
import { mockSubscriptions, Subscription } from '../../mocks/mockData';
import { Button } from '../../components/common/Button';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { Search, PauseCircle, PlayCircle, XCircle } from 'lucide-react';

export const SubscriptionsPage: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(mockSubscriptions);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSub, setSelectedSub] = useState<Subscription | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredSubs = subscriptions.filter(
    (sub) =>
      sub.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.planName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStatusChange = (id: string, newStatus: Subscription['status']) => {
    setSubscriptions((prev) =>
      prev.map((sub) => (sub.id === id ? { ...sub, status: newStatus } : sub))
    );
    setIsModalOpen(false);
  };

  const openDetails = (sub: Subscription) => {
    setSelectedSub(sub);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Subscription Agreements</h1>
          <p className="text-sm text-gray-500">Monitor recurring contracts, billing cycles, and status updates</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by ID, Customer, or Plan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 font-medium">
              <tr>
                <th className="px-6 py-3.5">Subscription ID</th>
                <th className="px-6 py-3.5">Customer</th>
                <th className="px-6 py-3.5">Plan Name</th>
                <th className="px-6 py-3.5">Billing Interval</th>
                <th className="px-6 py-3.5">MRR Amount</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-gray-700">
              {filteredSubs.map((sub) => (
                <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-mono font-medium text-brand-600">{sub.id}</td>
                  <td className="px-6 py-4 font-semibold text-gray-900">{sub.customerName}</td>
                  <td className="px-6 py-4 text-gray-600">{sub.planName}</td>
                  <td className="px-6 py-4 capitalize text-gray-500">{sub.billingInterval}</td>
                  <td className="px-6 py-4 font-semibold text-gray-900">${sub.amount}</td>
                  <td className="px-6 py-4">
                    <StatusBadge
                      status={sub.status}
                      type={
                        sub.status === 'active'
                          ? 'success'
                          : sub.status === 'trialing'
                          ? 'info'
                          : sub.status === 'paused'
                          ? 'warning'
                          : 'danger'
                      }
                    />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="secondary" onClick={() => openDetails(sub)}>
                   Manage
                 </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Subscription Action Modal */}
      {selectedSub && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Manage ${selectedSub.id}`}>
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm border border-gray-200">
              <div className="flex justify-between">
                <span className="text-gray-500">Customer:</span> 
                <span className="font-semibold">{selectedSub.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Plan:</span> 
                <span className="font-semibold">{selectedSub.planName} (${selectedSub.amount}/{selectedSub.billingInterval})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Current Status:</span> 
                <StatusBadge status={selectedSub.status} type={selectedSub.status === 'active' ? 'success' : 'warning'} />
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <p className="text-xs font-semibold uppercase text-gray-400">Lifecycle Actions</p>
              <div className="grid grid-cols-2 gap-2">
                {selectedSub.status === 'active' ? (
                  <Button variant="secondary" className="w-full" onClick={() => handleStatusChange(selectedSub.id, 'paused')}>
                    <PauseCircle className="w-4 h-4 mr-2 text-yellow-500" /> Pause Billing
                  </Button>
                ) : (
                  <Button variant="secondary" className="w-full" onClick={() => handleStatusChange(selectedSub.id, 'active')}>
                    <PlayCircle className="w-4 h-4 mr-2 text-green-500" /> Resume Subscription
                  </Button>
                )}

                <Button variant="danger" className="w-full" onClick={() => handleStatusChange(selectedSub.id, 'canceled')}>
                  <XCircle className="w-4 h-4 mr-2" /> Cancel Subscription
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};