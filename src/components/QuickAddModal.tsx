"use client";

import { useState, useEffect, useCallback } from "react";
import { Modal, Input, Textarea, Button } from "./ui";
import { useToast } from "./ToastProvider";
import { parseNaturalDate } from "@/lib/nlpDateParser";

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function QuickAddModal({ isOpen, onClose, onSuccess }: QuickAddModalProps) {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    followUp: "in 3 days",
    notes: "",
  });

  const resetForm = useCallback(() => {
    setFormData({
      title: "",
      followUp: "in 3 days",
      notes: "",
    });
  }, []);

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen, resetForm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      addToast("Title is required", "error");
      return;
    }

    setLoading(true);

    try {
      const dueAt = parseNaturalDate(formData.followUp);

      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          dueAt,
          notes: formData.notes,
          priority: "medium",
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to create task");
      }

      addToast("Added!", "success");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error:", error);
      addToast("Failed to add", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Quick Add" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="What do you need to do?"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Follow up with John about the proposal"
          autoFocus
        />

        <Input
          label="When?"
          value={formData.followUp}
          onChange={(e) => setFormData({ ...formData, followUp: e.target.value })}
          placeholder="tomorrow, in 3 days, next monday"
        />

        <Textarea
          label="Notes (optional)"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Any extra details..."
          rows={3}
        />

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
