import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Layers,
  Users,
  FileText,
  Repeat,
  Receipt,
  CreditCard,
  Tag,
  Percent,
  BarChart3,
  Bell,
  Check,
  AlertCircle,
  User,
  Shield,
  LogOut,
} from 'lucide-react';
import { mockReminders } from '../../mocks/mockData';

export const DashboardLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Active state for Header dropdown drawers
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [reminders, setReminders] = useState(mockReminders);

  const unreadCount = reminders.filter((r) => r.status === 'pending').length;

  const markAllAsRead = () => {
    setReminders((prev) => prev.map((r) => ({ ...r, status: 'sent' as const })));
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Products', path: '/products', icon: Package },
    { name: 'Plans', path: '/plans', icon: Layers },
    { name: 'Customers', path: '/customers', icon: Users },
    { name: 'Quotations', path: '/quotations', icon: FileText },
    { name: 'Subscriptions', path: '/subscriptions', icon: Repeat },
    { name: 'Invoices', path: '/invoices', icon: Receipt },
    { name: 'Payments', path: '/payments', icon: CreditCard },
    { name: 'Discounts', path: '/discounts', icon: Tag },
    { name: 'Taxes', path: '/taxes', icon: Percent },
    { name: 'Reports', path: '/reports', icon: BarChart3 },
    { name: 'Reminders', path: '/reminders', icon: Bell },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-slate-800 font-bold text-white text-lg tracking-wide">
          SubManager Pro
        </div>
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-600 text-white font-semibold'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header Header */}
        <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between relative z-50">
          <div className="text-sm font-medium text-gray-500">
            Workspace / <span className="text-gray-900 font-semibold uppercase">{location.pathname.replace('/', '')}</span>
          </div>

          <div className="flex items-center gap-4 relative">
            {/* Notification Bell Icon & Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowNotifications((prev) => !prev);
                  setShowProfileMenu(false);
                }}
                className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors focus:outline-none"
                aria-label="Toggle Notifications Menu"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white" />
                )}
              </button>

              {/* Dropdown Container */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden">
                  <div className="p-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                    <span className="font-semibold text-xs uppercase tracking-wider text-gray-700">Notifications</span>
                    {unreadCount > 0 && (
                      <button
                        type="button"
                        onClick={markAllAsRead}
                        className="text-xs text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" /> Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-64 overflow-y-auto divide-y divide-gray-100">
                    {reminders.length === 0 ? (
                      <div className="p-4 text-center text-xs text-gray-500">No active notifications</div>
                    ) : (
                      reminders.map((r) => (
                        <div key={r.id} className="p-3 hover:bg-gray-50 transition-colors text-xs">
                          <div className="flex items-start gap-2">
                            <AlertCircle
                              className={`w-4 h-4 mt-0.5 shrink-0 ${
                                r.status === 'pending' ? 'text-amber-500' : 'text-emerald-500'
                              }`}
                            />
                            <div>
                              <p className="font-semibold text-gray-900">{r.customerName}</p>
                              <p className="text-gray-500">{r.type} • {r.scheduledDate}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Admin Avatar & Account Profile Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowProfileMenu((prev) => !prev);
                  setShowNotifications(false);
                }}
                className="w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-sm hover:ring-4 hover:ring-brand-100 transition-all focus:outline-none"
              >
                A
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden divide-y divide-gray-100">
                  <div className="p-3 bg-gray-50">
                    <p className="text-sm font-semibold text-gray-900">Admin User</p>
                    <p className="text-xs text-gray-500">admin@subscription.com</p>
                  </div>

                  <div className="py-1 text-xs text-gray-700">
                    <button
                      type="button"
                      onClick={() => setShowProfileMenu(false)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <User className="w-4 h-4 text-gray-400" /> Account Profile
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowProfileMenu(false)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Shield className="w-4 h-4 text-gray-400" /> Security & Roles
                    </button>
                  </div>

                  <div className="py-1">
                    <button
                      type="button"
                      onClick={() => navigate('/login')}
                      className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content Outlet */}
        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};