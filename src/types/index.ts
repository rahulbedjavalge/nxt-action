// Type definitions for Nxt Action app

export type Priority = "low" | "medium" | "high";
export type ContactStatus = "active" | "waiting" | "closed";
export type Channel = "linkedin" | "email" | "call" | "whatsapp" | "inperson";
export type Direction = "outbound" | "inbound";
export type Outcome = "none" | "positive" | "rejected" | "scheduled" | "needs_info";
export type TaskStatus = "open" | "done";

export interface Contact {
  id: string;
  name: string;
  channel: Channel;
  notes: string;
  linkedinUrl?: string;
  email?: string;
  company?: string;
  role?: string;
  tags: string[];
  priority: Priority;
  status: ContactStatus;
  lastTouchedAt: string | null;
  nextFollowUpAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Interaction {
  id: string;
  contactId: string;
  channel: Channel;
  direction: Direction;
  occurredAt: string;
  summary: string;
  link?: string;
  outcome: Outcome;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  dueAt: string | null;
  priority: Priority;
  status: TaskStatus;
  contactId?: string;
  notes: string;
  createdAt: string;
}

export interface Database {
  version: number;
  contacts: Contact[];
  interactions: Interaction[];
  tasks: Task[];
}

export interface GoogleDriveFile {
  id: string;
  name: string;
  mimeType: string;
}

export interface ExtendedUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
}
