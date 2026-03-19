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
  if (collapsed) return null;
  return (
    <span className="text-gray-800 font-black text-xl font-['Sora',sans-serif] tracking-tight">
      Fin<span className="text-blue-600">Set</span>
    </span>
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

/* ─── Sign out confirm modal ─────────────────────────────────────── */
function SignOutModal({ onConfirm, onClose }: { onConfirm: () => void; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full sm:max-w-sm p-7 text-center"
        style={{ animation: "slideUp 0.25s ease both" }}>
        <style>{`@keyframes slideUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }`}</style>
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-6 sm:hidden" />
        <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
          <LogOut size={24} className="text-red-400" strokeWidth={1.75} />
        </div>
        <h3 className="text-gray-800 font-black text-xl font-['Sora',sans-serif]">Sign out?</h3>
        <p className="text-gray-400 text-sm mt-2 mb-7 leading-relaxed">
          You'll be redirected to the login page. Any unsaved changes will be lost.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose}
            className="flex-1 py-3.5 rounded-xl border-2 border-gray-200 text-gray-500 font-bold text-sm hover:bg-gray-50 transition-all">
            Cancel
          </button>
          <button onClick={onConfirm}
            className="flex-1 py-3.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-sm transition-all shadow-lg shadow-red-500/25">
            Sign Out
          </button>
        </div>
      </div>
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
  const [showConfirm, setShowConfirm] = useState(false);
  const name   = user?.name   ?? "";
  const email  = user?.email  ?? "";
  const avatar = user?.avatar;

  const handleSignOut = () => {
    setShowConfirm(false);
    logout();
    onAction?.();
  };

  return (
    <>
      {compact ? (
        <div className="flex justify-center py-1.5">
          <UserAvatar name={name} avatar={avatar} />
        </div>
      ) : (
        <div className="mb-1">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl">
            <UserAvatar name={name} avatar={avatar} />
            <div className="flex-1 min-w-0">
              <p className="text-gray-800 text-sm font-bold truncate">{name || "—"}</p>
              <p className="text-gray-400 text-xs truncate">{email}</p>
            </div>
          </div>
          <button onClick={() => setShowConfirm(true)}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-gray-700 hover:text-red-500 hover:bg-red-50 transition-all">
            <LogOut size={16} className="shrink-0" strokeWidth={2} />
            <span className="text-sm font-medium">Sign out</span>
          </button>
        </div>
      )}

      {showConfirm && (
        <SignOutModal
          onConfirm={handleSignOut}
          onClose={() => setShowConfirm(false)}
        />
      )}
    </>
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

      {/* Nav */}
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

        <NavLinks activeId={activeId} onLinkClick={onClose} />

        <div className="border-t border-gray-100 p-3 shrink-0">
          <UserRow onAction={onClose} />
        </div>
      </div>
    </>
  );
}