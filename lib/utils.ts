import { clsx, type ClassValue } from "clsx";
import { endOfWeek, format, startOfWeek } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatWeekRangeByDay(
  date: Date,
  pattern: string = "dd.MM.yy",
): string {
  const { start, end } = weekRangeByDay(date);
  return `${format(start, pattern)} - ${format(end, pattern)}`;
}

export function weekRangeByDay(day: Date): { start: Date; end: Date } {
  return {
    start: startOfWeek(day, { weekStartsOn: 1 }),
    end: endOfWeek(day, { weekStartsOn: 1 }),
  };
}
