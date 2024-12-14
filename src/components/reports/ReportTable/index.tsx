import { ReportTableHeader } from './ReportTableHeader';
import { ReportTableBody } from './ReportTableBody';
import type { AttendanceRecord, Employee, Store } from '../../../types';

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
          <ReportTableHeader />
          <ReportTableBody
            records={records}
            employees={filteredEmployees}
            stores={stores}
          />
        </table>
      </div>
    </div>
  );
}