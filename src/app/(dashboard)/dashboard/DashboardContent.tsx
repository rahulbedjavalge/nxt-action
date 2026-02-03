"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardBody, Badge, Button, EmptyState } from "@/components/ui";
import { useToast } from "@/components/ToastProvider";
import type { Task } from "@/types";
import { isDueTodayOrBefore, isOverdue, formatDateShort, formatRelative } from "@/lib/dateUtils";

interface DashboardContentProps {
  tasks: Task[];
  error: string | null;
}

export function DashboardContent({ tasks, error }: DashboardContentProps) {
  const router = useRouter();
  const { addToast } = useToast();
  const [loading, setLoading] = useState<string | null>(null);

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
        <Button onClick={() => router.refresh()}>Retry</Button>
      </div>
    );
  }

  const openTasks = tasks.filter((t) => t.status === "open");
  const overdueTasks = openTasks.filter((t) => t.dueAt && isOverdue(t.dueAt));
  const dueTodayTasks = openTasks.filter(
    (t) => t.dueAt && isDueTodayOrBefore(t.dueAt) && !isOverdue(t.dueAt)
  );
  const upcomingTasks = openTasks.filter(
    (t) => !t.dueAt || (!isDueTodayOrBefore(t.dueAt) && !isOverdue(t.dueAt))
  );

  const handleTaskDone = async (taskId: string) => {
    setLoading(taskId);
    try {
      await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "done" }),
      });
      addToast("Done!", "success");
      router.refresh();
    } catch {
      addToast("Failed", "error");
    } finally {
      setLoading(null);
    }
  };

  const handleSnooze = async (taskId: string, days: number) => {
    setLoading(taskId);
    try {
      const newDate = new Date();
      newDate.setDate(newDate.getDate() + days);
      await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dueAt: newDate.toISOString() }),
      });
      addToast(`Moved`, "success");
      router.refresh();
    } catch {
      addToast("Failed", "error");
    } finally {
      setLoading(null);
    }
  };

  const TaskRow = ({ task, isOverdueStyle = false }: { task: Task; isOverdueStyle?: boolean }) => (
    <div className={`p-4 border-b border-gray-100 dark:border-gray-700 last:border-0 ${isOverdueStyle ? "bg-red-50 dark:bg-red-900/10" : ""}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-900 dark:text-gray-100">{task.title}</p>
          <div className="flex items-center gap-3 mt-1 text-sm text-gray-500 dark:text-gray-400">
            {task.dueAt && <span>{formatDateShort(task.dueAt)} ({formatRelative(task.dueAt)})</span>}
          </div>
          {task.notes && <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{task.notes}</p>}
        </div>
        <div className="flex gap-2">
          <Button size="sm" onClick={() => handleTaskDone(task.id)} disabled={loading === task.id}>Done</Button>
          <Button size="sm" variant="outline" onClick={() => handleSnooze(task.id, 1)} disabled={loading === task.id}>Tomorrow</Button>
          <Button size="sm" variant="ghost" onClick={() => handleSnooze(task.id, 7)} disabled={loading === task.id}>+7d</Button>
        </div>
      </div>
    </div>
  );

  const totalDue = overdueTasks.length + dueTodayTasks.length;

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {totalDue > 0 ? `${totalDue} thing${totalDue > 1 ? "s" : ""} to do` : "All done!"}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
        </p>
      </div>

      <div className="space-y-6 max-w-2xl">
        {overdueTasks.length > 0 && (
          <Card>
            <CardHeader className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-red-600 dark:text-red-400">Overdue</h2>
              <Badge variant="danger">{overdueTasks.length}</Badge>
            </CardHeader>
            <CardBody className="p-0">
              {overdueTasks.map((task) => <TaskRow key={task.id} task={task} isOverdueStyle />)}
            </CardBody>
          </Card>
        )}

        {dueTodayTasks.length > 0 && (
          <Card>
            <CardHeader className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Today</h2>
              <Badge variant="warning">{dueTodayTasks.length}</Badge>
            </CardHeader>
            <CardBody className="p-0">
              {dueTodayTasks.map((task) => <TaskRow key={task.id} task={task} />)}
            </CardBody>
          </Card>
        )}

        {upcomingTasks.length > 0 && (
          <Card>
            <CardHeader className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Upcoming</h2>
              <Badge>{upcomingTasks.length}</Badge>
            </CardHeader>
            <CardBody className="p-0">
              {upcomingTasks.map((task) => <TaskRow key={task.id} task={task} />)}
            </CardBody>
          </Card>
        )}

        {openTasks.length === 0 && (
          <Card>
            <CardBody>
              <EmptyState title="No tasks yet" description="Click + to add your first task" />
            </CardBody>
          </Card>
        )}
      </div>
    </>
  );
}
