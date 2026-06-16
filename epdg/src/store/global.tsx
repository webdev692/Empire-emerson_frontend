import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// 1. User Type (for Hosea wiltord and Jonathan)
export interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'user';
}

// 2. Store interface (define the shape of our store)
interface GlobalStore {
    user: User | null; //current logged in user
    setUser: (user: User) => void; //function to update the user state
    login: (token: string, user: User) => void; //function to log in the user
    logout: () => void; //function to clear the user state on logout
}

// 3. Zustand store creation with persistence
export const useGlobalStore = create<GlobalStore>()(
    persist(
        (set) => ({
            //initial state
            user: null,

            //function to set user
            setUser: (user: User) => set({ user }),

            //login action
            login: (token: string, user: User) => {
                localStorage.setItem('token', token);
                set({ user });
            },

            //logout action
            logout: () => {
                localStorage.removeItem('token');
                set({ user: null });
            },
        }),
        {
            name: 'global-store', //name of the storage
            storage: createJSONStorage(() => localStorage), //using localStorage for persistence
        }
    )
);
