import { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { read, utils } from 'xlsx';
import { z } from 'zod';
import { Employee, Store } from '../../types';
import { validateEmployeeData, validateStoreData } from '../../utils/validation';

interface Props {
  type: 'employees' | 'stores';
  onImport: (data: Employee[] | Store[]) => void;
  onClose: () => void;
}

export function BulkImportModal({ type, onImport, onClose }: Props) {
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const data = await readFileData(file);
      const validatedData = validateData(data, type);
      onImport(validatedData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid file format');
    }
  };

  const readFileData = async (file: File) => {
    if (file.name.endsWith('.csv') || file.name.endsWith('.xlsx')) {
      const buffer = await file.arrayBuffer();
      const workbook = read(buffer);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      return utils.sheet_to_json(worksheet);
    }
    throw new Error('Unsupported file format. Please upload a CSV or Excel file.');
  };

  const validateData = (data: any[], type: 'employees' | 'stores') => {
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('No records found in the file');
    }

    return type === 'employees' 
      ? validateEmployeeData(data)
      : validateStoreData(data);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            Bulk Import {type === 'employees' ? 'Employees' : 'Stores'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-600 mb-2">
              Upload a CSV or Excel file containing {type === 'employees' ? 'employee' : 'store'} records
            </p>
            <input
              type="file"
              accept=".csv,.xlsx"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700"
            >
              Select File
            </label>
          </div>

          {error && (
            <p className="text-red-600 text-sm">{error}</p>
          )}

          <div className="text-sm text-gray-500">
            <p className="font-medium mb-1">Required Columns:</p>
            <ul className="list-disc pl-5 space-y-1">
              {type === 'employees' ? (
                <>
                  <li>id (e.g., EMP001)</li>
                  <li>fullName</li>
                  <li>photoUrl</li>
                  <li>assignedStore (store code)</li>
                  <li>status (active/inactive)</li>
                </>
              ) : (
                <>
                  <li>code (e.g., STORE001)</li>
                  <li>name</li>
                  <li>location</li>
                </>
              )}
            </ul>
          </div>

          <div className="mt-4">
            <a
              href={`/templates/${type}-template.xlsx`}
              download
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Download Template
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}