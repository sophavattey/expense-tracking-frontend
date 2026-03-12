"use client";

import { useState, useEffect, useCallback } from "react";
import { groupService } from "@/services/group.service";
import { useGroup } from "@/contexts/GroupContext";
import type { Group } from "@/types/group.types";

interface UseGroupsReturn {
  groups:              Group[];
  loading:             boolean;
  error:               string | null;
  refetch:             () => Promise<void>;
  createGroup:         (name: string) => Promise<Group>;
  joinGroup:           (inviteCode: string) => Promise<Group>;
  leaveGroup:          (groupId: string) => Promise<void>;
  removeMember:        (groupId: string, targetUserId: string) => Promise<void>;
  dissolveGroup:       (groupId: string) => Promise<void>;
  regenerateInvite:    (groupId: string) => Promise<Group>;
}

export function useGroups(): UseGroupsReturn {
  const [groups,  setGroups]  = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  // Keep GroupContext in sync whenever this hook mutates groups
  const { refreshGroups, switchToPersonal, activeContext } = useGroup();

  const fetchGroups = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await groupService.getMyGroups();
      setGroups(data);
    } catch (e: any) {
      setError(e.message || "Failed to load groups");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchGroups(); }, [fetchGroups]);

  const createGroup = useCallback(async (name: string): Promise<Group> => {
    const group = await groupService.create({ name });
    await fetchGroups();
    await refreshGroups();
    return group;
  }, [fetchGroups, refreshGroups]);

  const joinGroup = useCallback(async (inviteCode: string): Promise<Group> => {
    const group = await groupService.join({ inviteCode });
    await fetchGroups();
    await refreshGroups();
    return group;
  }, [fetchGroups, refreshGroups]);

  const leaveGroup = useCallback(async (groupId: string): Promise<void> => {
    await groupService.leave(groupId);
    // If currently viewing the group we just left, reset to personal
    if (activeContext.groupId === groupId) switchToPersonal();
    await fetchGroups();
    await refreshGroups();
  }, [fetchGroups, refreshGroups, activeContext, switchToPersonal]);

  const removeMember = useCallback(async (groupId: string, targetUserId: string): Promise<void> => {
    await groupService.removeMember(groupId, targetUserId);
    // Refresh local group list to reflect new member count
    await fetchGroups();
  }, [fetchGroups]);

  const dissolveGroup = useCallback(async (groupId: string): Promise<void> => {
    await groupService.dissolve(groupId);
    if (activeContext.groupId === groupId) switchToPersonal();
    await fetchGroups();
    await refreshGroups();
  }, [fetchGroups, refreshGroups, activeContext, switchToPersonal]);

  const regenerateInvite = useCallback(async (groupId: string): Promise<Group> => {
    const updated = await groupService.regenerateInviteCode(groupId);
    setGroups(prev => prev.map(g => g.id === groupId ? updated : g));
    return updated;
  }, []);

  return {
    groups,
    loading,
    error,
    refetch: fetchGroups,
    createGroup,
    joinGroup,
    leaveGroup,
    removeMember,
    dissolveGroup,
    regenerateInvite,
  };
}