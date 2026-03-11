"use client";

import { useState } from "react";
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
    <div className="flex items-center justify-between py-3 border-b border-blue-50 last:border-0">
      <span className="text-blue-400 text-xs font-bold uppercase tracking-widest">{label}</span>
      <span className="text-blue-800 text-sm font-semibold">{value}</span>
    </div>
  );
}

/* ─── Currency row — interactive ─────────────────────────────────── */
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
    <div className="flex items-center justify-between py-3 border-b border-blue-50 last:border-0">
      <span className="text-blue-400 text-xs font-bold uppercase tracking-widest">Primary Currency</span>
      <div className="flex items-center gap-1.5">
        {saving && (
          <svg className="w-3.5 h-3.5 animate-spin text-blue-400" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
        )}
        <div className="flex bg-blue-50 border border-blue-100 rounded-lg p-0.5">
          {(["USD", "KHR"] as const).map(c => (
            <button key={c} onClick={() => handleSwitch(c)} disabled={saving}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                current === c
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-blue-400 hover:text-blue-600"
              }`}>
              {c === "USD" ? "🇺🇸 USD" : "🇰🇭 KHR"}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Section card ───────────────────────────────────────────────── */
function Section({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-blue-100 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-blue-50 flex items-center gap-2.5">
        <span className="text-xl">{icon}</span>
        <h2 className="text-blue-800 font-black text-base font-['Sora',sans-serif]">{title}</h2>
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
        <div className="w-8 h-8 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin" />
      </div>
    );
  }

  const joinDate      = "February 2026";
  const providerLabel = user.provider === "GOOGLE" ? "Google OAuth2" : "Email & Password";
  const providerIcon  = user.provider === "GOOGLE" ? "🔵" : "✉️";

  return (
    <div className="max-w-2xl mx-auto space-y-4">

      {/* ── Profile header ── */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-500 rounded-2xl p-5 flex items-center gap-4 shadow-lg shadow-blue-600/20">
        <Avatar user={user} size="md" />
        <div className="min-w-0">
          <p className="text-white font-black text-xl font-['Sora',sans-serif] leading-tight truncate">{user.name}</p>
          <p className="text-blue-200 text-sm truncate">{user.email}</p>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="bg-white/15 border border-white/20 text-blue-100 text-[10px] font-bold px-2 py-0.5 rounded-lg">
              {user.role}
            </span>
            <span className="bg-white/15 border border-white/20 text-blue-100 text-[10px] font-bold px-2 py-0.5 rounded-lg">
              {providerIcon} {providerLabel}
            </span>
          </div>
        </div>
      </div>

      {/* ── Account info ── */}
      <Section title="Account Information" icon="👤">
        <InfoRow label="Full Name"    value={user.name} />
        <InfoRow label="Email"        value={user.email} />
        <InfoRow label="Account ID"   value={`${user.id.slice(0, 8)}…`} />
        <InfoRow label="Role"         value={user.role} />
        <InfoRow label="Sign-in via"  value={providerLabel} />
        <InfoRow label="Member since" value={joinDate} />
      </Section>

      {/* ── Preferences ── */}
      <Section title="Preferences" icon="⚙️">
        {/* ✅ Interactive currency switcher — calls API on click, updates user state instantly */}
        <CurrencyRow current={user.preferredCurrency} onChange={updateCurrency} />
        <InfoRow label="Language"      value="English" />
        <InfoRow label="Timezone"      value="Asia/Phnom_Penh (UTC+7)" />
        <InfoRow label="Notifications" value="Enabled" />
      </Section>

      {/* ── Security ── */}
      <Section title="Security" icon="🔒">
        {user.provider === "LOCAL" && (
          <InfoRow label="Password" value="••••••••  (change coming soon)" />
        )}
        <InfoRow label="Session tokens" value="HTTP-only cookies" />
        <InfoRow label="Token refresh"  value="Automatic (7-day rotation)" />
        <InfoRow label="2FA"            value="Coming soon" />
      </Section>

      {/* ── Danger zone ── */}
      <div className="bg-white rounded-2xl border border-red-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-red-50 flex items-center gap-2.5">
          <span className="text-xl">⚠️</span>
          <h2 className="text-red-600 font-black text-base font-['Sora',sans-serif]">Account Actions</h2>
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
          <p className="text-blue-300 text-[10px] text-center">
            Account deletion and data export coming in a future update.
          </p>
        </div>
      </div>

    </div>
  );
}