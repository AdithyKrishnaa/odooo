import React, { useState } from 'react';
import { mockReportMetrics, ReportMetric } from '../../mocks/mockData';
import { TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const [metrics] = useState<ReportMetric[]>(mockReportMetrics);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reports & Financial Analytics</h1>
        <p className="text-sm text-gray-500">Track recurring revenue health, ARR forecasts, and churn rate trajectory.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m) => (
          <div key={m.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{m.title}</p>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-gray-900">{m.value}</span>
              <span
                className={`inline-flex items-center text-xs font-semibold ${
                  m.trend === 'up' ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {m.trend === 'up' ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                {m.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm text-center py-16">
        <BarChart3 className="w-12 h-12 text-brand-500 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-gray-900">Revenue & Subscriber Growth Charts</h3>
        <p className="text-sm text-gray-500 max-w-md mx-auto mt-1">
          Historical cohort analytics engine is actively streaming live subscriber metrics into your workspace.
        </p>
      </div>
    </div>
  );
};