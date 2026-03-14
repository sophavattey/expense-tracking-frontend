"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Bell, AlertTriangle, BarChart2, Users, User, type LucideIcon } from "lucide-react";
import { DashboardSidebar, MobileDrawer } from "@/components/dashboard/DashboardSidebar";
import { ALL_NAV_ITEMS } from "@/components/dashboard/nav-items";
import { useAuth } from "@/contexts/AuthContext";
import { useGroup, GroupProvider } from "@/contexts/GroupContext";

const NOTIFICATIONS = [
  { Icon: AlertTriangle, msg: "Utilities budget at 90%",   detail: "$5 left",      time: "1h ago", urgent: true  },
  { Icon: BarChart2,     msg: "New KHQR receipt detected", detail: "Brown Coffee", time: "2h ago", urgent: false },
];

/* ─── Mobile top header ──────────────────────────────────────────── */
function MobileHeader({ onMenuOpen }: { onMenuOpen: () => void }) {
  const [notifOpen, setNotifOpen] = useState(false);
  const { isGroup, activeContext } = useGroup();

  return (
    <header className="md:hidden sticky top-0 z-40 bg-white border-b border-blue-100 px-4 h-14 flex items-center gap-3">

      {/* Hamburger */}
      <button onClick={onMenuOpen}
        className="w-8 h-8 flex items-center justify-center rounded-lg text-blue-500 hover:bg-blue-50 shrink-0 transition-colors">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Logo */}
      <div className="flex items-center gap-1.5 shrink-0">
        <div className={`w-6 h-6 rounded-lg ${isGroup ? "bg-indigo-600" : "bg-blue-600"} flex items-center justify-center`}>
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <span className={`font-black text-base font-['Sora',sans-serif] ${isGroup ? "text-indigo-800" : "text-blue-800"}`}>
          Fin<span className={isGroup ? "text-indigo-500" : "text-blue-600"}>Set</span>
        </span>
      </div>

      {/* Active context badge */}
      <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-xs font-bold
        ${isGroup
          ? "bg-indigo-50 border-indigo-200 text-indigo-700"
          : "bg-blue-50 border-blue-200 text-blue-600"}`}>
        {isGroup
          ? <Users size={11} strokeWidth={2.5} />
          : <User  size={11} strokeWidth={2.5} />
        }
        <span className="max-w-[72px] truncate leading-none">
          {isGroup ? activeContext.groupName : "Personal"}
        </span>
      </div>

      {/* Notifications */}
      <div className="relative ml-auto">
        <button onClick={() => setNotifOpen(!notifOpen)}
          className="relative w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
          <Bell size={15} className="text-blue-500" />
          <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white text-[7px] font-black">{NOTIFICATIONS.length}</span>
          </span>
        </button>

        {notifOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
            <div className="absolute right-0 top-10 w-64 bg-white border border-blue-100 rounded-2xl shadow-xl z-50 overflow-hidden">
              <div className="px-3 py-2.5 border-b border-blue-50">
                <p className="text-blue-800 text-[10px] font-bold uppercase tracking-widest">Notifications</p>
              </div>
              {NOTIFICATIONS.map((n, i) => (
                <div key={i} className={`px-3 py-2.5 hover:bg-blue-50 cursor-pointer border-b border-blue-50 last:border-0 ${n.urgent ? "bg-red-50/40" : ""}`}>
                  <div className="flex gap-2 items-start">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${n.urgent ? "bg-red-100" : "bg-blue-50"}`}>
                      <n.Icon size={13} className={n.urgent ? "text-red-500" : "text-blue-400"} strokeWidth={2} />
                    </div>
                    <div>
                      <p className="text-blue-700 text-[11px] font-semibold leading-snug">{n.msg}</p>
                      <p className="text-blue-400 text-[10px]">{n.detail}</p>
                      <p className="text-blue-300 text-[9px] mt-0.5">{n.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </header>
  );
}

/* ─── Desktop top header ─────────────────────────────────────────── */
function DesktopHeader() {
  const pathname = usePathname();
  const [notifOpen, setNotifOpen] = useState(false);
  const { isGroup, activeContext } = useGroup();

  const active    = ALL_NAV_ITEMS.slice().reverse().find(item => pathname.startsWith(item.href));
  const pageTitle = active?.label ?? "Dashboard";
  const PageIcon: LucideIcon = active?.icon ?? ALL_NAV_ITEMS[0].icon;

  return (
    <header className="hidden md:flex h-16 bg-white border-b border-blue-100 items-center justify-between px-8 shrink-0 z-10">
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 rounded-xl border flex items-center justify-center
          ${isGroup ? "bg-indigo-50 border-indigo-100" : "bg-blue-50 border-blue-100"}`}>
          <PageIcon size={18} className={isGroup ? "text-indigo-500" : "text-blue-500"} strokeWidth={2} />
        </div>
        <h1 className={`font-black text-lg font-['Sora',sans-serif] leading-none
          ${isGroup ? "text-indigo-800" : "text-blue-800"}`}>
          {pageTitle}
        </h1>

        {isGroup && (
          <div className="flex items-center gap-1.5 ml-2 bg-indigo-50 border border-indigo-100 rounded-xl px-3 py-1.5">
            <Users size={13} className="text-indigo-400" strokeWidth={2} />
            <span className="text-indigo-700 text-xs font-bold">{activeContext.groupName}</span>
            <span className="text-indigo-300 text-[10px]">·</span>
            <span className="text-indigo-400 text-[11px]">{activeContext.groupMembers?.length ?? 0} members</span>
          </div>
        )}
      </div>

      <div className="relative">
        <button onClick={() => setNotifOpen(!notifOpen)}
          className="relative w-10 h-10 rounded-xl border border-blue-100 bg-blue-50 flex items-center justify-center hover:bg-blue-100 transition-colors">
          <Bell size={17} className="text-blue-500" />
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white text-[8px] font-black">{NOTIFICATIONS.length}</span>
          </span>
        </button>

        {notifOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
            <div className="absolute right-0 top-12 w-80 bg-white border border-blue-100 rounded-2xl shadow-xl z-50 overflow-hidden">
              <div className="px-5 py-3.5 border-b border-blue-50 flex items-center justify-between">
                <p className="text-blue-800 text-sm font-bold">Notifications</p>
                <span className="bg-red-100 text-red-500 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {NOTIFICATIONS.length} new
                </span>
              </div>
              {NOTIFICATIONS.map((n, i) => (
                <div key={i} className={`px-5 py-3.5 hover:bg-blue-50 cursor-pointer border-b border-blue-50 last:border-0 ${n.urgent ? "bg-red-50/30" : ""}`}>
                  <div className="flex gap-3 items-start">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${n.urgent ? "bg-red-100" : "bg-blue-50"}`}>
                      <n.Icon size={15} className={n.urgent ? "text-red-500" : "text-blue-400"} strokeWidth={2} />
                    </div>
                    <div>
                      <p className="text-blue-700 text-sm font-semibold leading-snug">{n.msg}</p>
                      <p className="text-blue-400 text-xs">{n.detail}</p>
                      <p className="text-blue-300 text-xs mt-0.5">{n.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </header>
  );
}

/* ─── Auth guard + inner layout ──────────────────────────────────── */
function DashboardInner({ children }: { children: React.ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) router.replace("/login");
  }, [loading, isAuthenticated, router]);

  if (loading || !isAuthenticated) {
    return (
      <div className="h-screen flex items-center justify-center bg-blue-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center animate-pulse">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-blue-400 text-sm font-medium">Loading FinSet…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Desktop sidebar */}
      <DashboardSidebar />

      {/* Mobile drawer */}
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Mobile top bar with hamburger */}
        <MobileHeader onMenuOpen={() => setDrawerOpen(true)} />
        {/* Desktop top bar */}
        <DesktopHeader />

        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-4 md:py-7 pb-6">
          {children}
        </main>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   DASHBOARD LAYOUT
═══════════════════════════════════════════════════════════════════ */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800;900&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600&display=swap');
        * { font-family: 'DM Sans', sans-serif; box-sizing: border-box; }
        h1, h2, h3 { font-family: 'Sora', sans-serif; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-thumb { background: #bfdbfe; border-radius: 99px; }
        ::-webkit-scrollbar-track { background: transparent; }
        @keyframes slide-in { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .card-in { animation: slide-in 0.45s ease both; }
      `}</style>
      <GroupProvider>
        <DashboardInner>{children}</DashboardInner>
      </GroupProvider>
    </>
  );
}