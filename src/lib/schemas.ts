import { z } from "zod";

export const prioritySchema = z.enum(["low", "medium", "high"]);
export const contactStatusSchema = z.enum(["active", "waiting", "closed"]);
export const channelSchema = z.enum(["linkedin", "email", "call", "whatsapp", "inperson"]);
export const directionSchema = z.enum(["outbound", "inbound"]);
export const outcomeSchema = z.enum(["none", "positive", "rejected", "scheduled", "needs_info"]);
export const taskStatusSchema = z.enum(["open", "done"]);

export const contactSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "Name is required"),
  linkedinUrl: z.string().url().or(z.literal("")),
  email: z.string().email().optional().or(z.literal("")),
  company: z.string().optional(),
  role: z.string().optional(),
  tags: z.array(z.string()),
  priority: prioritySchema,
  status: contactStatusSchema,
  lastTouchedAt: z.string().nullable(),
  nextFollowUpAt: z.string().nullable(),
  notes: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const createContactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  channel: channelSchema.optional().default("linkedin"),
  notes: z.string().optional().default(""),
  linkedinUrl: z.string().optional().default(""),
  email: z.string().email().optional().or(z.literal("")),
  company: z.string().optional(),
  role: z.string().optional(),
  tags: z.array(z.string()).optional().default([]),
  priority: prioritySchema.optional().default("medium"),
  status: contactStatusSchema.optional().default("active"),
  nextFollowUpAt: z.string().nullable().optional(),
});

export const updateContactSchema = createContactSchema.partial().extend({
  lastTouchedAt: z.string().nullable().optional(),
  nextFollowUpAt: z.string().nullable().optional(),
  status: contactStatusSchema.optional(),
});

export const interactionSchema = z.object({
  id: z.string().uuid(),
  contactId: z.string().uuid(),
  channel: channelSchema,
  direction: directionSchema,
  occurredAt: z.string(),
  summary: z.string().min(1, "Summary is required"),
  link: z.string().url().optional().or(z.literal("")),
  outcome: outcomeSchema,
  createdAt: z.string(),
});

export const createInteractionSchema = z.object({
  contactId: z.string().uuid(),
  channel: channelSchema,
  direction: directionSchema,
  occurredAt: z.string().optional(),
  summary: z.string().min(1, "Summary is required"),
  link: z.string().url().optional().or(z.literal("")),
  outcome: outcomeSchema.optional().default("none"),
});

export const taskSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1, "Title is required"),
  dueAt: z.string().nullable(),
  priority: prioritySchema,
  status: taskStatusSchema,
  contactId: z.string().uuid().optional(),
  notes: z.string(),
  createdAt: z.string(),
});

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  dueAt: z.string().nullable().optional(),
  priority: prioritySchema.optional().default("medium"),
  contactId: z.string().uuid().optional(),
  notes: z.string().optional().default(""),
});

export const updateTaskSchema = createTaskSchema.partial().extend({
  status: taskStatusSchema.optional(),
});

export const databaseSchema = z.object({
  version: z.number(),
  contacts: z.array(contactSchema),
  interactions: z.array(interactionSchema),
  tasks: z.array(taskSchema),
});
