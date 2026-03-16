"use client";

import { Banknote, Smartphone, CreditCard, Building2, AppWindow, MoreHorizontal } from "lucide-react";

const KHR_RATE = 4000;

const PAYMENT_METHODS = [
  { value: "CASH",  label: "Cash",  Icon: Banknote     },
  { value: "KHQR",  label: "KHQR",  Icon: Smartphone   },
  { value: "CARD",  label: "Card",  Icon: CreditCard   },
  { value: "BANK",  label: "Bank",  Icon: Building2    },
  { value: "APP",   label: "App",   Icon: AppWindow    },
  { value: "OTHER", label: "Other", Icon: MoreHorizontal },
];

export function Field({ label, error, children }: {
  label: string; error?: string; children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-gray-500 text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-1.5 sm:mb-2">
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

interface Category { id: string; name: string; icon: string; color: string }

export function ExpenseFormFields({
  amount, setAmount, currency, setCurrency, date, setDate,
  categoryId, setCategoryId, merchant, setMerchant, note, setNote,
  payMethod, setPayMethod, errors, categories,
}: {
  amount: string;      setAmount: (v: string) => void;
  currency: "USD" | "KHR"; setCurrency: (v: "USD" | "KHR") => void;
  date: string;        setDate: (v: string) => void;
  categoryId: string | ""; setCategoryId: (v: string | "") => void;
  merchant: string;    setMerchant: (v: string) => void;
  note: string;        setNote: (v: string) => void;
  payMethod: string;   setPayMethod: (v: string) => void;
  errors: Record<string, string>;
  categories: Category[];
}) {
  const numAmt     = Number(amount) || 0;
  const previewKHR = currency === "USD" ? numAmt * KHR_RATE : numAmt;
  const previewUSD = currency === "KHR" ? numAmt / KHR_RATE : numAmt;

  return (
    <>
      {/* ── Amount + Currency ── */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6 shadow-sm space-y-4">
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          <div className="col-span-2">
            <Field label="Amount *" error={errors.amount}>
              <div className="relative">
                <span className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm sm:text-base">
                  {currency === "KHR" ? "៛" : "$"}
                </span>
                <input
                  type="text" inputMode="decimal" value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder="0.00"
                  className={`w-full pl-8 sm:pl-9 pr-3 sm:pr-4 py-3 sm:py-3.5 rounded-xl border bg-gray-50
                    text-gray-800 font-bold text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500
                    focus:border-transparent transition-all
                    ${errors.amount ? "border-red-300 bg-red-50/30" : "border-gray-200"}`}
                />
              </div>
            </Field>
          </div>
          <div>
            <Field label="Currency">
              <div className="flex bg-gray-100 border border-gray-200 rounded-xl p-1 h-[46px] sm:h-[52px]">
                {(["USD", "KHR"] as const).map(c => (
                  <button key={c} type="button" onClick={() => setCurrency(c)}
                    className={`flex-1 rounded-lg text-xs sm:text-sm font-bold transition-all
                      ${currency === c ? "bg-blue-600 text-white shadow-md" : "text-gray-500 hover:text-gray-700"}`}>
                    {c}
                  </button>
                ))}
              </div>
            </Field>
          </div>
        </div>

        {numAmt > 0 && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 border border-gray-200">
            <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            <span className="text-gray-500 text-xs">
              {currency === "USD"
                ? `≈ ៛${Math.round(previewKHR).toLocaleString()} KHR`
                : `≈ $${previewUSD.toFixed(2)} USD`}
            </span>
            <span className="text-gray-300 text-xs ml-auto hidden sm:inline">at ៛{KHR_RATE}/USD</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <Field label="Date *" error={errors.date}>
            <input type="date" value={date} onChange={e => setDate(e.target.value)}
              className={`w-full px-3 sm:px-4 py-3 sm:py-3.5 rounded-xl border bg-gray-50 text-gray-800 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all
                ${errors.date ? "border-red-300" : "border-gray-200"}`}
            />
          </Field>
          <Field label="Merchant (optional)">
            <input type="text" value={merchant} onChange={e => setMerchant(e.target.value)}
              placeholder="e.g. Brown Coffee" maxLength={150}
              className="w-full px-3 sm:px-4 py-3 sm:py-3.5 rounded-xl border border-gray-200 bg-gray-50
                text-gray-800 placeholder-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500
                focus:border-transparent transition-all"
            />
          </Field>
        </div>

        <Field label="Note (optional)">
          <textarea value={note} onChange={e => setNote(e.target.value)}
            placeholder="Any extra details…" rows={2} maxLength={500}
            className="w-full px-3 sm:px-4 py-3 sm:py-3.5 rounded-xl border border-gray-200 bg-gray-50
              text-gray-800 placeholder-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500
              focus:border-transparent transition-all resize-none"
          />
        </Field>
      </div>

      {/* ── Category ── */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6 shadow-sm">
        <Field label="Category *" error={errors.category}>
          <div className={`grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2 mt-2
            ${errors.category ? "p-2 rounded-xl border border-red-200 bg-red-50/20" : ""}`}>
            {categories.map(c => (
              <button key={c.id} type="button" onClick={() => setCategoryId(c.id)}
                className={`flex items-center gap-2 px-2.5 sm:px-3 py-2.5 rounded-xl border text-left
                  transition-all active:scale-95
                  ${categoryId === c.id
                    ? "border-transparent shadow-md"
                    : "bg-gray-50 border-gray-200 hover:border-gray-300 hover:bg-gray-100"}`}
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
        </Field>
      </div>

      {/* ── Payment method ── */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6 shadow-sm">
        <Field label="Payment Method">
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mt-2">
            {PAYMENT_METHODS.map(({ value, label, Icon }) => (
              <button key={value} type="button" onClick={() => setPayMethod(value)}
                className={`flex flex-col items-center gap-1.5 py-2.5 sm:py-3 rounded-xl border
                  text-center transition-all active:scale-95
                  ${payMethod === value
                    ? "bg-blue-600 border-blue-600 text-white shadow-md"
                    : "bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-100"}`}>
                <Icon size={18} strokeWidth={1.75} />
                <span className="text-[10px] font-bold">{label}</span>
              </button>
            ))}
          </div>
        </Field>
      </div>
    </>
  );
}