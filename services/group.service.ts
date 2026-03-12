import { apiFetch } from "./api-client";
import type { Group } from "@/types/group.types";

export interface CreateGroupRequest {
  name: string;
}

export interface JoinGroupRequest {
  inviteCode: string;
}

export const groupService = {
  /** All groups the current user belongs to */
  getMyGroups: () =>
    apiFetch<Group[]>("/api/groups/mine"),

  /** Single group by id */
  getGroup: (groupId: string) =>
    apiFetch<Group>(`/api/groups/${groupId}`),

  /** Create a new group — caller becomes owner */
  create: (data: CreateGroupRequest) =>
    apiFetch<Group>("/api/groups", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  /** Join a group via 8-char invite code */
  join: (data: JoinGroupRequest) =>
    apiFetch<Group>("/api/groups/join", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  /** Leave a group (non-owners only) */
  leave: (groupId: string) =>
    apiFetch<void>(`/api/groups/${groupId}/leave`, { method: "DELETE" }),

  /** Remove a specific member — owner only */
  removeMember: (groupId: string, targetUserId: string) =>
    apiFetch<void>(`/api/groups/${groupId}/members/${targetUserId}`, { method: "DELETE" }),

  /** Dissolve the group entirely — owner only */
  dissolve: (groupId: string) =>
    apiFetch<void>(`/api/groups/${groupId}`, { method: "DELETE" }),

  /** Regenerate invite code — owner only */
  regenerateInviteCode: (groupId: string) =>
    apiFetch<Group>(`/api/groups/${groupId}/invite-code/regenerate`, { method: "POST" }),
};