import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Search, Scan } from 'lucide-react';
import { useAttendanceStore } from '../../store/useAttendanceStore';
import { useAdminStore } from '../../store/useAdminStore';
import { determineCheckType, validateAttendanceRecord } from '../../utils/attendance';
import type { AttendanceRecord } from '../../types';

const schema = z.object({
  employeeId: z.string().min(1, 'Employee ID is required'),
});

type FormData = z.infer<typeof schema>;

export function AttendanceInput() {
  const [error, setError] = useState<string | null>(null);
  const { employees } = useAdminStore();
  const { attendanceRecords, addAttendanceRecord } = useAttendanceStore();
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    setError(null);
    const employee = employees.find((emp) => emp.id === data.employeeId);
    
    if (!employee) {
      setError('Employee not found');
      return;
    }

    if (employee.status === 'inactive') {
      setError('Employee is inactive');
      return;
    }

    const checkType = determineCheckType(data.employeeId, attendanceRecords);
    
    if (!checkType) {
      setError('Already completed attendance for today');
      return;
    }

    const validation = validateAttendanceRecord(data.employeeId, checkType, attendanceRecords);
    if (!validation.valid) {
      setError(validation.message);
      return;
    }

    const record: AttendanceRecord = {
      id: crypto.randomUUID(),
      employeeId: employee.id,
      storeCode: employee.assignedStore,
      timestamp: new Date(),
      type: checkType,
    };
    
    addAttendanceRecord(record);
    reset();
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Attendance Input</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                {...register('employeeId')}
                type="text"
                placeholder="Enter Employee ID"
                className="block w-full pl-10 pr-12 py-3 text-base rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-200 ease-in-out"
                autoComplete="off"
                autoFocus
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <Scan className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            {errors.employeeId && (
              <p className="mt-2 text-sm text-red-600">{errors.employeeId.message}</p>
            )}
            {error && (
              <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 ease-in-out font-medium text-base"
          >
            Record Attendance
          </button>
        </form>
      </div>
    </div>
  );
}