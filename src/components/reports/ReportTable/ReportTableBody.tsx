import { ReportTableRow } from './ReportTableRow';
import type { AttendanceRecord, Employee, Store } from '../../../types';

interface Props {
  records: AttendanceRecord[];
  employees: Employee[];
  stores: Store[];
}

export function ReportTableBody({ records, employees, stores }: Props) {
  return (
    <tbody className="bg-white divide-y divide-gray-200">
      {employees.map((employee) => (
        <ReportTableRow
          key={employee.id}
          employee={employee}
          records={records.filter(r => r.employeeId === employee.id)}
          store={stores.find(s => s.code === employee.assignedStore)}
        />
      ))}
    </tbody>
  );
}