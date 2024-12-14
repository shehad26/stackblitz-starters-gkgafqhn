import { AttendanceInput } from '../components/attendance/AttendanceInput';
import { AttendanceDisplay } from '../components/attendance/AttendanceDisplay';

export function HomePage() {
  return (
    <div className="space-y-8">
      <AttendanceInput />
      <AttendanceDisplay />
    </div>
  );
}