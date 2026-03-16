"use client";

import { BarChart3 } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="w-full space-y-4">

      {/* Header */}
      <div>
        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Insights</p>
        <h1 className="text-gray-800 font-black text-2xl sm:text-3xl font-['Sora',sans-serif] mt-0.5">Analytics</h1>
        <p className="text-gray-400 text-sm mt-1 hidden sm:block">Deep insights and spending trends</p>
      </div>

      {/* Coming soon card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-20 px-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-5">
          <BarChart3 size={30} className="text-blue-400" strokeWidth={1.5} />
        </div>
        <h2 className="text-gray-800 font-black text-xl font-['Sora',sans-serif] mb-2">Coming Soon</h2>
        <p className="text-gray-400 text-sm max-w-xs mx-auto leading-relaxed">
          Deep insights, spending trends, category breakdowns, and month-over-month comparisons will live here.
        </p>
      </div>

    </div>
  );
}