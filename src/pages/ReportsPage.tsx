import { useState } from 'react';
import { Calendar, CalendarDays, CalendarRange } from 'lucide-react';
import { ReportFilters } from '../components/reports/ReportFilters';
import { ReportTable } from '../components/reports/ReportTable';
import { useAttendanceStore } from '../store/useAttendanceStore';
import { useAdminStore } from '../store/useAdminStore';
import type { AttendanceRecord } from '../types';

export function ReportsPage() {
  const [activeReport, setActiveReport] = useState<'daily' | 'monthly' | 'custom'>('daily');
  const [filteredRecords, setFilteredRecords] = useState<AttendanceRecord[]>([]);
  const [showReport, setShowReport] = useState(false);
  const [selectedStore, setSelectedStore] = useState<string>();
  const { attendanceRecords } = useAttendanceStore();
  const { employees, stores } = useAdminStore();

  const handleFilter = (filters: {
    startDate: Date;
    endDate: Date;
    storeCode?: string;
    month?: string;
  }) => {
    let filtered = [...attendanceRecords];

    // Apply date filters
    if (activeReport === 'monthly' && filters.month) {
      const [year, month] = filters.month.split('-').map(Number);
      filtered = filtered.filter((record) => {
        const date = new Date(record.timestamp);
        return date.getFullYear() === year && date.getMonth() === month - 1;
      });
    } else {
      const startDate = new Date(filters.startDate);
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = new Date(filters.endDate);
      endDate.setHours(23, 59, 59, 999);

      filtered = filtered.filter((record) => {
        const recordDate = new Date(record.timestamp);
        return recordDate >= startDate && recordDate <= endDate;
      });
    }

    // Apply store filter
    if (filters.storeCode) {
      filtered = filtered.filter((record) => record.storeCode === filters.storeCode);
      setSelectedStore(filters.storeCode);
    } else {
      setSelectedStore(undefined);
    }

    setFilteredRecords(filtered);
    setShowReport(true);
  };

  const clearReport = () => {
    setShowReport(false);
    setFilteredRecords([]);
    setSelectedStore(undefined);
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Attendance Reports</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button
          onClick={() => {
            setActiveReport('daily');
            clearReport();
          }}
          className={`p-6 rounded-lg shadow text-left ${
            activeReport === 'daily' ? 'bg-blue-50 ring-2 ring-blue-500' : 'bg-white'
          }`}
        >
          <div className="flex items-center space-x-3">
            <Calendar className="w-8 h-8 text-blue-600" />
            <h2 className="text-xl font-semibold">Daily Report</h2>
          </div>
          <p className="mt-2 text-gray-600">View today's attendance records</p>
        </button>

        <button
          onClick={() => {
            setActiveReport('monthly');
            clearReport();
          }}
          className={`p-6 rounded-lg shadow text-left ${
            activeReport === 'monthly' ? 'bg-blue-50 ring-2 ring-blue-500' : 'bg-white'
          }`}
        >
          <div className="flex items-center space-x-3">
            <CalendarDays className="w-8 h-8 text-green-600" />
            <h2 className="text-xl font-semibold">Monthly Report</h2>
          </div>
          <p className="mt-2 text-gray-600">View monthly attendance summary</p>
        </button>

        <button
          onClick={() => {
            setActiveReport('custom');
            clearReport();
          }}
          className={`p-6 rounded-lg shadow text-left ${
            activeReport === 'custom' ? 'bg-blue-50 ring-2 ring-blue-500' : 'bg-white'
          }`}
        >
          <div className="flex items-center space-x-3">
            <CalendarRange className="w-8 h-8 text-purple-600" />
            <h2 className="text-xl font-semibold">Custom Report</h2>
          </div>
          <p className="mt-2 text-gray-600">Generate report for custom date range</p>
        </button>
      </div>

      {activeReport && (
        <div className="mt-8">
          <ReportFilters
            reportType={activeReport}
            onFilter={handleFilter}
            records={filteredRecords}
          />
          
          <ReportTable
            records={filteredRecords}
            employees={employees}
            stores={stores}
            showReport={showReport}
            selectedStore={selectedStore}
          />
        </div>
      )}
    </div>
  );
}