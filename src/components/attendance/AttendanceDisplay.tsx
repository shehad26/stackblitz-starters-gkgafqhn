import { useState, useEffect } from 'react';
import { LogIn, LogOut } from 'lucide-react';
import { useAttendanceStore } from '../../store/useAttendanceStore';
import { useAdminStore } from '../../store/useAdminStore';
import { formatTimestamp } from '../../utils/date';
import type { Employee } from '../../types';

export function AttendanceDisplay() {
  const { attendanceRecords } = useAttendanceStore();
  const { employees } = useAdminStore();
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
          timestamp: new Date(record.timestamp),
          type: record.type,
        });

        const timer = setTimeout(() => {
          setLatestRecord(null);
        }, 5000);

        return () => clearTimeout(timer);
      }
    }
  }, [attendanceRecords, employees]);

  if (!latestRecord) return null;

  return (
    <div className="max-w-md mx-auto mt-8">
      <div className="bg-white p-8 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-[1.02]">
        <div className="flex items-center space-x-6">
          <div className="flex-shrink-0">
            <img
              src={latestRecord.employee.photoUrl}
              alt={latestRecord.employee.fullName}
              className="w-20 h-20 rounded-full object-cover ring-4 ring-blue-50"
            />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900">{latestRecord.employee.fullName}</h3>
            <p className="text-gray-500 mt-1">
              {formatTimestamp(latestRecord.timestamp)}
            </p>
          </div>
          <div className="flex-shrink-0">
            {latestRecord.type === 'check-in' ? (
              <div className="p-3 bg-green-50 rounded-full">
                <LogIn className="w-8 h-8 text-green-500" />
              </div>
            ) : (
              <div className="p-3 bg-red-50 rounded-full">
                <LogOut className="w-8 h-8 text-red-500" />
              </div>
            )}
          </div>
        </div>
        <div className="mt-6 text-center">
          <div className={`inline-flex items-center px-4 py-2 rounded-full ${
            latestRecord.type === 'check-in' 
              ? 'bg-green-50 text-green-700' 
              : 'bg-red-50 text-red-700'
          }`}>
            <span className="text-lg font-medium">
              {latestRecord.type === 'check-in' ? 'Login' : 'Logout'} Successful
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}