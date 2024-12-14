import { format, parse, differenceInMinutes, startOfDay, endOfDay } from 'date-fns';
import type { AttendanceRecord, Settings } from '../types';

export function determineCheckType(
  employeeId: string,
  records: AttendanceRecord[]
): 'check-in' | 'check-out' | null {
  const today = new Date();
  const todayStart = startOfDay(today);
  const todayEnd = endOfDay(today);

  const todayRecords = records.filter((record) => {
    const recordDate = new Date(record.timestamp);
    return recordDate >= todayStart && recordDate <= todayEnd && record.employeeId === employeeId;
  });

  if (todayRecords.length === 0) return 'check-in';
  if (todayRecords.length === 1 && todayRecords[0].type === 'check-in') return 'check-out';
  return null;
}

export function validateAttendanceRecord(
  employeeId: string,
  type: 'check-in' | 'check-out',
  records: AttendanceRecord[]
): { valid: boolean; message?: string } {
  const today = new Date();
  const todayStart = startOfDay(today);
  const todayEnd = endOfDay(today);

  const todayRecords = records.filter((record) => {
    const recordDate = new Date(record.timestamp);
    return recordDate >= todayStart && recordDate <= todayEnd && record.employeeId === employeeId;
  });

  if (type === 'check-in') {
    const hasCheckIn = todayRecords.some(r => r.type === 'check-in');
    if (hasCheckIn) {
      return { valid: false, message: 'Already logged in today' };
    }
  } else {
    const hasCheckOut = todayRecords.some(r => r.type === 'check-out');
    if (hasCheckOut) {
      return { valid: false, message: 'Already logged out today' };
    }
    const hasCheckIn = todayRecords.some(r => r.type === 'check-in');
    if (!hasCheckIn) {
      return { valid: false, message: 'Must log in before logging out' };
    }
  }

  return { valid: true };
}

export function calculateLateStatus(timestamp: Date, settings: Settings): {
  isLate: boolean;
  minutesLate: number;
} {
  const [hours, minutes] = settings.loginTime.split(':').map(Number);
  const expectedLoginTime = new Date(timestamp);
  expectedLoginTime.setHours(hours, minutes, 0, 0);

  const minutesLate = differenceInMinutes(timestamp, expectedLoginTime);
  
  if (minutesLate <= 0) {
    return { isLate: false, minutesLate: 0 };
  }

  return {
    isLate: minutesLate > settings.lateThreshold,
    minutesLate,
  };
}

export function formatTimestamp(date: Date | string): string {
  const dateObj = date instanceof Date ? date : new Date(date);
  return format(dateObj, 'PPpp');
}

export function formatTime(date: Date | string, formatStr: string = 'HH:mm:ss'): string {
  const dateObj = date instanceof Date ? date : new Date(date);
  return format(dateObj, formatStr);
}

export function isWorkDay(date: Date, workDays: string[]): boolean {
  const dayName = format(date, 'EEEE').toLowerCase();
  return workDays.includes(dayName);
}