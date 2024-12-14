import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import type { AttendanceRecord } from '../types';

export function exportToPDF(records: AttendanceRecord[]) {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(16);
  doc.text('Attendance Report', 14, 15);
  
  // Add date
  doc.setFontSize(11);
  doc.text(`Generated on: ${format(new Date(), 'PPpp')}`, 14, 25);

  const tableData = records.map(record => [
    record.employeeId,
    record.storeCode,
    format(new Date(record.timestamp), 'yyyy-MM-dd'),
    format(new Date(record.timestamp), 'HH:mm:ss'),
    record.type === 'check-in' ? 'Login' : 'Logout',
  ]);

  (doc as any).autoTable({
    startY: 35,
    head: [['Employee ID', 'Store', 'Date', 'Time', 'Type']],
    body: tableData,
  });

  doc.save(`attendance-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
}

export function exportToExcel(records: AttendanceRecord[]) {
  const data = records.map(record => ({
    'Employee ID': record.employeeId,
    'Store': record.storeCode,
    'Date': format(new Date(record.timestamp), 'yyyy-MM-dd'),
    'Time': format(new Date(record.timestamp), 'HH:mm:ss'),
    'Type': record.type === 'check-in' ? 'Login' : 'Logout',
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Attendance');
  XLSX.writeFile(wb, `attendance-report-${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
}