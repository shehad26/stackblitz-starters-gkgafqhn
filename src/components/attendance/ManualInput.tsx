import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAttendanceRecord } from '../../hooks/useAttendanceRecord';
import { validateEmployeeId } from '../../utils/attendance';

const schema = z.object({
  employeeId: z.string().min(1, 'Employee ID is required').refine(validateEmployeeId, {
    message: 'Invalid employee ID format',
  }),
});

type FormData = z.infer<typeof schema>;

export function ManualInput() {
  const { isProcessing, processAttendance } = useAttendanceRecord();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    const result = await processAttendance(data.employeeId);
    if (result.success) {
      reset();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto mt-4">
      <div className="flex space-x-2">
        <div className="flex-1">
          <input
            {...register('employeeId')}
            type="text"
            placeholder="Enter Employee ID"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isProcessing}
          />
          {errors.employeeId && (
            <p className="mt-1 text-sm text-red-600">{errors.employeeId.message}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={isProcessing}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          Submit
        </button>
      </div>
    </form>
  );
}