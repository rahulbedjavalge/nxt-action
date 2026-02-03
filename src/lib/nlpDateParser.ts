import { addDays, addWeeks, addMonths, parse, isValid } from "date-fns";
import { getNextDay } from "./dateUtils";

/**
 * Parses natural language date expressions into ISO date strings.
 * Supports: "today", "tomorrow", "in X days/weeks/months", "next monday", etc.
 */
export function parseNaturalDate(input: string): string | null {
  if (!input) return null;

  const normalized = input.toLowerCase().trim();
  const now = new Date();

  // Today
  if (normalized === "today" || normalized === "now") {
    return now.toISOString();
  }

  // Tomorrow
  if (normalized === "tomorrow") {
    return addDays(now, 1).toISOString();
  }

  // In X days/weeks/months
  const inPattern = /^in\s+(\d+)\s+(day|days|week|weeks|month|months)$/;
  const inMatch = normalized.match(inPattern);
  if (inMatch) {
    const amount = parseInt(inMatch[1], 10);
    const unit = inMatch[2];

    if (unit.startsWith("day")) {
      return addDays(now, amount).toISOString();
    } else if (unit.startsWith("week")) {
      return addWeeks(now, amount).toISOString();
    } else if (unit.startsWith("month")) {
      return addMonths(now, amount).toISOString();
    }
  }

  // X days/weeks from now
  const fromNowPattern = /^(\d+)\s+(day|days|week|weeks)\s*(from now)?$/;
  const fromNowMatch = normalized.match(fromNowPattern);
  if (fromNowMatch) {
    const amount = parseInt(fromNowMatch[1], 10);
    const unit = fromNowMatch[2];

    if (unit.startsWith("day")) {
      return addDays(now, amount).toISOString();
    } else if (unit.startsWith("week")) {
      return addWeeks(now, amount).toISOString();
    }
  }

  // Next [day of week]
  const nextDayPattern = /^next\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday)$/;
  const nextDayMatch = normalized.match(nextDayPattern);
  if (nextDayMatch) {
    return getNextDay(nextDayMatch[1]).toISOString();
  }

  // Day of week only
  const dayOnlyPattern = /^(monday|tuesday|wednesday|thursday|friday|saturday|sunday)$/;
  const dayOnlyMatch = normalized.match(dayOnlyPattern);
  if (dayOnlyMatch) {
    return getNextDay(dayOnlyMatch[1]).toISOString();
  }

  // End of week/month
  if (normalized === "end of week" || normalized === "eow") {
    return getNextDay("friday").toISOString();
  }

  // Try standard date formats
  const formats = [
    "yyyy-MM-dd",
    "MM/dd/yyyy",
    "MM-dd-yyyy",
    "MMM d, yyyy",
    "MMM d",
    "MMMM d, yyyy",
    "MMMM d",
  ];

  for (const fmt of formats) {
    try {
      const parsed = parse(normalized, fmt, now);
      if (isValid(parsed)) {
        return parsed.toISOString();
      }
    } catch {
      // Continue to next format
    }
  }

  // If no match, return null
  return null;
}

/**
 * Validates if a string can be parsed as a date.
 */
export function isValidDateInput(input: string): boolean {
  return parseNaturalDate(input) !== null;
}
