import { useState } from 'react';
import { Users, Building, Upload, Database } from 'lucide-react';
import { EmployeeFormModal } from '../components/admin/EmployeeFormModal';
import { StoreFormModal } from '../components/admin/StoreFormModal';
import { EditEmployeeModal } from '../components/admin/EditEmployeeModal';
import { BulkImportModal } from '../components/admin/BulkImportModal';
import { AttendanceDataTab } from '../components/admin/AttendanceDataTab';
import { useAdminStore } from '../store/useAdminStore';
import type { Employee, Store } from '../types';

type TabType = 'employees' | 'stores' | 'attendance';

export function AdminPage() {
  const [activeTab, setActiveTab] = useState<TabType>('employees');
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [showStoreModal, setShowStoreModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [showBulkImport, setShowBulkImport] = useState<'employees' | 'stores' | null>(null);
  
  const {
    employees,
    stores,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    addStore,
    deleteStore,
  } = useAdminStore();

  const handleEmployeeSubmit = (data: Employee) => {
    addEmployee(data);
    setShowEmployeeModal(false);
  };

  const handleStoreSubmit = (data: Store) => {
    addStore(data);
    setShowStoreModal(false);
  };

  const handleBulkImport = (data: Employee[] | Store[]) => {
    if (showBulkImport === 'employees') {
      data.forEach(item => addEmployee(item as Employee));
    } else {
      data.forEach(item => addStore(item as Store));
    }
    setShowBulkImport(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('employees')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'employees' ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
          >
            <Users className="w-5 h-5 inline-block mr-2" />
            Employees
          </button>
          <button
            onClick={() => setActiveTab('stores')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'stores' ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
          >
            <Building className="w-5 h-5 inline-block mr-2" />
            Stores
          </button>
          <button
            onClick={() => setActiveTab('attendance')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'attendance' ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
          >
            <Database className="w-5 h-5 inline-block mr-2" />
            Attendance Data
          </button>
        </div>
      </div>

      {activeTab === 'attendance' ? (
        <AttendanceDataTab />
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {activeTab === 'employees' && (
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <Users className="w-8 h-8 text-blue-600" />
                  <h2 className="text-xl font-semibold">Employee Management</h2>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setShowBulkImport('employees')}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Bulk Import
                  </button>
                  <button
                    onClick={() => setShowEmployeeModal(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Add Employee
                  </button>
                </div>
              </div>

              <div className="mt-6">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Employee
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Store Assignment
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {employees.map((employee) => {
                        const store = stores.find(s => s.code === employee.assignedStore);
                        return (
                          <tr key={employee.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                  <img
                                    className="h-10 w-10 rounded-full"
                                    src={employee.photoUrl}
                                    alt={employee.fullName}
                                  />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {employee.fullName}
                                  </div>
                                  <div className="text-sm text-gray-500">{employee.id}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {store ? `${store.name} (${store.code})` : employee.assignedStore}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                employee.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {employee.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                onClick={() => setEditingEmployee(employee)}
                                className="text-blue-600 hover:text-blue-900 mr-4"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => deleteEmployee(employee.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'stores' && (
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <Building className="w-8 h-8 text-green-600" />
                  <h2 className="text-xl font-semibold">Store Management</h2>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setShowBulkImport('stores')}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Bulk Import
                  </button>
                  <button
                    onClick={() => setShowStoreModal(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Add Store
                  </button>
                </div>
              </div>

              <div className="mt-6">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Store Code
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Location
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {stores.map((store) => (
                        <tr key={store.code}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {store.code}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {store.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {store.location}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => deleteStore(store.code)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {showEmployeeModal && (
        <EmployeeFormModal
          onSubmit={handleEmployeeSubmit}
          onClose={() => setShowEmployeeModal(false)}
        />
      )}

      {showStoreModal && (
        <StoreFormModal
          onSubmit={handleStoreSubmit}
          onClose={() => setShowStoreModal(false)}
        />
      )}

      {editingEmployee && (
        <EditEmployeeModal
          employee={editingEmployee}
          onClose={() => setEditingEmployee(null)}
        />
      )}

      {showBulkImport && (
        <BulkImportModal
          type={showBulkImport}
          onImport={handleBulkImport}
          onClose={() => setShowBulkImport(null)}
        />
      )}
    </div>
  );
}