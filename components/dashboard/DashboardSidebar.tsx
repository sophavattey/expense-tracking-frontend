"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "./nav-items";
import type { LucideIcon } from "lucide-react";

/* ─── Logo mark ──────────────────────────────────────────────────── */
function LogoMark() {
  return (
    <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
      <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
    <nav className="flex-1 py-3 overflow-y-auto">
      {NAV_ITEMS.map(item => {
        const Icon: LucideIcon = item.icon;
        const isActive = item.id === activeId;
        return (
          <Link
            key={item.id}
            href={item.href}
            onClick={onLinkClick}
            title={collapsed ? item.label : undefined}
            className={`flex items-center gap-2.5 mx-2 px-2.5 py-2 rounded-xl mb-0.5 transition-all ${
              isActive
                ? "bg-blue-600 text-white shadow-lg shadow-blue-900/30"
                : "text-blue-300 hover:bg-blue-700/50 hover:text-white"
            } ${collapsed ? "justify-center" : ""}`}
          >
            <Icon
              size={16}
              strokeWidth={isActive ? 2.5 : 2}
              className="shrink-0"
            />
            {!collapsed && (
              <span className="text-xs font-medium">{item.label}</span>
            )}
            {!collapsed && isActive && (
              <div className="ml-auto w-1 h-1 rounded-full bg-blue-300" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}

/* ─── User row ───────────────────────────────────────────────────── */
function UserRow({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <div className="flex items-center justify-center py-2">
        <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-xs font-black text-white">S</div>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-blue-700/50 cursor-pointer mb-1.5 transition-colors">
      <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-xs font-black text-white shrink-0">S</div>
      <div className="flex-1 min-w-0">
        <p className="text-white text-[11px] font-bold truncate">Sophea Chan</p>
        <p className="text-blue-400 text-[9px] truncate">sophea@gmail.com</p>
      </div>
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
    <aside className={`hidden md:flex ${collapsed ? "w-[60px]" : "w-[220px]"} shrink-0 bg-blue-800 flex-col transition-all duration-300 z-20`}>
      {/* Logo */}
      <div className={`h-14 flex items-center ${collapsed ? "justify-center" : "px-4"} border-b border-blue-700/40 shrink-0`}>
        <LogoMark />
        {!collapsed && (
          <span className="text-white font-black text-lg ml-2 font-['Sora',sans-serif]">
            Fin<span className="text-blue-300">Set</span>
          </span>
        )}
      </div>

      <NavLinks activeId={activeId} collapsed={collapsed} />

      {/* User + collapse toggle */}
      <div className="border-t border-blue-700/40 p-2">
        {collapsed ? <UserRow compact /> : <UserRow />}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`w-full flex items-center ${collapsed ? "justify-center" : "gap-2 px-2"} py-1.5 rounded-xl text-blue-400 hover:text-white hover:bg-blue-700/50 transition-all`}
        >
          <svg
            className={`w-3.5 h-3.5 transition-transform ${collapsed ? "rotate-180" : ""}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
          {!collapsed && <span className="text-[11px]">Collapse</span>}
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
  const activeId = NAV_ITEMS.slice().reverse().find(item => pathname.startsWith(item.href))?.id ?? "dashboard";

  return (
    <>
      {open && (
        <div className="md:hidden fixed inset-0 bg-black/40 z-40" onClick={onClose} />
      )}
      <div className={`md:hidden fixed top-0 left-0 h-full w-64 bg-blue-800 z-50 flex flex-col transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="h-14 flex items-center px-4 border-b border-blue-700/40 justify-between">
          <div className="flex items-center gap-2">
            <LogoMark />
            <span className="text-white font-black text-lg font-['Sora',sans-serif]">
              Fin<span className="text-blue-300">Set</span>
            </span>
          </div>
          <button onClick={onClose} className="text-blue-400 hover:text-white p-1">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <NavLinks activeId={activeId} onLinkClick={onClose} />

        <div className="p-4 border-t border-blue-700/40">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-blue-700/40">
            <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center font-black text-white">S</div>
            <div>
              <p className="text-white text-sm font-bold">Sophea Chan</p>
              <p className="text-blue-400 text-xs">sophea@gmail.com</p>
            </div>
          </div>
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
          <Link
            key={item.id}
            href={item.href}
            className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 rounded-xl mx-0.5 transition-all ${
              isActive ? "text-blue-600" : "text-blue-300 hover:text-blue-500"
            }`}
          >
            <Icon
              size={20}
              strokeWidth={isActive ? 2.5 : 1.75}
              className={`transition-transform ${isActive ? "scale-110" : ""}`}
            />
            <span className={`text-[9px] font-semibold leading-none ${isActive ? "font-bold" : ""}`}>
              {item.label}
            </span>
            {isActive && <div className="w-1 h-1 rounded-full bg-blue-600 mt-0.5" />}
          </Link>
        );
      })}
    </nav>
  );
}