"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { expenseService } from "@/services/expense.service";
import { useCategories } from "@/hooks/useCategories";
import type { ExpenseRequest } from "@/types/expense.types";

const KHR_RATE = 4000;

const PAYMENT_METHODS = [
  { value: "CASH",  label: "Cash",  icon: "💵" },
  { value: "KHQR",  label: "KHQR",  icon: "📱" },
  { value: "CARD",  label: "Card",  icon: "💳" },
  { value: "BANK",  label: "Bank",  icon: "🏦" },
  { value: "APP",   label: "App",   icon: "📲" },
  { value: "OTHER", label: "Other", icon: "💸" },
];

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-blue-600 text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-1.5 sm:mb-2">
        {label}
      </label>
      {children}
      {error && (
        <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
          <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}

// ── Shared preview card ───────────────────────────────────────────
export function PreviewCard({
  selectedCategory, numAmt, previewUSD, previewKHR, merchant, date, payMethod, currency, note,
}: {
  selectedCategory: { icon: string; name: string; color: string } | undefined;
  numAmt: number; previewUSD: number; previewKHR: number;
  merchant: string; date: string; payMethod: string; currency: string; note: string;
}) {
  return (
    <>
      <div className="bg-gradient-to-br from-blue-800 via-blue-700 to-blue-600 rounded-2xl p-5 shadow-xl shadow-blue-600/20 relative overflow-hidden">
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
              <p className="text-blue-200 text-xs font-semibold truncate">{selectedCategory?.name ?? "Select a category"}</p>
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

      <div className="hidden xl:block bg-white rounded-2xl border border-blue-100 p-5 shadow-sm">
        <p className="text-blue-800 text-sm font-bold mb-3">💡 Tips</p>
        <ul className="space-y-2">
          {[
            "Amounts are stored in the currency you select",
            "Add a merchant name for better tracking",
            "Use notes for any extra context",
          ].map((tip, i) => (
            <li key={i} className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-300 mt-1.5 shrink-0" />
              <p className="text-blue-400 text-xs leading-snug">{tip}</p>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

// ── Shared form fields ────────────────────────────────────────────
export function ExpenseFormFields({
  amount, setAmount, currency, setCurrency, date, setDate,
  categoryId, setCategoryId, merchant, setMerchant, note, setNote,
  payMethod, setPayMethod, errors, categories,
}: {
  amount: string; setAmount: (v: string) => void;
  currency: "USD" | "KHR"; setCurrency: (v: "USD" | "KHR") => void;
  date: string; setDate: (v: string) => void;
  categoryId: number | ""; setCategoryId: (v: number | "") => void;
  merchant: string; setMerchant: (v: string) => void;
  note: string; setNote: (v: string) => void;
  payMethod: string; setPayMethod: (v: string) => void;
  errors: Record<string, string>;
  categories: { id: number; name: string; icon: string; color: string }[];
}) {
  const numAmt     = Number(amount) || 0;
  const previewKHR = currency === "USD" ? numAmt * KHR_RATE : numAmt;
  const previewUSD = currency === "KHR" ? numAmt / KHR_RATE : numAmt;

  return (
    <>
      {/* Amount + currency */}
      <div className="bg-white rounded-2xl border border-blue-100 p-4 sm:p-6 shadow-sm space-y-4">
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          <div className="col-span-2">
            <Field label="Amount *" error={errors.amount}>
              <div className="relative">
                <span className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-blue-400 font-bold text-sm sm:text-base">
                  {currency === "KHR" ? "៛" : "$"}
                </span>
                <input type="number" min="0" step="0.01" value={amount}
                  onChange={e => setAmount(e.target.value)} placeholder="0.00" inputMode="decimal"
                  className={`w-full pl-8 sm:pl-9 pr-3 sm:pr-4 py-3 sm:py-3.5 rounded-xl border bg-blue-50/50 text-blue-800 font-bold text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.amount ? "border-red-300 bg-red-50/30" : "border-blue-100"}`}
                />
              </div>
            </Field>
          </div>
          <div>
            <Field label="Currency">
              <div className="flex bg-blue-50 border border-blue-100 rounded-xl p-1 h-[46px] sm:h-[52px]">
                {(["USD", "KHR"] as const).map(c => (
                  <button key={c} type="button" onClick={() => setCurrency(c)}
                    className={`flex-1 rounded-lg text-xs sm:text-sm font-bold transition-all ${currency === c ? "bg-blue-600 text-white shadow-md" : "text-blue-400 hover:text-blue-600"}`}>
                    {c}
                  </button>
                ))}
              </div>
            </Field>
          </div>
        </div>

        {numAmt > 0 && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-50 border border-blue-100">
            <svg className="w-3.5 h-3.5 text-blue-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            <span className="text-blue-500 text-xs">
              {currency === "USD" ? `≈ ៛${Math.round(previewKHR).toLocaleString()} KHR` : `≈ $${previewUSD.toFixed(2)} USD`}
            </span>
            <span className="text-blue-300 text-xs ml-auto hidden sm:inline">at ៛{KHR_RATE}/USD</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <Field label="Date *" error={errors.date}>
            <input type="date" value={date} onChange={e => setDate(e.target.value)}
              className={`w-full px-3 sm:px-4 py-3 sm:py-3.5 rounded-xl border bg-blue-50/50 text-blue-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.date ? "border-red-300" : "border-blue-100"}`}
            />
          </Field>
          <Field label="Merchant (optional)">
            <input type="text" value={merchant} onChange={e => setMerchant(e.target.value)}
              placeholder="e.g. Brown Coffee" maxLength={150}
              className="w-full px-3 sm:px-4 py-3 sm:py-3.5 rounded-xl border border-blue-100 bg-blue-50/50 text-blue-800 placeholder-blue-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </Field>
        </div>

        <Field label="Note (optional)">
          <textarea value={note} onChange={e => setNote(e.target.value)}
            placeholder="Any extra details…" rows={2} maxLength={500}
            className="w-full px-3 sm:px-4 py-3 sm:py-3.5 rounded-xl border border-blue-100 bg-blue-50/50 text-blue-800 placeholder-blue-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
          />
        </Field>
      </div>

      {/* Category */}
      <div className="bg-white rounded-2xl border border-blue-100 p-4 sm:p-6 shadow-sm">
        <Field label="Category *" error={errors.category}>
          <div className={`grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2 mt-2 ${errors.category ? "p-2 rounded-xl border border-red-200 bg-red-50/20" : ""}`}>
            {categories.map(c => (
              <button key={c.id} type="button" onClick={() => setCategoryId(c.id)}
                className={`flex items-center gap-2 px-2.5 sm:px-3 py-2.5 rounded-xl border text-left transition-all active:scale-95 ${categoryId === c.id ? "border-transparent shadow-md" : "bg-blue-50/50 border-blue-100 hover:border-blue-300 hover:bg-blue-50"}`}
                style={categoryId === c.id ? { backgroundColor: c.color + "18", borderColor: c.color + "60" } : {}}>
                <span className="text-base shrink-0">{c.icon}</span>
                <span className={`text-xs font-semibold truncate ${categoryId === c.id ? "text-blue-800" : "text-blue-600"}`}>{c.name}</span>
              </button>
            ))}
          </div>
        </Field>
      </div>

      {/* Payment method */}
      <div className="bg-white rounded-2xl border border-blue-100 p-4 sm:p-6 shadow-sm">
        <Field label="Payment Method">
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mt-2">
            {PAYMENT_METHODS.map(p => (
              <button key={p.value} type="button" onClick={() => setPayMethod(p.value)}
                className={`flex flex-col items-center gap-1 sm:gap-1.5 py-2.5 sm:py-3 rounded-xl border text-center transition-all active:scale-95 ${payMethod === p.value ? "bg-blue-600 border-blue-600 text-white shadow-md" : "bg-blue-50 border-blue-100 text-blue-500 hover:border-blue-300"}`}>
                <span className="text-lg sm:text-xl">{p.icon}</span>
                <span className="text-[10px] font-bold">{p.label}</span>
              </button>
            ))}
          </div>
        </Field>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  NEW EXPENSE PAGE  —  POST /api/expenses
// ═══════════════════════════════════════════════════════════════════
export default function NewExpensePage() {
  const router = useRouter();

  const [amount,     setAmount]     = useState("");
  const [currency,   setCurrency]   = useState<"USD" | "KHR">("USD");
  const [date,       setDate]       = useState(new Date().toISOString().split("T")[0]);
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [merchant,   setMerchant]   = useState("");
  const [note,       setNote]       = useState("");
  const [payMethod,  setPayMethod]  = useState("CASH");
  const [saving,     setSaving]     = useState(false);
  const [pageError,  setPageError]  = useState<string | null>(null);
  const [errors,     setErrors]     = useState<Record<string, string>>({});
  const [showPreview, setShowPreview] = useState(false);

  const { categories, loading: catsLoading } = useCategories();

  const validate = () => {
    const e: Record<string, string> = {};
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) e.amount = "Enter a valid amount greater than 0";
    if (!date)       e.date     = "Date is required";
    if (!categoryId) e.category = "Please select a category";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const payload: ExpenseRequest = {
        amount: parseFloat(amount), currency, date,
        categoryId: Number(categoryId),
        merchantName:  merchant.trim() || undefined,
        note:          note.trim()     || undefined,
        paymentMethod: payMethod,
      };
      await expenseService.create(payload);
      router.push("/dashboard/expenses");
    } catch (e: any) {
      setPageError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const selectedCategory = categories.find(c => c.id === categoryId);
  const numAmt     = Number(amount) || 0;
  const previewUSD = currency === "KHR" ? numAmt / KHR_RATE : numAmt;
  const previewKHR = currency === "USD" ? numAmt * KHR_RATE : numAmt;

  if (catsLoading) {
    return (
      <div className="w-full space-y-4 animate-pulse">
        <div className="h-10 bg-blue-100 rounded-xl w-48" />
        <div className="bg-white rounded-2xl border border-blue-100 p-6 space-y-4">
          {[...Array(5)].map((_, i) => <div key={i} className="h-12 bg-blue-50 rounded-xl" />)}
        </div>
      </div>
    );
  }

  const previewProps = { selectedCategory, numAmt, previewUSD, previewKHR, merchant, date, payMethod, currency, note };

  return (
    <>
      <style>{`
        @keyframes slideUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        @keyframes slideUpSheet { from { opacity:0; transform:translateY(100%); } to { opacity:1; transform:translateY(0); } }
      `}</style>

      {showPreview && (
        <div className="xl:hidden fixed inset-0 z-50 flex items-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowPreview(false)} />
          <div className="relative w-full bg-white rounded-t-3xl p-5 space-y-4"
            style={{ animation: "slideUpSheet 0.25s ease both", maxHeight: "85dvh", overflowY: "auto" }}>
            <div className="w-10 h-1 bg-blue-100 rounded-full mx-auto mb-1" />
            <PreviewCard {...previewProps} />
            <button onClick={() => setShowPreview(false)}
              className="w-full py-3.5 rounded-xl border-2 border-blue-100 text-blue-500 font-bold text-sm hover:bg-blue-50 transition-all">
              Close
            </button>
          </div>
        </div>
      )}

      <div className="w-full space-y-4 sm:space-y-6" style={{ animation: "slideUp 0.3s ease both" }}>

        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link href="/dashboard/expenses"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white border border-blue-100 flex items-center justify-center text-blue-500 hover:bg-blue-50 transition-colors shrink-0">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <p className="text-blue-400 text-[10px] sm:text-xs font-bold uppercase tracking-widest">New expense</p>
              <h1 className="text-blue-800 font-black text-xl sm:text-3xl font-['Sora',sans-serif] leading-tight">Add Expense</h1>
            </div>
          </div>
          <button onClick={() => setShowPreview(true)}
            className="xl:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-50 border border-blue-100 text-blue-500 text-xs font-bold hover:bg-blue-100 transition-colors shrink-0">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Preview
          </button>
        </div>

        {numAmt > 0 && (
          <div className="xl:hidden flex items-center gap-3 bg-blue-600 rounded-2xl px-4 py-3"
            style={{ animation: "slideUp 0.2s ease" }}>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-lg shrink-0"
              style={selectedCategory ? { backgroundColor: selectedCategory.color + "50" } : { backgroundColor: "rgba(255,255,255,0.2)" }}>
              {selectedCategory?.icon ?? "📦"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-black text-base leading-tight">${previewUSD.toFixed(2)}</p>
              <p className="text-blue-200 text-xs">៛{Math.round(previewKHR).toLocaleString()}</p>
            </div>
            <span className="text-blue-200 text-xs truncate max-w-[100px]">{selectedCategory?.name ?? "No category"}</span>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
          <div className="xl:col-span-2 space-y-4">
            <ExpenseFormFields
              amount={amount} setAmount={setAmount}
              currency={currency} setCurrency={setCurrency}
              date={date} setDate={setDate}
              categoryId={categoryId} setCategoryId={setCategoryId}
              merchant={merchant} setMerchant={setMerchant}
              note={note} setNote={setNote}
              payMethod={payMethod} setPayMethod={setPayMethod}
              errors={errors} categories={categories}
            />

            {pageError && (
              <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3.5 rounded-2xl">
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {pageError}
              </div>
            )}

            <div className="flex gap-3 pb-4 sm:pb-6">
              <Link href="/dashboard/expenses"
                className="flex-1 py-3.5 sm:py-4 rounded-xl border-2 border-blue-100 text-blue-500 font-bold text-sm text-center hover:bg-blue-50 transition-all">
                Cancel
              </Link>
              <button onClick={handleSubmit} disabled={saving}
                className="flex-1 py-3.5 sm:py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all disabled:opacity-50 shadow-sm hover:shadow-lg hover:shadow-blue-600/25 active:scale-[0.98]">
                {saving ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Adding…
                  </span>
                ) : "Add Expense"}
              </button>
            </div>
          </div>

          <div className="hidden xl:block xl:col-span-1">
            <div className="sticky top-6 space-y-4">
              <PreviewCard {...previewProps} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}