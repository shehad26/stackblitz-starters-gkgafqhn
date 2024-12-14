import { formatTime } from '../../utils/attendance';
import { AttendanceStatusCell } from './AttendanceStatusCell';
import type { AttendanceRecord, Employee, Store } from '../../types';

interface Props {
  records: AttendanceRecord[];
  employees: Employee[];
  stores: Store[];
  showReport: boolean;
  selectedStore?: string;
}

export function ReportTable({ records, employees, stores, showReport, selectedStore }: Props) {
  if (!showReport) return null;

  const filteredEmployees = selectedStore 
    ? employees.filter(emp => emp.assignedStore === selectedStore)
    : employees;

  return (
    <div className="mt-6 bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Employee
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Store
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Login Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Logout Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Check-in
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredEmployees.map((employee) => {
              const employeeRecords = records.filter(r => r.employeeId === employee.id);
              const loginRecord = employeeRecords.find(r => r.type === 'check-in');
              const logoutRecord = employeeRecords.find(r => r.type === 'check-out');
              const store = stores.find(s => s.code === employee.assignedStore);

              return (
                <tr key={employee.id}>
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
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}