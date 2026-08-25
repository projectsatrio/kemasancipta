'use client';

import React from 'react';
import BaseLayout from '@/components/base-layout';

export default function DashboardPage() {
  return (
    <BaseLayout>
      <h1 className="text-3xl font-bold mb-4">Enterprise Resource Planning</h1>
      <p className="text-slate-400">Selamat datang di SIM Pusat Operasional Perusahaan.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="p-6 rounded-xl bg-slate-900 border border-slate-800">
          <h3 className="text-lg font-bold mb-2">Accounting Status</h3>
          <p className="text-2xl font-bold text-emerald-400">Active</p>
        </div>
        <div className="p-6 rounded-xl bg-slate-900 border border-slate-800">
          <h3 className="text-lg font-bold mb-2">Marketing Campaign</h3>
          <p className="text-2xl font-bold text-indigo-400">12 Running</p>
        </div>
        <div className="p-6 rounded-xl bg-slate-900 border border-slate-800">
          <h3 className="text-lg font-bold mb-2">System Health</h3>
          <p className="text-2xl font-bold text-blue-400">99.9%</p>
        </div>
      </div>
    </BaseLayout>
  );
}
