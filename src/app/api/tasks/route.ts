import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { readDb, writeDb, checkRateLimit } from "@/lib/driveStore";
import { createTaskSchema } from "@/lib/schemas";
import { v4 as uuid } from "uuid";
import type { Task } from "@/types";

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await readDb();
    
    // Sort by dueAt ascending, null values at end
    const tasks = [...db.tasks].sort((a, b) => {
      if (!a.dueAt && !b.dueAt) return 0;
      if (!a.dueAt) return 1;
      if (!b.dueAt) return -1;
      return new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime();
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error("GET /api/tasks error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!(await checkRateLimit())) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    const body = await request.json();
    const validatedData = createTaskSchema.parse(body);

    const db = await readDb();

    // Verify contact exists if contactId provided
    if (validatedData.contactId) {
      const contactExists = db.contacts.some((c) => c.id === validatedData.contactId);
      if (!contactExists) {
        return NextResponse.json({ error: "Contact not found" }, { status: 404 });
      }
    }

    const now = new Date().toISOString();
    const newTask: Task = {
      id: uuid(),
      title: validatedData.title,
      dueAt: validatedData.dueAt || null,
      priority: validatedData.priority,
      status: "open",
      contactId: validatedData.contactId,
      notes: validatedData.notes,
      createdAt: now,
    };

    db.tasks.push(newTask);
    await writeDb(db);

    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error("POST /api/tasks error:", error);
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Validation error", details: error }, { status: 400 });
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
