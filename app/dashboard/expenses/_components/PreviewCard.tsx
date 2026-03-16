"use client";

import { Lightbulb } from "lucide-react";

interface Category { icon: string; name: string; color: string }

export function PreviewCard({
  selectedCategory, numAmt, previewUSD, previewKHR,
  merchant, date, payMethod, currency, note,
}: {
  selectedCategory: Category | undefined;
  numAmt: number; previewUSD: number; previewKHR: number;
  merchant: string; date: string; payMethod: string; currency: string; note: string;
}) {
  return (
    <>
      <div className="bg-linear-to-br from-blue-800 via-blue-700 to-blue-600 rounded-2xl p-5 shadow-xl shadow-blue-600/20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "linear-gradient(white 1px,transparent 1px),linear-gradient(90deg,white 1px,transparent 1px)", backgroundSize: "24px 24px" }} />
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl" />
        <div className="relative">
          <p className="text-blue-300 text-[10px] font-bold uppercase tracking-widest mb-4">Preview</p>
          <div className="flex items-start gap-3 mb-4">
            <div className="rounded-2xl flex items-center justify-center text-2xl shrink-0"
              style={selectedCategory
                ? { backgroundColor: selectedCategory.color + "40", minWidth: "48px", height: "48px" }
                : { backgroundColor: "rgba(255,255,255,0.15)", minWidth: "48px", height: "48px" }}>
              {selectedCategory?.icon ?? "📦"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-blue-200 text-xs font-semibold truncate">
                {selectedCategory?.name ?? "Select a category"}
              </p>
              <p className="text-white font-black text-2xl font-['Sora',sans-serif] leading-tight">
                {numAmt > 0 ? `$${previewUSD.toFixed(2)}` : "$0.00"}
              </p>
              <p className="text-blue-200 text-sm font-semibold leading-tight">
                {numAmt > 0 ? `៛${Math.round(previewKHR).toLocaleString()}` : "៛0"}
              </p>
            </div>
          </div>
          <div className="space-y-2 border-t border-white/10 pt-3">
            {[["Merchant", merchant || "—"], ["Date", date || "—"]].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between">
                <span className="text-blue-300 text-xs">{k}</span>
                <span className="text-white text-xs font-semibold truncate ml-3 max-w-[140px]">{v}</span>
              </div>
            ))}
            <div className="flex items-center justify-between">
              <span className="text-blue-300 text-xs">Payment</span>
              <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-lg">{payMethod}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-blue-300 text-xs">Currency</span>
              <span className="bg-white/10 text-blue-200 text-[10px] font-bold px-2 py-0.5 rounded-lg">{currency}</span>
            </div>
            {note && (
              <div className="flex items-start justify-between gap-2 pt-0.5">
                <span className="text-blue-300 text-xs shrink-0">Note</span>
                <span className="text-white text-xs font-semibold text-right line-clamp-2">{note}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tips — desktop only */}
      <div className="hidden xl:block bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb size={15} strokeWidth={2} className="text-amber-400" />
          <p className="text-gray-700 text-sm font-bold">Tips</p>
        </div>
        <ul className="space-y-2">
          {[
            "Amounts are stored in the currency you select",
            "Add a merchant name for better tracking",
            "Use notes for any extra context",
          ].map((tip, i) => (
            <li key={i} className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-gray-300 mt-1.5 shrink-0" />
              <p className="text-gray-400 text-xs leading-snug">{tip}</p>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}