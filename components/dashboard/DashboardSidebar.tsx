"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  PanelLeftClose, PanelLeftOpen, X,
  LogOut, type LucideIcon,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { NAV_ITEMS, NAV_BOTTOM_ITEMS, ALL_NAV_ITEMS } from "./nav-items";

/* ─── Logo ───────────────────────────────────────────────────────── */
function Logo({ collapsed }: { collapsed?: boolean }) {
  return (
    <div className={`flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}>
      <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shrink-0 shadow-md shadow-blue-600/30">
        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      {!collapsed && (
        <div>
          <span className="text-gray-800 font-black text-xl font-['Sora',sans-serif] tracking-tight">
            Fin<span className="text-blue-600">Set</span>
          </span>
          <p className="text-gray-400 text-[10px] font-medium -mt-0.5">Personal Finance</p>
        </div>
      )}
    </div>
  );
}

/* ─── User avatar ────────────────────────────────────────────────── */
export function UserAvatar({ name, avatar, size = "md" }: {
  name: string; avatar?: string; size?: "xs" | "sm" | "md";
}) {
  const dims = size === "xs" ? "w-6 h-6 text-[10px]" : "w-9 h-9 text-sm";
  const initial = name?.charAt(0)?.toUpperCase() ?? "?";
  if (avatar) {
    return (
      <img src={avatar} alt={name} referrerPolicy="no-referrer"
        className={`${dims} rounded-full object-cover shrink-0 shadow-sm ring-2 ring-gray-100`} />
    );
  }
  return (
    <div className={`${dims} rounded-full bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center font-black text-white shrink-0 shadow-sm`}>
      {initial}
    </div>
  );
}

/* ─── Nav links ──────────────────────────────────────────────────── */
function NavLinks({ activeId, collapsed = false, onLinkClick }: {
  activeId: string; collapsed?: boolean; onLinkClick?: () => void;
}) {
  return (
    <nav className="flex-1 py-2 overflow-y-auto px-3">
      {!collapsed && (
        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest px-3 mb-2">Menu</p>
      )}
      {NAV_ITEMS.map(item => {
        const Icon: LucideIcon = item.icon;
        const isActive = item.id === activeId;
        return (
          <Link key={item.id} href={item.href} onClick={onLinkClick}
            title={collapsed ? item.label : undefined}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 transition-all
              ${isActive
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"}
              ${collapsed ? "justify-center" : ""}`}>
            <Icon size={18} strokeWidth={isActive ? 2.5 : 2} className="shrink-0" />
            {!collapsed && (
              <span className={`text-sm font-semibold flex-1 ${isActive ? "text-white" : "text-gray-700"}`}>
                {item.label}
              </span>
            )}
            {!collapsed && isActive && <div className="w-1.5 h-1.5 rounded-full bg-blue-300" />}
          </Link>
        );
      })}

      <div className="my-3 mx-3 border-t border-gray-100" />

      {NAV_BOTTOM_ITEMS.map(item => {
        const Icon: LucideIcon = item.icon;
        const isActive = item.id === activeId;
        return (
          <Link key={item.id} href={item.href} onClick={onLinkClick}
            title={collapsed ? item.label : undefined}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 transition-all
              ${isActive
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"}
              ${collapsed ? "justify-center" : ""}`}>
            <Icon size={18} strokeWidth={isActive ? 2.5 : 2} className="shrink-0" />
            {!collapsed && (
              <span className={`text-sm font-semibold flex-1 ${isActive ? "text-white" : "text-gray-700"}`}>
                {item.label}
              </span>
            )}
            {!collapsed && isActive && <div className="w-1.5 h-1.5 rounded-full bg-blue-300" />}
          </Link>
        );
      })}
    </nav>
  );
}

/* ─── User row ───────────────────────────────────────────────────── */
function UserRow({ compact = false, onAction }: { compact?: boolean; onAction?: () => void }) {
  const { user, logout } = useAuth();
  const name   = user?.name   ?? "";
  const email  = user?.email  ?? "";
  const avatar = user?.avatar;

  if (compact) {
    return (
      <div className="flex justify-center py-1.5">
        <UserAvatar name={name} avatar={avatar} />
      </div>
    );
  }

  return (
    <div className="mb-1">
      <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl">
        <UserAvatar name={name} avatar={avatar} />
        <div className="flex-1 min-w-0">
          <p className="text-gray-800 text-sm font-bold truncate">{name || "—"}</p>
          <p className="text-gray-400 text-xs truncate">{email}</p>
        </div>
      </div>
      <button onClick={() => { logout(); onAction?.(); }}
        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-gray-700 hover:text-red-500 hover:bg-red-50 transition-all">
        <LogOut size={16} className="shrink-0" strokeWidth={2} />
        <span className="text-sm font-medium">Sign out</span>
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
  const activeId = ALL_NAV_ITEMS.slice().reverse()
    .find(item => pathname.startsWith(item.href))?.id ?? "dashboard";

  return (
    <aside className={`hidden md:flex ${collapsed ? "w-[68px]" : "w-[260px]"} shrink-0 bg-white border-r border-gray-200 flex-col transition-all duration-300 z-20`}>

      {/* Logo header */}
      <div className={`h-16 flex items-center ${collapsed ? "justify-center px-4" : "px-5"} border-b border-gray-100 shrink-0`}>
        <Logo collapsed={collapsed} />
      </div>

      {/* Nav — full height, no context switcher */}
      <NavLinks activeId={activeId} collapsed={collapsed} />

      {/* Bottom: user + collapse */}
      <div className="border-t border-gray-100 p-3">
        <UserRow compact={collapsed} />
        <button onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={`w-full flex items-center ${collapsed ? "justify-center" : "gap-2.5 px-3"} py-2 rounded-xl text-gray-700 hover:bg-gray-100 transition-all`}>
          {collapsed
            ? <PanelLeftOpen  size={16} strokeWidth={2} />
            : <PanelLeftClose size={16} strokeWidth={2} />}
          {!collapsed && <span className="text-sm font-medium">Collapse</span>}
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
  const activeId = ALL_NAV_ITEMS.slice().reverse()
    .find(item => pathname.startsWith(item.href))?.id ?? "dashboard";

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else       document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <div
        className={`md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300
          ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />
      <div className={`md:hidden fixed top-0 left-0 h-full w-72 bg-white z-50 flex flex-col
        transition-transform duration-300 ease-in-out shadow-2xl border-r border-gray-200
        ${open ? "translate-x-0" : "-translate-x-full"}`}>

        <div className="h-14 flex items-center px-5 border-b border-gray-100 justify-between shrink-0">
          <Logo />
          <button onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
            <X size={18} strokeWidth={2} />
          </button>
        </div>

        {/* Nav only — no context switcher, it lives in the header */}
        <NavLinks activeId={activeId} onLinkClick={onClose} />

        <div className="border-t border-gray-100 p-3 shrink-0">
          <UserRow onAction={onClose} />
        </div>
      </div>
    </>
  );
}