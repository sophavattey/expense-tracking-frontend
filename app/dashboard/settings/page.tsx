"use client";

import { useState } from "react";
import { User, Settings, AlertTriangle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

/* ─── Avatar ─────────────────────────────────────────────────────── */
function Avatar({ user, size = "md" }: {
  user: { name: string; avatar?: string };
  size?: "sm" | "md" | "lg";
}) {
  const dims = { sm: "w-9 h-9 text-sm", md: "w-16 h-16 text-2xl", lg: "w-20 h-20 text-3xl" }[size];
  const initial = user.name?.charAt(0)?.toUpperCase() ?? "?";
  if (user.avatar) {
    return (
      <img src={user.avatar} alt={user.name} referrerPolicy="no-referrer"
        className={`${dims} rounded-2xl object-cover border-2 border-white/30 shrink-0`} />
    );
  }
  return (
    <div className={`${dims} rounded-2xl bg-white/20 border-2 border-white/30 flex items-center justify-center text-white font-black font-['Sora',sans-serif] shrink-0`}>
      {initial}
    </div>
  );
}

/* ─── Info row ────────────────────────────────────────────────────── */
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
      <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">{label}</span>
      <span className="text-gray-800 text-sm font-semibold">{value}</span>
    </div>
  );
}

/* ─── Currency row ───────────────────────────────────────────────── */
function CurrencyRow({ current, onChange }: {
  current: "USD" | "KHR";
  onChange: (c: "USD" | "KHR") => Promise<void>;
}) {
  const [saving, setSaving] = useState(false);

  const handleSwitch = async (c: "USD" | "KHR") => {
    if (c === current || saving) return;
    setSaving(true);
    try { await onChange(c); }
    finally { setSaving(false); }
  };

  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
      <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Primary Currency</span>
      <div className="flex items-center gap-1.5">
        {saving && (
          <svg className="w-3.5 h-3.5 animate-spin text-gray-400" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
        )}
        <div className="flex bg-gray-100 border border-gray-200 rounded-lg p-0.5">
          {(["USD", "KHR"] as const).map(c => (
            <button key={c} onClick={() => handleSwitch(c)} disabled={saving}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                current === c
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}>
              {c === "USD" ? "USD $" : "KHR ៛"}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Section card ───────────────────────────────────────────────── */
function Section({ title, Icon, children, iconClass = "text-blue-500", bgClass = "bg-blue-50" }: {
  title: string;
  Icon: React.ElementType;
  children: React.ReactNode;
  iconClass?: string;
  bgClass?: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-50 flex items-center gap-2.5">
        <div className={`w-8 h-8 rounded-xl ${bgClass} flex items-center justify-center shrink-0`}>
          <Icon size={16} className={iconClass} strokeWidth={2} />
        </div>
        <h2 className="text-gray-800 font-black text-base font-['Sora',sans-serif]">{title}</h2>
      </div>
      <div className="px-5 py-1">{children}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SETTINGS PAGE
═══════════════════════════════════════════════════════════════════ */
export default function SettingsPage() {
  const { user, logout, updateCurrency } = useAuth();

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 rounded-full border-4 border-gray-200 border-t-blue-600 animate-spin" />
      </div>
    );
  }

  const joinDate = "February 2026";

  return (
    <div className="max-w-2xl mx-auto space-y-4">

      {/* ── Profile header ── */}
      <div className="bg-linear-to-r from-blue-700 to-blue-500 rounded-2xl p-5 flex items-center gap-4 shadow-lg shadow-blue-600/20">
        <Avatar user={user} size="md" />
        <div className="min-w-0">
          <p className="text-white font-black text-xl font-['Sora',sans-serif] leading-tight truncate">{user.name}</p>
          <p className="text-blue-200 text-sm truncate">{user.email}</p>
        </div>
      </div>

      {/* ── Account info ── */}
      <Section title="Account Information" Icon={User} iconClass="text-blue-500" bgClass="bg-blue-50">
        <InfoRow label="Full Name"    value={user.name} />
        <InfoRow label="Email"        value={user.email} />
        <InfoRow label="Member since" value={joinDate} />
      </Section>

      {/* ── Preferences ── */}
      <Section title="Preferences" Icon={Settings} iconClass="text-indigo-500" bgClass="bg-indigo-50">
        <CurrencyRow current={user.preferredCurrency} onChange={updateCurrency} />
        <InfoRow label="Language" value="English" />
        <InfoRow label="Timezone" value="Asia/Phnom_Penh (UTC+7)" />
      </Section>

      {/* ── Danger zone ── */}
      <div className="bg-white rounded-2xl border border-red-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-red-50 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
            <AlertTriangle size={16} className="text-red-400" strokeWidth={2} />
          </div>
          <h2 className="text-red-500 font-black text-base font-['Sora',sans-serif]">Account Actions</h2>
        </div>
        <div className="px-5 py-4 space-y-3">
          <button onClick={() => logout()}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300 transition-all font-bold text-sm">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </button>
          <p className="text-gray-300 text-[10px] text-center">
            Account deletion and data export coming in a future update.
          </p>
        </div>
      </div>

    </div>
  );
}