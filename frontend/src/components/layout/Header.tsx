import React, { useState } from 'react';
import { Bell, Check, AlertCircle } from 'lucide-react';
import { mockReminders } from '../../mocks/mockData';

export const Header: React.FC = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(mockReminders);

  // Count unread / pending alerts
  const unreadCount = notifications.filter((n) => n.status === 'pending').length;

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, status: 'sent' as const }))
    );
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between relative">
      {/* Search / Title on Left */}
      <div className="text-lg font-semibold text-gray-800">
        Subscription Management System
      </div>

      {/* Right Controls: Notifications & Profile */}
      <div className="flex items-center gap-4 relative">
        {/* Bell Button */}
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors focus:outline-none"
          aria-label="View notifications"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white" />
          )}
        </button>

        {/* Notifications Dropdown Drawer */}
        {showNotifications && (
          <div className="absolute right-0 top-12 w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
            <div className="p-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
              <span className="font-semibold text-sm text-gray-900">Notifications</span>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1"
                >
                  <Check className="w-3 h-3" /> Mark all read
                </button>
              )}
            </div>

            <div className="max-h-64 overflow-y-auto divide-y divide-gray-100">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-xs text-gray-500">No notifications</div>
              ) : (
                notifications.map((n) => (
                  <div key={n.id} className="p-3 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start gap-2">
                      <AlertCircle className={`w-4 h-4 mt-0.5 ${n.status === 'pending' ? 'text-amber-500' : 'text-gray-400'}`} />
                      <div>
                        <p className="text-xs font-semibold text-gray-900">{n.customerName}</p>
                        <p className="text-xs text-gray-500">{n.type} • {n.scheduledDate}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* User Profile Avatar */}
        <div className="w-8 h-8 rounded-full bg-brand-500 text-white flex items-center justify-center font-bold text-sm">
          A
        </div>
      </div>
    </header>
  );
};