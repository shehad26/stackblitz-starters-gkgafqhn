import { useState } from 'react';
import { Upload, Key, Clock, Timer, Save } from 'lucide-react';
import { useSettingsStore } from '../store/useSettingsStore';
import { useAuthStore } from '../store/useAuthStore';

export function SettingsPage() {
  const { settings, updateSettings } = useSettingsStore();
  const { changePassword } = useAuthStore();
  const [newPassword, setNewPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [saveMessage, setSaveMessage] = useState('');

  const handlePasswordChange = () => {
    if (newPassword.length < 6) {
      setPasswordMessage('Password must be at least 6 characters long');
      return;
    }
    changePassword(newPassword);
    setNewPassword('');
    setPasswordMessage('Password updated successfully');
    setTimeout(() => setPasswordMessage(''), 3000);
  };

  const handleSettingsSave = () => {
    setSaveMessage('Settings saved successfully');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Settings</h1>
        {saveMessage && (
          <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg flex items-center">
            <Save className="w-4 h-4 mr-2" />
            {saveMessage}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Logo Settings */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Upload className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold">Company Logo</h2>
          </div>
          
          <div className="space-y-4">
            {settings.logoUrl && (
              <div className="flex items-center space-x-4">
                <img 
                  src={settings.logoUrl} 
                  alt="Current Logo" 
                  className="h-12 w-auto"
                />
                <button
                  onClick={() => updateSettings({ logoUrl: undefined })}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Remove Logo
                </button>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Logo URL</label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Upload className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={settings.logoUrl || ''}
                  onChange={(e) => updateSettings({ logoUrl: e.target.value })}
                  placeholder="Enter logo URL (e.g., https://...)"
                  className="pl-10 block w-full rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-200 ease-in-out py-3"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Password Settings */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Key className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold">Admin Password</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="pl-10 block w-full rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-200 ease-in-out py-3"
                />
              </div>
              {passwordMessage && (
                <p className={`mt-2 text-sm ${
                  passwordMessage.includes('successfully') ? 'text-green-600' : 'text-red-600'
                }`}>
                  {passwordMessage}
                </p>
              )}
            </div>
            <button
              onClick={handlePasswordChange}
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 ease-in-out font-medium"
            >
              Update Password
            </button>
          </div>
        </div>

        {/* Attendance Rules */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold">Login Time</h2>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Store Login Time</label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Clock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="time"
                value={settings.loginTime}
                onChange={(e) => updateSettings({ loginTime: e.target.value })}
                className="pl-10 block w-full rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-200 ease-in-out py-3 pr-4"
                style={{ 
                  WebkitAppearance: 'none',
                  MozAppearance: 'none',
                  appearance: 'none',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 0.75rem center',
                  backgroundSize: '1rem',
                  paddingRight: '2.5rem'
                }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Timer className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold">Late Threshold</h2>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Late Threshold (minutes)</label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Timer className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                min="0"
                value={settings.lateThreshold}
                onChange={(e) => updateSettings({ lateThreshold: parseInt(e.target.value) })}
                className="pl-10 block w-full rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-200 ease-in-out py-3"
              />
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Number of minutes after login time before marking attendance as late
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSettingsSave}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 ease-in-out font-medium"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}