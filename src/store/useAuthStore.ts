import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  isAuthenticated: boolean;
  password: string;
  login: (password: string) => boolean;
  logout: () => void;
  changePassword: (newPassword: string) => void;
}

const DEFAULT_PASSWORD = 'admin123'; // Default password

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      password: DEFAULT_PASSWORD,
      login: (password: string) => {
        const isValid = password === get().password;
        if (isValid) {
          set({ isAuthenticated: true });
        }
        return isValid;
      },
      logout: () => set({ isAuthenticated: false }),
      changePassword: (newPassword: string) => set({ password: newPassword }),
    }),
    {
      name: 'auth-store',
    }
  )
);