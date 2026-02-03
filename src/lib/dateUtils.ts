import {
  addDays,
  addWeeks,
  addMonths,
  startOfDay,
  endOfDay,
  isToday,
  isBefore,
  isAfter,
  parseISO,
  format,
  formatDistanceToNow,
  nextMonday,
  nextTuesday,
  nextWednesday,
  nextThursday,
  nextFriday,
  nextSaturday,
  nextSunday,
} from "date-fns";

export function getStartOfToday(): Date {
  return startOfDay(new Date());
}

export function getEndOfToday(): Date {
  return endOfDay(new Date());
}

export function addDaysToDate(date: Date, days: number): Date {
  return addDays(date, days);
}

export function addWeeksToDate(date: Date, weeks: number): Date {
  return addWeeks(date, weeks);
}

export function addMonthsToDate(date: Date, months: number): Date {
  return addMonths(date, months);
}

export function isDueToday(dateStr: string | null): boolean {
  if (!dateStr) return false;
  const date = parseISO(dateStr);
  return isToday(date);
}

export function isOverdue(dateStr: string | null): boolean {
  if (!dateStr) return false;
  const date = parseISO(dateStr);
  return isBefore(startOfDay(date), getStartOfToday());
}

export function isDueTodayOrBefore(dateStr: string | null): boolean {
  if (!dateStr) return false;
  const date = parseISO(dateStr);
  return !isAfter(startOfDay(date), getStartOfToday());
}

export function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  try {
    return format(parseISO(dateStr), "MMM d, yyyy");
  } catch {
    return "—";
  }
}

export function formatDateShort(dateStr: string | null): string {
  if (!dateStr) return "—";
  try {
    return format(parseISO(dateStr), "MMM d");
  } catch {
    return "—";
  }
}

export function formatDateTime(dateStr: string | null): string {
  if (!dateStr) return "—";
  try {
    return format(parseISO(dateStr), "MMM d, yyyy h:mm a");
  } catch {
    return "—";
  }
}

export function formatRelative(dateStr: string | null): string {
  if (!dateStr) return "—";
  try {
    return formatDistanceToNow(parseISO(dateStr), { addSuffix: true });
  } catch {
    return "—";
  }
}

export function toISOString(date: Date): string {
  return date.toISOString();
}

export function getDefaultFollowUpDate(): string {
  return addDays(new Date(), 3).toISOString();
}

export function snooze2Days(currentDate: string | null): string {
  const base = currentDate ? parseISO(currentDate) : new Date();
  return addDays(base, 2).toISOString();
}

export function snooze7Days(currentDate: string | null): string {
  const base = currentDate ? parseISO(currentDate) : new Date();
  return addDays(base, 7).toISOString();
}

export function getNextDay(day: string): Date {
  const today = new Date();
  const dayFunctions: Record<string, (date: Date) => Date> = {
    monday: nextMonday,
    tuesday: nextTuesday,
    wednesday: nextWednesday,
    thursday: nextThursday,
    friday: nextFriday,
    saturday: nextSaturday,
    sunday: nextSunday,
  };
  const fn = dayFunctions[day.toLowerCase()];
  return fn ? fn(today) : today;
}
