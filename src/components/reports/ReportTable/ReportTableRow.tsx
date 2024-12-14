import { formatTime } from '../../../utils/date';
import { AttendanceStatusCell } from '../AttendanceStatusCell';
import type { AttendanceRecord, Employee, Store } from '../../../types';

interface Props {
  employee: Employee;
  records: AttendanceRecord[];
  store?: Store;
}

export function ReportTableRow({ employee, records, store }: Props) {
  const loginRecord = records.find(r => r.type === 'check-in');
  const logoutRecord = records.find(r => r.type === 'check-out');

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
        {store ? `${store.name} (${store.code})` : '-'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {loginRecord ? formatTime(loginRecord.timestamp, 'yyyy-MM-dd') : '-'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {loginRecord ? formatTime(loginRecord.timestamp) : '-'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {logoutRecord ? formatTime(logoutRecord.timestamp) : '-'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          loginRecord ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {loginRecord ? 'Present' : 'Absent'}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {loginRecord && <AttendanceStatusCell record={loginRecord} />}
      </td>
    </tr>
  );
}