"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardBody,
  Badge,
  Button,
  Input,
  Textarea,
  Select,
  Modal,
  EmptyState,
} from "@/components/ui";
import { useToast } from "@/components/ToastProvider";
import type { Task, Contact } from "@/types";
import { formatDateShort, isOverdue, isDueTodayOrBefore } from "@/lib/dateUtils";
import { parseNaturalDate } from "@/lib/nlpDateParser";

interface TasksContentProps {
  tasks: Task[];
  contacts: Contact[];
  error: string | null;
}

const priorityOptions = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

export function TasksContent({ tasks, contacts, error }: TasksContentProps) {
  const router = useRouter();
  const { addToast } = useToast();
  const [loading, setLoading] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filter, setFilter] = useState<"all" | "open" | "done">("open");

  const [newTask, setNewTask] = useState({
    title: "",
    dueAt: "",
    priority: "medium",
    contactId: "",
    notes: "",
  });

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true;
    return task.status === filter;
  });

  // Sort: open first, then by due date, overdue first
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (a.status !== b.status) {
      return a.status === "open" ? -1 : 1;
    }
    if (!a.dueAt && !b.dueAt) return 0;
    if (!a.dueAt) return 1;
    if (!b.dueAt) return -1;
    return new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime();
  });

  const handleAddTask = async () => {
    if (!newTask.title.trim()) {
      addToast("Title is required", "error");
      return;
    }

    setLoading("new");

    try {
      const dueAt = newTask.dueAt ? parseNaturalDate(newTask.dueAt) : null;

      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTask.title,
          dueAt,
          priority: newTask.priority,
          contactId: newTask.contactId || undefined,
          notes: newTask.notes,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to create task");
      }

      addToast("Task created!", "success");
      setShowAddModal(false);
      setNewTask({
        title: "",
        dueAt: "",
        priority: "medium",
        contactId: "",
        notes: "",
      });
      router.refresh();
    } catch {
      addToast("Failed to create task", "error");
    } finally {
      setLoading(null);
    }
  };

  const handleToggleStatus = async (taskId: string, currentStatus: string) => {
    setLoading(taskId);

    try {
      const newStatus = currentStatus === "open" ? "done" : "open";

      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        throw new Error("Failed to update task");
      }

      addToast(newStatus === "done" ? "Task completed!" : "Task reopened", "success");
      router.refresh();
    } catch {
      addToast("Failed to update task", "error");
    } finally {
      setLoading(null);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    setLoading(taskId);

    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete task");
      }

      addToast("Task deleted", "success");
      router.refresh();
    } catch {
      addToast("Failed to delete task", "error");
    } finally {
      setLoading(null);
    }
  };

  const contactOptions = [
    { value: "", label: "No linked contact" },
    ...contacts.map((c) => ({ value: c.id, label: c.name })),
  ];

  const filterOptions = [
    { value: "open", label: "Open" },
    { value: "done", label: "Done" },
    { value: "all", label: "All" },
  ];

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Tasks</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {tasks.filter((t) => t.status === "open").length} open tasks
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select
            options={filterOptions}
            value={filter}
            onChange={(e) => setFilter(e.target.value as "all" | "open" | "done")}
            className="w-32"
          />
          <Button onClick={() => setShowAddModal(true)}>+ Add Task</Button>
        </div>
      </div>

      <Card>
        <CardBody className="p-0">
          {sortedTasks.length === 0 ? (
            <EmptyState
              title={filter === "open" ? "No open tasks" : "No tasks found"}
              description={
                tasks.length === 0
                  ? "Add your first task to get started"
                  : "Try changing the filter"
              }
              action={
                tasks.length === 0 ? (
                  <Button onClick={() => setShowAddModal(true)}>Add Task</Button>
                ) : undefined
              }
            />
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {sortedTasks.map((task) => {
                const linkedContact = task.contactId
                  ? contacts.find((c) => c.id === task.contactId)
                  : null;
                const isTaskOverdue =
                  task.status === "open" && task.dueAt && isOverdue(task.dueAt);
                const isDueToday =
                  task.status === "open" &&
                  task.dueAt &&
                  isDueTodayOrBefore(task.dueAt) &&
                  !isTaskOverdue;

                return (
                  <div
                    key={task.id}
                    className={`p-4 ${
                      isTaskOverdue
                        ? "bg-red-50 dark:bg-red-900/10"
                        : isDueToday
                        ? "bg-yellow-50 dark:bg-yellow-900/10"
                        : ""
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <button
                        onClick={() => handleToggleStatus(task.id, task.status)}
                        disabled={loading === task.id}
                        className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                          task.status === "done"
                            ? "bg-green-500 border-green-500 text-white"
                            : "border-gray-300 dark:border-gray-600 hover:border-green-500"
                        }`}
                      >
                        {task.status === "done" && "✓"}
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p
                            className={`font-medium ${
                              task.status === "done"
                                ? "text-gray-400 dark:text-gray-500 line-through"
                                : "text-gray-900 dark:text-gray-100"
                            }`}
                          >
                            {task.title}
                          </p>
                          <Badge
                            variant={
                              `priority-${task.priority}` as
                                | "priority-low"
                                | "priority-medium"
                                | "priority-high"
                            }
                            size="sm"
                          >
                            {task.priority}
                          </Badge>
                          {isTaskOverdue && (
                            <Badge variant="danger" size="sm">
                              Overdue
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-sm text-gray-500 dark:text-gray-400">
                          {task.dueAt && <span>Due: {formatDateShort(task.dueAt)}</span>}
                          {linkedContact && (
                            <Link
                              href={`/contacts/${linkedContact.id}`}
                              className="text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              {linkedContact.name}
                            </Link>
                          )}
                        </div>
                        {task.notes && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {task.notes}
                          </p>
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteTask(task.id)}
                        disabled={loading === task.id}
                      >
                        🗑️
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardBody>
      </Card>

      {/* Add Task Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Task"
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="Title *"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            placeholder="What needs to be done?"
            autoFocus
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Due Date"
              value={newTask.dueAt}
              onChange={(e) => setNewTask({ ...newTask, dueAt: e.target.value })}
              placeholder="tomorrow, in 3 days"
            />
            <Select
              label="Priority"
              options={priorityOptions}
              value={newTask.priority}
              onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
            />
          </div>
          <Select
            label="Linked Contact"
            options={contactOptions}
            value={newTask.contactId}
            onChange={(e) => setNewTask({ ...newTask, contactId: e.target.value })}
          />
          <Textarea
            label="Notes"
            value={newTask.notes}
            onChange={(e) => setNewTask({ ...newTask, notes: e.target.value })}
            placeholder="Additional details..."
            rows={2}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddTask} disabled={loading === "new"}>
              {loading === "new" ? "Adding..." : "Add Task"}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
