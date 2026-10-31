import React, { useState } from 'react';
import { mockCustomers, Customer } from '../../mocks/mockData';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Plus, Search, Mail, Building, Calendar } from 'lucide-react';

export const CustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    const newCust: Customer = {
      id: `CUST-00${customers.length + 1}`,
      name,
      email,
      company,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setCustomers([newCust, ...customers]);
    setName('');
    setEmail('');
    setCompany('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customer Directory</h1>
          <p className="text-sm text-gray-500">Manage customer profiles and subscription accounts</p>
        </div>
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Customer
        </Button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm"
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 font-medium">
              <tr>
                <th className="px-6 py-3.5">Customer ID</th>
                <th className="px-6 py-3.5">Name</th>
                <th className="px-6 py-3.5">Company</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Created Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-gray-700">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-mono font-medium text-brand-600">{cust.id}</td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-semibold text-gray-900">{cust.name}</div>
                        <div className="text-xs text-gray-500 flex items-center mt-0.5">
                          <Mail className="w-3 h-3 mr-1" />
                          {cust.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <Building className="w-4 h-4 mr-1.5 text-gray-400" />
                        {cust.company}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={cust.status} type={cust.status === 'active' ? 'success' : 'danger'} />
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1.5 text-gray-400" />
                        {cust.createdAt}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No matching customers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Customer Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Customer">
        <form onSubmit={handleCreateCustomer} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="e.g. Sarah Connor"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            label="Email Address"
            type="email"
            placeholder="e.g. sarah@cyberdyne.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Company Name"
            placeholder="e.g. Cyberdyne Systems"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            required
          />
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="secondary" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Customer
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};