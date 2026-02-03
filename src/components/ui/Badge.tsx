import { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info" | "priority-low" | "priority-medium" | "priority-high";
  size?: "sm" | "md";
}

export function Badge({ children, variant = "default", size = "sm" }: BadgeProps) {
  const baseStyles = "inline-flex items-center font-medium rounded-full";

  const variants = {
    default: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
    success: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    warning: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
    danger: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
    info: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
    "priority-low": "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400",
    "priority-medium": "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
    "priority-high": "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${sizes[size]}`}>
      {children}
    </span>
  );
}
