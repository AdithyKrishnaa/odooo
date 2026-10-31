import React from 'react';

interface StatusBadgeProps {
  status: string;
  type?: 'success' | 'warning' | 'danger' | 'info' | 'default';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type = 'default' }) => {
  const typeStyles = {
    success: 'bg-green-100 text-green-800 border-green-200',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    danger: 'bg-red-100 text-red-800 border-red-200',
    info: 'bg-blue-100 text-blue-800 border-blue-200',
    default: 'bg-gray-100 text-gray-800 border-gray-200',
  };

  return (
    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${typeStyles[type]}`}>
      {status.toUpperCase()}
    </span>
  );
};