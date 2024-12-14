import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { CheckCircle, XCircle } from 'lucide-react';
import { useAttendanceStore } from '../store/useAttendanceStore';
import { Employee } from '../types';

export function AttendanceDisplay() {
  const { attendanceRecords, employees } = useAttendanceStore();
  const [latestRecord, setLatestRecord] = useState<{
    employee: Employee;
    timestamp: Date;
    type: 'check-in' | 'check-out';
  } | null>(null);

  useEffect(() => {
    const record = attendanceRecords[attendanceRecords.length - 1];
    if (record) {
      const employee = employees.find((emp) => emp.id === record.employeeId);
      if (employee) {
        setLatestRecord({
          employee,
          timestamp: record.timestamp,
          type: record.type,
        });
      }
    }
  }, [attendanceRecords]);

  if (!latestRecord) return null;

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center space-x-4">
        <img
          src={latestRecord.employee.photoUrl}
          alt={latestRecord.employee.fullName}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div>
          <h3 className="text-lg font-semibold">{latestRecord.employee.fullName}</h3>
          <p className="text-gray-600">
            {format(latestRecord.timestamp, 'PPpp')}
          </p>
        </div>
        {latestRecord.type === 'check-in' ? (
          <CheckCircle className="w-8 h-8 text-green-500 ml-auto" />
        ) : (
          <XCircle className="w-8 h-8 text-red-500 ml-auto" />
        )}
      </div>
      <div className="mt-4 text-center">
        <p className="text-lg font-medium text-green-600">
          {latestRecord.type === 'check-in' ? 'Check-in' : 'Check-out'} Successful
        </p>
      </div>
    </div>
  );
}