import { useState } from 'react';
import { Trash2, Edit2, Save, X } from 'lucide-react';
import { useAttendanceStore } from '../../store/useAttendanceStore';
import { useAdminStore } from '../../store/useAdminStore';
import { formatTimestamp } from '../../utils/date';
import type { AttendanceRecord } from '../../types';

export function AttendanceDataTab() {
  const { attendanceRecords, deleteAttendanceRecord, updateAttendanceRecord } = useAttendanceStore();
  const { employees, stores } = useAdminStore();
  const [editingRecord, setEditingRecord] = useState<AttendanceRecord | null>(null);
  const [editedTime, setEditedTime] = useState('');

  const handleEdit = (record: AttendanceRecord) => {
    setEditingRecord(record);
    setEditedTime(new Date(record.timestamp).toISOString().slice(0, 16));
  };

  const handleSave = () => {
    if (editingRecord) {
      updateAttendanceRecord({
        ...editingRecord,
        timestamp: new Date(editedTime),
      });
      setEditingRecord(null);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Employee
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Store
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Timestamp
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {attendanceRecords.map((record) => {
              const employee = employees.find(e => e.id === record.employeeId);
              const store = stores.find(s => s.code === record.storeCode);
              const isEditing = editingRecord?.id === record.id;

              return (
                <tr key={record.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-full"
                          src={employee?.photoUrl}
                          alt={employee?.fullName}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {employee?.fullName}
                        </div>
                        <div className="text-sm text-gray-500">{record.employeeId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {store ? `${store.name} (${store.code})` : record.storeCode}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {isEditing ? (
                      <input
                        type="datetime-local"
                        value={editedTime}
                        onChange={(e) => setEditedTime(e.target.value)}
                        className="border rounded px-2 py-1"
                      />
                    ) : (
                      formatTimestamp(record.timestamp)
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      record.type === 'check-in' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {record.type === 'check-in' ? 'Login' : 'Logout'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      {isEditing ? (
                        <>
                          <button
                            onClick={handleSave}
                            className="text-green-600 hover:text-green-900"
                          >
                            <Save className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => setEditingRecord(null)}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEdit(record)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => deleteAttendanceRecord(record.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}