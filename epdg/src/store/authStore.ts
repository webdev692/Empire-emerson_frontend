import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type Role = 'admin' | 'company' | 'intern' | 'school';
export type AccountStatus = 'pending' | 'approved' | 'rejected';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: Role;
  status: AccountStatus;
  is_mentor?: boolean;
  force_password_change?: boolean;
  admin_role?: 'admin' | 'super_admin';
}

interface AuthStore {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: AuthUser, token: string) => void;
  clearAuth: () => void;
  patchUser: (updates: Partial<AuthUser>) => void;
  setToken: (token: string) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setAuth: (user, token) => {
        localStorage.setItem('token', token);
        set({ user, token, isAuthenticated: true });
      },

      clearAuth: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null, isAuthenticated: false });
      },

      patchUser: (updates) => set((s) => ({
        user: s.user ? { ...s.user, ...updates } : s.user,
      })),

      setToken: (token) => {
        localStorage.setItem('token', token);
        set({ token });
      },
    }),
    {
      name: 'auth-store',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
