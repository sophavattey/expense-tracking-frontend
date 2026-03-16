import { apiFetch } from "./api-client";
import type { Group } from "@/types/group.types";

export interface CreateGroupRequest { name: string; }
export interface JoinGroupRequest   { inviteCode: string; }
export interface UpdateGroupRequest { name: string; }

export const groupService = {
  getMyGroups: () =>
    apiFetch<Group[]>("/api/groups/mine"),

  getGroup: (groupId: string) =>
    apiFetch<Group>(`/api/groups/${groupId}`),

  create: (data: CreateGroupRequest) =>
    apiFetch<Group>("/api/groups", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  join: (data: JoinGroupRequest) =>
    apiFetch<Group>("/api/groups/join", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  rename: (groupId: string, data: UpdateGroupRequest) =>
    apiFetch<Group>(`/api/groups/${groupId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  leave: (groupId: string) =>
    apiFetch<void>(`/api/groups/${groupId}/leave`, { method: "DELETE" }),

  removeMember: (groupId: string, targetUserId: string) =>
    apiFetch<void>(`/api/groups/${groupId}/members/${targetUserId}`, { method: "DELETE" }),

  dissolve: (groupId: string) =>
    apiFetch<void>(`/api/groups/${groupId}`, { method: "DELETE" }),

  regenerateInviteCode: (groupId: string) =>
    apiFetch<Group>(`/api/groups/${groupId}/invite-code/regenerate`, { method: "POST" }),
};