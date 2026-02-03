import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { readDb, writeDb, checkRateLimit } from "@/lib/driveStore";
import { updateTaskSchema } from "@/lib/schemas";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!(await checkRateLimit())) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    const { id } = await params;
    const body = await request.json();
    const validatedData = updateTaskSchema.parse(body);

    const db = await readDb();
    const taskIndex = db.tasks.findIndex((t) => t.id === id);

    if (taskIndex === -1) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // Verify contact exists if contactId provided
    if (validatedData.contactId) {
      const contactExists = db.contacts.some((c) => c.id === validatedData.contactId);
      if (!contactExists) {
        return NextResponse.json({ error: "Contact not found" }, { status: 404 });
      }
    }

    const updatedTask = {
      ...db.tasks[taskIndex],
      ...validatedData,
    };

    db.tasks[taskIndex] = updatedTask;
    await writeDb(db);

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error("PATCH /api/tasks/[id] error:", error);
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Validation error", details: error }, { status: 400 });
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!(await checkRateLimit())) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    const { id } = await params;
    const db = await readDb();
    const taskIndex = db.tasks.findIndex((t) => t.id === id);

    if (taskIndex === -1) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    db.tasks.splice(taskIndex, 1);
    await writeDb(db);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/tasks/[id] error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
