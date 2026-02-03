import { auth } from "@/lib/auth";
import { readDb } from "@/lib/driveStore";
import { TasksContent } from "./TasksContent";
import type { Contact, Task } from "@/types";

export const dynamic = "force-dynamic";

export default async function TasksPage() {
  const session = await auth();

  if (!session) {
    return null;
  }

  let tasks: Task[] = [];
  let contacts: Contact[] = [];
  let error: string | null = null;

  try {
    const db = await readDb();
    tasks = db.tasks;
    contacts = db.contacts;
  } catch (e) {
    console.error("Failed to load tasks:", e);
    error = e instanceof Error ? e.message : "Failed to load tasks";
  }

  return <TasksContent tasks={tasks} contacts={contacts} error={error} />;
}
