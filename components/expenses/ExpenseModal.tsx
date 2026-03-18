"use client";

import { useState, useEffect } from "react";
import { X, Users, Banknote, Smartphone, CreditCard, Wallet, MoreHorizontal } from "lucide-react";
import { expenseService } from "@/services/expense.service";
import type { ExpenseRequest } from "@/types/expense.types";
import { useGroup } from "@/contexts/GroupContext";

/* ─── Constants ──────────────────────────────────────────────────── */
const KHR_RATE = 4000;

const PAYMENT_METHODS = [
  { value: "CASH",    label: "Cash",     Icon: Banknote      },
  { value: "BANK",    label: "Bank",     Icon: Smartphone    },
  { value: "CARD",    label: "Card",     Icon: CreditCard    },
  { value: "EWALLET", label: "e-Wallet", Icon: Wallet        },
  { value: "OTHER",   label: "Other",    Icon: MoreHorizontal },
];

/* ─── Types ──────────────────────────────────────────────────────── */
interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface ExpenseModalProps {
  /** null = create mode, string id = edit mode */
  expenseId: string | null;
  categories: Category[];
  onClose: () => void;
  onSaved: () => void;
  /** Override group context — useful when opening from a specific group context */
  groupId?: string;
  groupName?: string;
}

/* ═══════════════════════════════════════════════════════════════════
   EXPENSE MODAL
═══════════════════════════════════════════════════════════════════ */
export function ExpenseModal({
  expenseId, categories, onClose, onSaved, groupId: groupIdProp, groupName: groupNameProp,
}: ExpenseModalProps) {
  const isEdit = !!expenseId;

  const { isGroup, activeContext } = useGroup();

  // Resolve group context — prop takes priority over context
  const groupId   = groupIdProp ?? (isGroup && activeContext.type === "group" ? activeContext.groupId   : undefined);
  const groupName = groupNameProp ?? (isGroup && activeContext.type === "group" ? activeContext.groupName : undefined);
  const inGroup   = !!groupId;

  /* ─── Form state ── */
  const [amount,     setAmount]     = useState("");
  const [currency,   setCurrency]   = useState<"USD" | "KHR">("USD");
  const [date,       setDate]       = useState(new Date().toISOString().split("T")[0]);
  const [categoryId, setCategoryId] = useState<string | "">("");
  const [merchant,   setMerchant]   = useState("");
  const [note,       setNote]       = useState("");
  const [payMethod,  setPayMethod]  = useState("CASH");

  /* ─── UI state ── */
  const [saving,     setSaving]     = useState(false);
  const [loadingExp, setLoadingExp] = useState(isEdit);
  const [errors,     setErrors]     = useState<Record<string, string>>({});
  const [saveError,  setSaveError]  = useState<string | null>(null);

  /* ─── Load existing expense in edit mode ── */
  useEffect(() => {
    if (!expenseId) return;
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
      .catch(e => setSaveError(e.message ?? "Failed to load expense"))
      .finally(() => setLoadingExp(false));
  }, [expenseId]);

  /* ─── Derived preview values ── */
  const numAmt     = Number(amount) || 0;
  const previewUSD = currency === "KHR" ? numAmt / KHR_RATE : numAmt;
  const previewKHR = currency === "USD" ? numAmt * KHR_RATE : numAmt;
  const selectedCat = categories.find(c => c.id === categoryId);

  /* ─── Validation ── */
  const validate = () => {
    const e: Record<string, string> = {};
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0)
      e.amount = "Enter a valid amount greater than 0";
    if (!date)       e.date     = "Date is required";
    if (!categoryId) e.category = "Please select a category";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ─── Save ── */
  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    setSaveError(null);
    try {
      const payload: ExpenseRequest = {
        amount: parseFloat(amount),
        currency,
        date,
        categoryId,
        merchantName:  merchant.trim()  || undefined,
        note:          note.trim()      || undefined,
        paymentMethod: payMethod,
      };
      if (isEdit) {
        await expenseService.update(expenseId!, payload);
      } else if (groupId) {
        await expenseService.createForGroup(groupId, payload);
      } else {
        await expenseService.create(payload);
      }
      onSaved();
      onClose();
    } catch (e: any) {
      setSaveError(e.message ?? "Failed to save expense");
    } finally {
      setSaving(false);
    }
  };

  /* ─── Close on Escape ── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div
        className="relative bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full sm:max-w-2xl overflow-hidden"
        style={{ animation: "expenseModalIn 0.25s ease both", maxHeight: "95dvh", overflowY: "auto" }}>

        <style>{`
          @keyframes expenseModalIn {
            from { opacity: 0; transform: translateY(20px); }
            to   { opacity: 1; transform: translateY(0);    }
          }
        `}</style>

        {/* Drag handle — mobile */}
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mt-4 mb-1 sm:hidden" />

        {/* ── Sticky header ── */}
        <div className="sticky top-0 bg-white z-10 px-5 pt-4 pb-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-gray-800 font-black text-lg font-['Sora',sans-serif]">
              {isEdit ? "Edit Expense" : "Add Expense"}
            </h2>
            <p className="text-gray-400 text-xs mt-0.5">
              {isEdit
                ? "Update the details below"
                : inGroup
                ? `Adding to ${groupName}`
                : "Track a new expense"}
            </p>
          </div>
          <button onClick={onClose}
            className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-all shrink-0">
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>

        {/* ── Body ── */}
        {loadingExp ? (
          <div className="p-6 space-y-4 animate-pulse">
            {[...Array(4)].map((_, i) => <div key={i} className="h-12 bg-gray-100 rounded-xl" />)}
          </div>
        ) : (
          <div className="p-5 space-y-5">

            {/* Group banner */}
            {inGroup && !isEdit && (
              <div className="flex items-center gap-3 bg-indigo-50 border border-indigo-100 text-indigo-600 text-sm px-4 py-3 rounded-2xl">
                <Users size={15} strokeWidth={2} className="shrink-0 text-indigo-400" />
                <p>Visible to all members of <strong>{groupName}</strong></p>
              </div>
            )}

            {/* Live preview bar */}
            {numAmt > 0 && (
              <div className="flex items-center gap-3 bg-blue-600 rounded-2xl px-4 py-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0"
                  style={selectedCat
                    ? { backgroundColor: selectedCat.color + "50" }
                    : { backgroundColor: "rgba(255,255,255,0.2)" }}>
                  {selectedCat?.icon ?? "📦"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-black text-base leading-tight">${previewUSD.toFixed(2)}</p>
                  <p className="text-blue-200 text-xs">៛{Math.round(previewKHR).toLocaleString()}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-white text-xs font-semibold truncate max-w-[120px]">
                    {selectedCat?.name ?? "No category"}
                  </p>
                  <p className="text-blue-200 text-xs">{date || "No date"}</p>
                </div>
              </div>
            )}

            {/* Amount + Currency */}
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className="block text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1.5">
                  Amount *
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
                    {currency === "KHR" ? "៛" : "$"}
                  </span>
                  <input
                    type="text" inputMode="decimal" value={amount}
                    onChange={e => setAmount(e.target.value)}
                    placeholder="0.00"
                    className={`w-full pl-9 pr-4 py-3.5 rounded-xl border bg-gray-50 text-gray-800 font-bold
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all
                      ${errors.amount ? "border-red-300 bg-red-50/30" : "border-gray-200"}`}
                  />
                </div>
                {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
              </div>
              <div>
                <label className="block text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1.5">
                  Currency
                </label>
                <div className="flex bg-gray-100 border border-gray-200 rounded-xl p-1 h-[52px]">
                  {(["USD", "KHR"] as const).map(c => (
                    <button key={c} type="button" onClick={() => setCurrency(c)}
                      className={`flex-1 rounded-lg text-xs font-bold transition-all
                        ${currency === c ? "bg-blue-600 text-white shadow-md" : "text-gray-500 hover:text-gray-700"}`}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Conversion hint */}
            {numAmt > 0 && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 -mt-2">
                <span className="text-gray-500 text-xs">
                  {currency === "USD"
                    ? `≈ ៛${Math.round(previewKHR).toLocaleString()} KHR`
                    : `≈ $${previewUSD.toFixed(2)} USD`}
                </span>
                <span className="text-gray-300 text-xs ml-auto">at ៛{KHR_RATE}/USD</span>
              </div>
            )}

            {/* Date + Merchant */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1.5">
                  Date *
                </label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)}
                  className={`w-full px-4 py-3.5 rounded-xl border bg-gray-50 text-gray-800 text-sm
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all
                    ${errors.date ? "border-red-300" : "border-gray-200"}`} />
                {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
              </div>
              <div>
                <label className="block text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1.5">
                  Merchant
                </label>
                <input type="text" value={merchant} onChange={e => setMerchant(e.target.value)}
                  placeholder="e.g. Brown Coffee" maxLength={150}
                  className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-800
                    placeholder-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500
                    focus:border-transparent transition-all" />
              </div>
            </div>

            {/* Note */}
            <div>
              <label className="block text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1.5">
                Note
              </label>
              <textarea value={note} onChange={e => setNote(e.target.value)}
                placeholder="Any extra details…" rows={2} maxLength={500}
                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-800
                  placeholder-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500
                  focus:border-transparent transition-all resize-none" />
            </div>

            {/* Category */}
            <div>
              <label className="block text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-2">
                Category *
              </label>
              <div className={`grid grid-cols-3 sm:grid-cols-4 gap-2 ${errors.category ? "p-2 rounded-xl border border-red-200 bg-red-50/20" : ""}`}>
                {categories.map(c => (
                  <button key={c.id} type="button" onClick={() => setCategoryId(c.id)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-left transition-all active:scale-95
                      ${categoryId === c.id
                        ? "border-transparent shadow-md"
                        : "bg-gray-50 border-gray-200 hover:border-gray-300"}`}
                    style={categoryId === c.id
                      ? { backgroundColor: c.color + "18", borderColor: c.color + "60" }
                      : {}}>
                    <span className="text-base shrink-0">{c.icon}</span>
                    <span className={`text-xs font-semibold truncate ${categoryId === c.id ? "text-gray-800" : "text-gray-600"}`}>
                      {c.name}
                    </span>
                  </button>
                ))}
              </div>
              {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
            </div>

            {/* Payment method */}
            <div>
              <label className="block text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-2">
                Payment Method
              </label>
              <div className="grid grid-cols-5 gap-2">
                {PAYMENT_METHODS.map(({ value, label, Icon }) => (
                  <button key={value} type="button" onClick={() => setPayMethod(value)}
                    className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border text-center transition-all active:scale-95
                      ${payMethod === value
                        ? "bg-blue-600 border-blue-600 text-white shadow-md"
                        : "bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-300"}`}>
                    <Icon size={18} strokeWidth={1.75} />
                    <span className="text-[10px] font-bold">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Save error */}
            {saveError && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
                <X size={14} className="shrink-0" />{saveError}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-1 pb-2">
              <button onClick={onClose}
                className="flex-1 py-3.5 rounded-xl border-2 border-gray-200 text-gray-500 font-bold text-sm hover:bg-gray-50 transition-all">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving}
                className="flex-1 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm
                  transition-all disabled:opacity-50 shadow-sm hover:shadow-lg hover:shadow-blue-600/25 active:scale-[0.98]">
                {saving ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    {isEdit ? "Saving…" : "Adding…"}
                  </span>
                ) : isEdit ? "Save Changes" : "Add Expense"}
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}