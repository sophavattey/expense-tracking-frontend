"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { expenseService } from "@/services/expense.service";
import { useCategories } from "@/hooks/useCategories";
import type { ExpenseRequest } from "@/types/expense.types";
import { ExpenseFormFields } from "../../_components/ExpenseFormFields";
import { PreviewCard } from "../../_components/PreviewCard";

const KHR_RATE = 4000;

export default function EditExpensePage({ params }: { params: Promise<{ id: string }> }) {
  const router    = useRouter();
  const { id }    = use(params);
  const expenseId = id;

  const [amount,      setAmount]      = useState("");
  const [currency,    setCurrency]    = useState<"USD" | "KHR">("USD");
  const [date,        setDate]        = useState(new Date().toISOString().split("T")[0]);
  const [categoryId,  setCategoryId]  = useState<string | "">("");
  const [merchant,    setMerchant]    = useState("");
  const [note,        setNote]        = useState("");
  const [payMethod,   setPayMethod]   = useState("CASH");
  const [saving,      setSaving]      = useState(false);
  const [pageError,   setPageError]   = useState<string | null>(null);
  const [errors,      setErrors]      = useState<Record<string, string>>({});
  const [loadingExp,  setLoadingExp]  = useState(true);
  const [showPreview, setShowPreview] = useState(false);

  const { categories, loading: catsLoading } = useCategories();

  useEffect(() => {
    expenseService.getById(expenseId)
      .then(exp => {
        setAmount(String(exp.amount));
        setCurrency(exp.currency);
        setDate(exp.date);
        setCategoryId(exp.category.id);
        setMerchant(exp.merchantName ?? "");
        setNote(exp.note ?? "");
        setPayMethod(exp.paymentMethod);
      })
      .catch(e => setPageError(e.message ?? "Expense not found"))
      .finally(() => setLoadingExp(false));
  }, [expenseId]);

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
        amount: parseFloat(amount), currency, date, categoryId,
        merchantName:  merchant.trim() || undefined,
        note:          note.trim()     || undefined,
        paymentMethod: payMethod,
      };
      await expenseService.update(expenseId, payload);
      router.push("/dashboard/expenses");
    } catch (e: any) {
      setPageError(e.message ?? "Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const selectedCategory = categories.find(c => c.id === categoryId);
  const numAmt     = Number(amount) || 0;
  const previewUSD = currency === "KHR" ? numAmt / KHR_RATE : numAmt;
  const previewKHR = currency === "USD" ? numAmt * KHR_RATE : numAmt;
  const previewProps = { selectedCategory, numAmt, previewUSD, previewKHR, merchant, date, payMethod, currency, note };

  if (catsLoading || loadingExp) {
    return (
      <div className="w-full space-y-4 animate-pulse">
        <div className="h-10 bg-gray-100 rounded-xl w-48" />
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          {[...Array(5)].map((_, i) => <div key={i} className="h-12 bg-gray-100 rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes slideUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        @keyframes slideUpSheet { from { opacity:0; transform:translateY(100%); } to { opacity:1; transform:translateY(0); } }
      `}</style>

      {/* Mobile preview sheet */}
      {showPreview && (
        <div className="xl:hidden fixed inset-0 z-50 flex items-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowPreview(false)} />
          <div className="relative w-full bg-white rounded-t-3xl p-5 space-y-4"
            style={{ animation: "slideUpSheet 0.25s ease both", maxHeight: "85dvh", overflowY: "auto" }}>
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-1" />
            <PreviewCard {...previewProps} />
            <button onClick={() => setShowPreview(false)}
              className="w-full py-3.5 rounded-xl border-2 border-gray-200 text-gray-500 font-bold text-sm hover:bg-gray-50 transition-all">
              Close
            </button>
          </div>
        </div>
      )}

      <div className="w-full space-y-4 sm:space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link href="/dashboard/expenses"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors shrink-0">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <p className="text-gray-400 text-[10px] sm:text-xs font-bold uppercase tracking-widest">Editing expense</p>
              <h1 className="text-gray-800 font-black text-xl sm:text-3xl font-['Sora',sans-serif] leading-tight">Edit Expense</h1>
            </div>
          </div>
          <button onClick={() => setShowPreview(true)}
            className="xl:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-100 border border-gray-200 text-gray-500 text-xs font-bold hover:bg-gray-200 transition-colors shrink-0">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Preview
          </button>
        </div>

        {/* Mini preview bar — mobile */}
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
                className="flex-1 py-3.5 sm:py-4 rounded-xl border-2 border-gray-200 text-gray-500 font-bold text-sm text-center hover:bg-gray-50 transition-all">
                Cancel
              </Link>
              <button onClick={handleSubmit} disabled={saving}
                className="flex-1 py-3.5 sm:py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm
                  transition-all disabled:opacity-50 shadow-sm hover:shadow-lg hover:shadow-blue-600/25 active:scale-[0.98]">
                {saving ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>Saving…
                  </span>
                ) : "Save Changes"}
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