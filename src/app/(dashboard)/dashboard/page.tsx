import { auth } from "@/lib/auth";
import { readDb } from "@/lib/driveStore";
import { DashboardContent } from "./DashboardContent";
import type { Task } from "@/types";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    return null;
  }

  let tasks: Task[] = [];
  let error: string | null = null;

  try {
    const db = await readDb();
    tasks = db.tasks;
  } catch (e) {
    console.error("Failed to load data:", e);
    error = e instanceof Error ? e.message : "Failed to load data";
  }

  return <DashboardContent tasks={tasks} error={error} />;
}
