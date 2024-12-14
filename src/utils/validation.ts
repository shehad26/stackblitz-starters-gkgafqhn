import { z } from 'zod';
import type { Employee, Store } from '../types';

const employeeSchema = z.object({
  id: z.string().min(1, 'Employee ID is required'),
  fullName: z.string().min(1, 'Full name is required'),
  photoUrl: z.string().url('Invalid photo URL'),
  assignedStore: z.string().min(1, 'Store assignment is required'),
  status: z.enum(['active', 'inactive']),
});

const storeSchema = z.object({
  code: z.string().min(1, 'Store code is required'),
  name: z.string().min(1, 'Store name is required'),
  location: z.string().min(1, 'Location is required'),
});

export function validateEmployeeData(data: any[]): Employee[] {
  return data.map((item, index) => {
    try {
      // Ensure all required fields exist and convert to proper format
      const employee = {
        id: String(item.id || ''),
        fullName: String(item.fullName || ''),
        photoUrl: String(item.photoUrl || ''),
        assignedStore: String(item.assignedStore || ''),
        status: (String(item.status || '').toLowerCase() as 'active' | 'inactive') || 'active'
      };

      const result = employeeSchema.safeParse(employee);
      
      if (!result.success) {
        const errors = result.error.errors.map(err => 
          `${err.path.join('.')}: ${err.message}`
        ).join(', ');
        throw new Error(`Invalid data in row ${index + 1}: [ ${errors} ]`);
      }

      return result.data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`Invalid data in row ${index + 1}`);
    }
  });
}

export function validateStoreData(data: any[]): Store[] {
  return data.map((item, index) => {
    try {
      // Ensure all required fields exist and convert to proper format
      const store = {
        code: String(item.code || ''),
        name: String(item.name || ''),
        location: String(item.location || '')
      };

      const result = storeSchema.safeParse(store);
      
      if (!result.success) {
        const errors = result.error.errors.map(err => 
          `${err.path.join('.')}: ${err.message}`
        ).join(', ');
        throw new Error(`Invalid data in row ${index + 1}: [ ${errors} ]`);
      }

      return result.data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`Invalid data in row ${index + 1}`);
    }
  });
}