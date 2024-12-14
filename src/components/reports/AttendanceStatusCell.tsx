import { LogIn } from 'lucide-react';
import { calculateLateStatus } from '../../utils/attendance';
import { useSettingsStore } from '../../store/useSettingsStore';
import type { AttendanceRecord } from '../../types';

interface Props {
  record: AttendanceRecord;
}

export function AttendanceStatusCell({ record }: Props) {
  const { settings } = useSettingsStore();
  const { isLate, minutesLate } = calculateLateStatus(new Date(record.timestamp), settings);

  return (
    <div className="flex items-center space-x-2">
      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
        !isLate ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
      }`}>
        {!isLate ? 'On-Time' : `Late (${minutesLate}m)`}
      </span>
      <LogIn className="w-4 h-4 text-green-500" />
    </div>
  );
}