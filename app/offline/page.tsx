"use client";

import { useEffect, useState } from "react";
import { WifiOff, RefreshCw } from "lucide-react";

export default function OfflinePage() {
  const [retrying, setRetrying] = useState(false);

  const handleRetry = () => {
    setRetrying(true);
    setTimeout(() => window.location.reload(), 800);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="text-center max-w-sm">

        {/* Icon */}
        <div className="w-20 h-20 rounded-3xl bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto mb-6">
          <WifiOff size={36} strokeWidth={1.5} className="text-blue-400" />
        </div>

        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="text-gray-800 font-black text-xl font-['Sora',sans-serif]">
            Fin<span className="text-blue-600">Set</span>
          </span>
        </div>

        <h1 className="text-gray-800 font-black text-2xl font-['Sora',sans-serif] mb-3">
          You're offline
        </h1>
        <p className="text-gray-500 text-sm leading-relaxed mb-8">
          FinSet needs an internet connection to sync your expenses and budgets.
          Please check your connection and try again.
        </p>

        <button
          onClick={handleRetry}
          disabled={retrying}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3.5 rounded-2xl transition-all hover:shadow-lg hover:shadow-blue-600/25 active:scale-95 disabled:opacity-60">
          <RefreshCw size={16} strokeWidth={2} className={retrying ? "animate-spin" : ""} />
          {retrying ? "Checking connection…" : "Try again"}
        </button>

        <p className="text-gray-400 text-xs mt-6">
          Your data is safe and will sync when you're back online.
        </p>
      </div>
    </div>
  );
}