import React from 'react';
import { EmptyState } from '../components/common/EmptyState';

interface PlaceholderPageProps {
  title: string;
  description: string;
}

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title, description }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      </div>
      <EmptyState
        title={`${title} Module`}
        description={description}
      />
    </div>
  );
};