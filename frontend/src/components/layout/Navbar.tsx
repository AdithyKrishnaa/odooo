import React from 'react';
import { Bell, User } from 'lucide-react';

export const Navbar: React.FC = () => {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center">
        <span className="text-sm font-medium text-gray-500">Subscription Management System</span>
      </div>
      <div className="flex items-center space-x-4">
        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <div className="flex items-center space-x-3 border-l pl-4 border-gray-200">
          <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-semibold">
            <User className="w-4 h-4" />
          </div>
          <span className="text-sm font-medium text-gray-700">Admin User</span>
        </div>
      </div>
    </header>
  );
};