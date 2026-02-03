"use client";

import { useState, useEffect, useCallback } from "react";
import { QuickAddModal } from "@/components/QuickAddModal";
import { useRouter } from "next/navigation";

export function QuickAddWrapper() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Check if user is typing in an input or textarea
    const target = e.target as HTMLElement;
    if (
      target.tagName === "INPUT" ||
      target.tagName === "TEXTAREA" ||
      target.isContentEditable
    ) {
      return;
    }

    if (e.key === "n" || e.key === "N") {
      e.preventDefault();
      setIsOpen(true);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  const handleSuccess = () => {
    router.refresh();
  };

  return (
    <>
      {/* Floating Quick Add Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center text-2xl transition-transform hover:scale-110 z-40"
        title="Quick Add (N)"
      >
        +
      </button>

      <QuickAddModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSuccess={handleSuccess}
      />
    </>
  );
}
