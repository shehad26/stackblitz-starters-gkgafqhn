import { useAttendanceStore } from '../../store/useAttendanceStore';
import { useSettingsStore } from '../../store/useSettingsStore';
import { AttendanceStatusBadge } from './AttendanceStatusBadge';
import { formatTime, isSameDay } from '../../utils/date';
import type { Employee } from '../../types';

interface Props {
  employee: Employee;
  date: Date;
}

export function EmployeeAttendanceRow({ employee, date }: Props) {
  const { attendanceRecords } = useAttendanceStore();
  const { settings } = useSettingsStore();
  
  const dayRecords = attendanceRecords.filter(record => 
    record.employeeId === employee.id && 
    isSameDay(new Date(record.timestamp), date)
  );

  const checkIn = dayRecords.find(r => r.type === 'check-in');
  const checkOut = dayRecords.find(r => r.type === 'check-out');

  const isWorkDay = settings.workDays.includes(
    date.toLocaleDateString('en-US', { weekday: 'lowercase' })
  );

  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            <img
              className="h-10 w-10 rounded-full"
              src={employee.photoUrl}
              alt={employee.fullName}
            />
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              {employee.fullName}
            </div>
            <div className="text-sm text-gray-500">{employee.id}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {checkIn ? formatTime(new Date(checkIn.timestamp)) : '-'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {checkOut ? formatTime(new Date(checkOut.timestamp)) : '-'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {!isWorkDay ? (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
            Non-working Day
          </span>
        ) : checkIn ? (
          <AttendanceStatusBadge
            timestamp={new Date(checkIn.timestamp)}
            type="check-in"
          />
        ) : (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
            Absent
          </span>
        )}
      </td>
    </tr>
  );
}