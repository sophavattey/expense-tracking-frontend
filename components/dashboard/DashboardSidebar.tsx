"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { NAV_ITEMS } from "./nav-items";
import type { LucideIcon } from "lucide-react";

/* ─── Logo mark ──────────────────────────────────────────────────── */
function LogoMark() {
  return (
    <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shrink-0 shadow-lg shadow-blue-900/30">
      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
  );
}

/* ─── Nav links ──────────────────────────────────────────────────── */
function NavLinks({ activeId, collapsed = false, onLinkClick }: {
  activeId: string;
  collapsed?: boolean;
  onLinkClick?: () => void;
}) {
  return (
    <nav className="flex-1 py-4 overflow-y-auto px-3">
      {!collapsed && (
        <p className="text-blue-500/60 text-[10px] font-bold uppercase tracking-widest px-3 mb-2">Menu</p>
      )}
      {NAV_ITEMS.map(item => {
        const Icon: LucideIcon = item.icon;
        const isActive = item.id === activeId;
        return (
          <Link
            key={item.id}
            href={item.href}
            onClick={onLinkClick}
            title={collapsed ? item.label : undefined}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 transition-all group ${
              isActive
                ? "bg-blue-600 text-white shadow-lg shadow-blue-900/30"
                : "text-blue-300 hover:bg-blue-700/50 hover:text-white"
            } ${collapsed ? "justify-center" : ""}`}
          >
            <Icon size={18} strokeWidth={isActive ? 2.5 : 2} className="shrink-0" />
            {!collapsed && (
              <span className="text-sm font-semibold flex-1">{item.label}</span>
            )}
            {!collapsed && isActive && (
              <div className="w-1.5 h-1.5 rounded-full bg-blue-300" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}

/* ─── User row ───────────────────────────────────────────────────── */
function UserRow({ compact = false }: { compact?: boolean }) {
  const { user, logout } = useAuth();
  const initial = user?.name?.charAt(0)?.toUpperCase() ?? "?";
  const email = user?.email ?? "";

  if (compact) {
    return (
      <div className="flex items-center justify-center py-2">
        <div
          title={user?.name}
          className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-sm font-black text-white cursor-pointer hover:opacity-90 transition-opacity shadow-lg"
        >
          {initial}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-2">
      <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-blue-700/50 cursor-pointer transition-colors">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-sm font-black text-white shrink-0 shadow-md">
          {initial}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-bold truncate">{user?.name ?? "—"}</p>
          <p className="text-blue-400 text-xs truncate">{email}</p>
        </div>
      </div>
      <button
        onClick={() => logout()}
        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-blue-400 hover:text-red-400 hover:bg-red-500/10 transition-all mt-0.5"
      >
        <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        <span className="text-sm">Sign out</span>
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   DESKTOP SIDEBAR
═══════════════════════════════════════════════════════════════════ */
export function DashboardSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const activeId = NAV_ITEMS.slice().reverse().find(item => pathname.startsWith(item.href))?.id ?? "dashboard";

  return (
    <aside className={`hidden md:flex ${collapsed ? "w-[68px]" : "w-[260px]"} shrink-0 bg-blue-900 flex-col transition-all duration-300 z-20`}>
      {/* Logo */}
      <div className={`h-16 flex items-center ${collapsed ? "justify-center px-4" : "px-5"} border-b border-blue-800 shrink-0`}>
        <LogoMark />
        {!collapsed && (
          <div className="ml-3">
            <span className="text-white font-black text-xl font-['Sora',sans-serif] tracking-tight">
              Fin<span className="text-blue-300">Set</span>
            </span>
            <p className="text-blue-500 text-[10px] font-medium -mt-0.5">Personal Finance</p>
          </div>
        )}
      </div>

      <NavLinks activeId={activeId} collapsed={collapsed} />

      {/* Bottom section */}
      <div className="border-t border-blue-800 p-3">
        <UserRow compact={collapsed} />
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`w-full flex items-center ${collapsed ? "justify-center" : "gap-2.5 px-3"} py-2 rounded-xl text-blue-500 hover:text-white hover:bg-blue-700/50 transition-all`}
        >
          <svg className={`w-4 h-4 transition-transform ${collapsed ? "rotate-180" : ""}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
          {!collapsed && <span className="text-sm">Collapse</span>}
        </button>
      </div>
    </aside>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MOBILE DRAWER
═══════════════════════════════════════════════════════════════════ */
export function MobileDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const activeId = NAV_ITEMS.slice().reverse().find(item => pathname.startsWith(item.href))?.id ?? "dashboard";
  const initial = user?.name?.charAt(0)?.toUpperCase() ?? "?";

  return (
    <>
      {open && <div className="md:hidden fixed inset-0 bg-black/40 z-40" onClick={onClose} />}
      <div className={`md:hidden fixed top-0 left-0 h-full w-72 bg-blue-900 z-50 flex flex-col transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="h-14 flex items-center px-5 border-b border-blue-800 justify-between">
          <div className="flex items-center gap-3">
            <LogoMark />
            <span className="text-white font-black text-xl font-['Sora',sans-serif]">
              Fin<span className="text-blue-300">Set</span>
            </span>
          </div>
          <button onClick={onClose} className="text-blue-400 hover:text-white p-1.5 rounded-lg hover:bg-blue-800 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <NavLinks activeId={activeId} onLinkClick={onClose} />

        <div className="p-4 border-t border-blue-800 space-y-2">
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-blue-800/60">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center font-black text-white shadow-lg">
              {initial}
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-bold truncate">{user?.name ?? "—"}</p>
              <p className="text-blue-400 text-xs truncate">{user?.email ?? ""}</p>
            </div>
          </div>
          <button
            onClick={() => { logout(); onClose(); }}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-blue-400 hover:text-red-400 hover:bg-red-500/10 transition-all text-sm font-semibold"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign out
          </button>
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MOBILE BOTTOM NAV
═══════════════════════════════════════════════════════════════════ */
export function MobileBottomNav() {
  const pathname = usePathname();
  const activeId = NAV_ITEMS.slice().reverse().find(item => pathname.startsWith(item.href))?.id ?? "dashboard";
  const items = NAV_ITEMS.slice(0, 5);

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white border-t border-blue-100 flex items-center px-1"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 8px)" }}
    >
      {items.map(item => {
        const Icon: LucideIcon = item.icon;
        const isActive = item.id === activeId;
        return (
          <Link key={item.id} href={item.href}
            className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 rounded-xl mx-0.5 transition-all ${
              isActive ? "text-blue-600" : "text-blue-300 hover:text-blue-500"
            }`}>
            <Icon size={20} strokeWidth={isActive ? 2.5 : 1.75}
              className={`transition-transform ${isActive ? "scale-110" : ""}`} />
            <span className={`text-[9px] font-semibold leading-none ${isActive ? "font-bold" : ""}`}>{item.label}</span>
            {isActive && <div className="w-1 h-1 rounded-full bg-blue-600 mt-0.5" />}
          </Link>
        );
      })}
    </nav>
  );
}