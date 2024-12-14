import { Settings } from '../../types';

interface Props {
  timestamp: Date;
  settings: Settings;
}

export function AttendanceStatusBadge({ timestamp, settings }: Props) {
  const [hours, minutes] = settings.loginTime.split(':').map(Number);
  const loginTime = hours * 60 + minutes;
  const recordTime = timestamp.getHours() * 60 + timestamp.getMinutes();
  const minutesLate = recordTime - loginTime;

  if (minutesLate <= 0) {
    return (
      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
        Present
      </span>
    );
  }

  if (minutesLate <= settings.lateThreshold) {
    return (
      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
        Late ({minutesLate}m)
      </span>
    );
  }

  return (
    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
      Very Late ({minutesLate}m)
    </span>
  );
}