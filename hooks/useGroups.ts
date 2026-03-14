import { useState, useEffect, useCallback } from "react";
import { groupService } from "@/services/group.service";
import { useGroup } from "@/contexts/GroupContext";
import type { Group } from "@/types/group.types";

export function useGroups() {
  const [groups,  setGroups]  = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  const { refreshGroups, switchToPersonal, activeContext } = useGroup();

  const fetch = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const data = await groupService.getMyGroups();
      setGroups(data);
    } catch (e: any) {
      setError(e.message || "Failed to load groups");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const refetch = useCallback(async () => {
    await fetch();
    await refreshGroups();
  }, [fetch, refreshGroups]);

  const createGroup = useCallback(async (name: string): Promise<Group> => {
    const group = await groupService.create({ name });
    await refetch();
    return group;
  }, [refetch]);

  const joinGroup = useCallback(async (inviteCode: string): Promise<Group> => {
    const group = await groupService.join({ inviteCode });
    await refetch();
    return group;
  }, [refetch]);

  const renameGroup = useCallback(async (groupId: string, name: string): Promise<Group> => {
    const group = await groupService.rename(groupId, { name });
    await refetch();
    return group;
  }, [refetch]);

  const leaveGroup = useCallback(async (groupId: string) => {
    await groupService.leave(groupId);
    // If we're currently in this group, switch back to personal
    if (activeContext.groupId === groupId) switchToPersonal();
    await refetch();
  }, [activeContext.groupId, switchToPersonal, refetch]);

  const removeMember = useCallback(async (groupId: string, targetUserId: string) => {
    await groupService.removeMember(groupId, targetUserId);
    await refetch();
  }, [refetch]);

  const dissolveGroup = useCallback(async (groupId: string) => {
    await groupService.dissolve(groupId);
    // If we were in this group, drop back to personal
    if (activeContext.groupId === groupId) switchToPersonal();
    await refetch();
  }, [activeContext.groupId, switchToPersonal, refetch]);

  const regenerateInvite = useCallback(async (groupId: string): Promise<Group> => {
    const group = await groupService.regenerateInviteCode(groupId);
    await refetch();
    return group;
  }, [refetch]);

  return {
    groups, loading, error,
    refetch,
    createGroup,
    joinGroup,
    renameGroup,
    leaveGroup,
    removeMember,
    dissolveGroup,
    regenerateInvite,
  };
}