export type GroupRole = "OWNER" | "MEMBER";

export interface GroupMember {
  id: string;
  userId: string;
  name: string;
  email: string;
  avatar?: string;
  role: GroupRole;
  joinedAt: string;
}

export interface Group {
  id: string;
  name: string;
  inviteCode: string;
  inviteCodeExpiresAt: string;   // ISO datetime
  inviteCodeExpired: boolean;    // convenience flag from backend
  ownerId: string;
  members: GroupMember[];
  createdAt: string;
}

/** What's stored in the cookie and React context */
export interface ActiveContext {
  type: "personal" | "group";
  groupId?: string;
  groupName?: string;
  groupMembers?: GroupMember[];
  role?: GroupRole;
}