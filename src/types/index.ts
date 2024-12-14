// Add to the existing Settings interface
export interface Settings {
  loginTime: string;
  lateThreshold: number;
  workDays: ('monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday')[];
  logoUrl?: string; // Add this line
}

// Update the defaultSettings
export const defaultSettings: Settings = {
  loginTime: '09:00',
  lateThreshold: 15,
  workDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
  logoUrl: undefined,
};