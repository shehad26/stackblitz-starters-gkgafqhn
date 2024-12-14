import { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useAttendanceStore } from '../store/useAttendanceStore';

export function QRScanner() {
  const [scanner, setScanner] = useState<Html5QrcodeScanner | null>(null);
  const { employees, addAttendanceRecord } = useAttendanceStore();

  useEffect(() => {
    const qrScanner = new Html5QrcodeScanner(
      'qr-reader',
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );

    setScanner(qrScanner);
    qrScanner.render(onScanSuccess, onScanError);

    return () => {
      if (scanner) {
        scanner.clear();
      }
    };
  }, []);

  const onScanSuccess = (decodedText: string) => {
    const employee = employees.find((emp) => emp.id === decodedText);
    
    if (employee) {
      const record: AttendanceRecord = {
        id: crypto.randomUUID(),
        employeeId: employee.id,
        storeCode: 'STORE-001', // This should come from context/state
        timestamp: new Date(),
        type: 'check-in', // Logic to determine check-in/out based on last record
      };
      
      addAttendanceRecord(record);
    }
  };

  const onScanError = (error: any) => {
    console.error('QR Scan Error:', error);
  };

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <div id="qr-reader" className="border rounded-lg overflow-hidden" />
    </div>
  );
}