import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Layers,
  Users,
  FileText,
  CreditCard,
  DollarSign,
  BarChart3,
  Percent,
  Receipt,
  Bell,
  RefreshCw,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Products', href: '/products', icon: Package },
  { name: 'Plans', href: '/plans', icon: Layers },
  { name: 'Customers', href: '/customers', icon: Users },
  { name: 'Quotations', href: '/quotations', icon: FileText },
  { name: 'Subscriptions', href: '/subscriptions', icon: RefreshCw },
  { name: 'Invoices', href: '/invoices', icon: Receipt },
  { name: 'Payments', href: '/payments', icon: CreditCard },
  { name: 'Discounts', href: '/discounts', icon: Percent },
  { name: 'Taxes', href: '/taxes', icon: DollarSign },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
  { name: 'Reminders', href: '/reminders', icon: Bell },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0">
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-brand-600">SubManage</h1>
      </div>
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-50 text-brand-600'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`
              }
            >
              <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
              {item.name}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};