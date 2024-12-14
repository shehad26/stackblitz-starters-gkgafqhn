import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AttendanceRecord } from '../types';

interface AttendanceState {
  attendanceRecords: AttendanceRecord[];
  addAttendanceRecord: (record: AttendanceRecord) => void;
  updateAttendanceRecord: (record: AttendanceRecord) => void;
  deleteAttendanceRecord: (id: string) => void;
  getEmployeeRecords: (employeeId: string, date: Date) => AttendanceRecord[];
  resetAttendanceRecords: () => void;
}

export const useAttendanceStore = create<AttendanceState>()(
  persist(
    (set, get) => ({
      attendanceRecords: [],
      addAttendanceRecord: (record) =>
        set((state) => ({
          attendanceRecords: [...state.attendanceRecords, {
            ...record,
            timestamp: new Date(record.timestamp),
          }],
        })),
      updateAttendanceRecord: (record) =>
        set((state) => ({
          attendanceRecords: state.attendanceRecords.map((r) =>
            r.id === record.id ? { ...record, timestamp: new Date(record.timestamp) } : r
          ),
        })),
      deleteAttendanceRecord: (id) =>
        set((state) => ({
          attendanceRecords: state.attendanceRecords.filter((r) => r.id !== id),
        })),
      getEmployeeRecords: (employeeId, date) => {
        return get().attendanceRecords.filter(
          (record) => 
            record.employeeId === employeeId &&
            new Date(record.timestamp).toDateString() === date.toDateString()
        );
      },
      resetAttendanceRecords: () => set({ attendanceRecords: [] }),
    }),
    {
      name: 'attendance-records',
    }
  )
);