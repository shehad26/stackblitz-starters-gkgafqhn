import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Employee, Store } from '../types';

interface AdminState {
  employees: Employee[];
  stores: Store[];
  selectedEmployee: Employee | null;
  selectedStore: Store | null;
  setSelectedEmployee: (employee: Employee | null) => void;
  setSelectedStore: (store: Store | null) => void;
  addEmployee: (employee: Employee) => void;
  updateEmployee: (employee: Employee) => void;
  deleteEmployee: (employeeId: string) => void;
  addStore: (store: Store) => void;
  updateStore: (store: Store) => void;
  deleteStore: (storeCode: string) => void;
  resetStore: () => void;
}

// Mock initial data
const mockEmployees: Employee[] = [
  {
    id: "EMP001",
    fullName: "John Doe",
    photoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
    assignedStore: "STORE-001",
    status: "active"
  },
  {
    id: "EMP002",
    fullName: "Jane Smith",
    photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    assignedStore: "STORE-001",
    status: "active"
  }
];

const mockStores: Store[] = [
  {
    code: "STORE-001",
    name: "Main Branch",
    location: "Downtown"
  }
];

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      employees: mockEmployees,
      stores: mockStores,
      selectedEmployee: null,
      selectedStore: null,
      setSelectedEmployee: (employee) => set({ selectedEmployee: employee }),
      setSelectedStore: (store) => set({ selectedStore: store }),
      addEmployee: (employee) =>
        set((state) => ({ employees: [...state.employees, employee] })),
      updateEmployee: (employee) =>
        set((state) => ({
          employees: state.employees.map((e) =>
            e.id === employee.id ? employee : e
          ),
        })),
      deleteEmployee: (employeeId) =>
        set((state) => ({
          employees: state.employees.filter((e) => e.id !== employeeId),
        })),
      addStore: (store) =>
        set((state) => ({ stores: [...state.stores, store] })),
      updateStore: (store) =>
        set((state) => ({
          stores: state.stores.map((s) =>
            s.code === store.code ? store : s
          ),
        })),
      deleteStore: (storeCode) =>
        set((state) => ({
          stores: state.stores.filter((s) => s.code !== storeCode),
        })),
      resetStore: () => set({ employees: mockEmployees, stores: mockStores }),
    }),
    {
      name: 'admin-data',
    }
  )
);