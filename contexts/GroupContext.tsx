"use client";

import {
  createContext, useContext, useState, useEffect,
  useCallback, ReactNode,
} from "react";
import { apiFetch } from "@/services/api-client";
import type { ActiveContext, Group } from "@/types/group.types";

/* ─── Cookie helpers ────────────────────────────────────────────── */
const COOKIE_KEY = "finset_ctx";
const COOKIE_MAX = 30 * 24 * 60 * 60; // 30 days

function readCookie(): ActiveContext {
  if (typeof document === "undefined") return { type: "personal" };
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${COOKIE_KEY}=([^;]*)`));
  if (!match) return { type: "personal" };
  try { return JSON.parse(decodeURIComponent(match[1])); }
  catch { return { type: "personal" }; }
}

function writeCookie(ctx: ActiveContext) {
  document.cookie =
    `${COOKIE_KEY}=${encodeURIComponent(JSON.stringify(ctx))};` +
    `path=/;max-age=${COOKIE_MAX};SameSite=Lax`;
}

/* ─── Context type ──────────────────────────────────────────────── */
interface GroupContextType {
  activeContext:    ActiveContext;
  isGroup:          boolean;
  groups:           Group[];
  loadingGroups:    boolean;
  switchToPersonal: () => void;
  switchToGroup:    (group: Group) => void;
  refreshGroups:    () => Promise<void>;
}

const GroupContext = createContext<GroupContextType | null>(null);

/* ─── Provider ──────────────────────────────────────────────────── */
export function GroupProvider({ children }: { children: ReactNode }) {
  const [activeContext, setActiveContext] = useState<ActiveContext>({ type: "personal" });
  const [groups,        setGroups]        = useState<Group[]>([]);
  const [loadingGroups, setLoadingGroups] = useState(true);

  /* ── Restore from cookie on mount ── */
  useEffect(() => {
    setActiveContext(readCookie());
  }, []);

  /* ── Fetch groups ── */
  const refreshGroups = useCallback(async () => {
    setLoadingGroups(true);
    try {
      const data = await apiFetch<Group[]>("/api/groups/mine");
      setGroups(data);

      const saved = readCookie();

      // If active group no longer exists → reset to personal
      if (saved.type === "group" && !data.find(g => g.id === saved.groupId)) {
        const reset: ActiveContext = { type: "personal" };
        setActiveContext(reset);
        writeCookie(reset);
        return;
      }

      // If still in a group → silently update members so banner + switcher stay fresh
      if (saved.type === "group") {
        const updatedGroup = data.find(g => g.id === saved.groupId);
        if (updatedGroup) {
          setActiveContext(prev => {
            if (prev.type !== "group") return prev;
            return { ...prev, groupMembers: updatedGroup.members };
          });
        }
      }
    } catch {
      setGroups([]);
    } finally {
      setLoadingGroups(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => { refreshGroups(); }, [refreshGroups]);

  // Poll every 10s — keeps member list fresh when someone joins or leaves
  useEffect(() => {
    const id = setInterval(refreshGroups, 10_000);
    return () => clearInterval(id);
  }, [refreshGroups]);

  /* ── Switch helpers ── */
  const switchToPersonal = useCallback(() => {
    const ctx: ActiveContext = { type: "personal" };
    setActiveContext(ctx);
    writeCookie(ctx);
  }, []);

  const switchToGroup = useCallback((group: Group) => {
    const ctx: ActiveContext = {
      type:         "group",
      groupId:      group.id,
      groupName:    group.name,
      groupMembers: group.members,
      role:         group.members.find(m => m.userId === group.ownerId)?.role ?? "MEMBER",
    };
    setActiveContext(ctx);
    writeCookie(ctx);
  }, []);

  return (
    <GroupContext.Provider value={{
      activeContext,
      isGroup: activeContext.type === "group",
      groups,
      loadingGroups,
      switchToPersonal,
      switchToGroup,
      refreshGroups,
    }}>
      {children}
    </GroupContext.Provider>
  );
}

/* ─── Hook ──────────────────────────────────────────────────────── */
export function useGroup() {
  const ctx = useContext(GroupContext);
  if (!ctx) throw new Error("useGroup must be used inside <GroupProvider>");
  return ctx;
}