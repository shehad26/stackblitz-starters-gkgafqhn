import { format } from 'date-fns';

export function ensureDate(date: Date | string | number): Date {
  if (date instanceof Date) return date;
  if (typeof date === 'string' || typeof date === 'number') {
    const parsed = new Date(date);
    if (isNaN(parsed.getTime())) {
      throw new Error('Invalid date value');
    }
    return parsed;
  }
  throw new Error('Invalid date value');
}

export function formatTime(date: Date | string | number, formatStr: string = 'HH:mm:ss'): string {
  return format(ensureDate(date), formatStr);
}

export function formatTimestamp(date: Date | string | number): string {
  return format(ensureDate(date), 'PPpp');
}

export function isSameDay(date1: Date | string | number, date2: Date | string | number): boolean {
  return format(ensureDate(date1), 'yyyy-MM-dd') === format(ensureDate(date2), 'yyyy-MM-dd');
}