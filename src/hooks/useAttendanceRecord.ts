import { useState } from 'react';
import { useAttendanceStore } from '../store/useAttendanceStore';
import { determineCheckType } from '../utils/attendance';
import type { AttendanceRecord } from '../types';

export function useAttendanceRecord() {
  const [isProcessing, setIsProcessing] = useState(false);
  const { employees, attendanceRecords, addAttendanceRecord } = useAttendanceStore();

  const processAttendance = async (employeeId: string) => {
    setIsProcessing(true);
    try {
      const employee = employees.find((emp) => emp.id === employeeId);
      if (employee) {
        const checkType = determineCheckType(employeeId, attendanceRecords);
        const record: AttendanceRecord = {
          id: crypto.randomUUID(),
          employeeId: employee.id,
          storeCode: 'STORE-001',
          timestamp: new Date(),
          type: checkType,
        };
        addAttendanceRecord(record);
        return { success: true, employee, record };
      }
      return { success: false, error: 'Employee not found' };
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    processAttendance,
  };
}