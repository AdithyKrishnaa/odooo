import React from 'react';
import { AlertCircle } from 'lucide-react';

export const ErrorMessage: React.FC<{ message: string }> = ({ message }) => {
  return (
    <div className="flex items-center p-4 mb-4 text-red-800 border border-red-200 rounded-xl bg-red-50">
      <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
};