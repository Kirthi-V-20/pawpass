import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  fullName: string;
  email: string;
  password: string;
}

interface AuthStore {
  users: User[];
  user: User | null;
  isAuthenticated: boolean;

  signUp: (
    fullName: string,
    email: string,
    password: string
  ) => void;

  signIn: (
    email: string,
    password: string
  ) => boolean;

  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      users: [],
      user: null,
      isAuthenticated: false,

      signUp: (fullName, email, password) => {
        const existingUser = get().users.find(
          (user) => user.email.toLowerCase() === email.toLowerCase()
        );

        if (existingUser) {
          return;
        }

        const newUser: User = {
          id: crypto.randomUUID(),
          fullName,
          email,
          password,
        };

        set((state) => ({
          users: [...state.users, newUser],
          user: newUser,
          isAuthenticated: true,
        }));
      },

      signIn: (email, password) => {
        const existingUser = get().users.find(
          (user) =>
            user.email.toLowerCase() === email.toLowerCase() &&
            user.password === password
        );

        if (!existingUser) {
          return false;
        }

        set({
          user: existingUser,
          isAuthenticated: true,
        });

        return true;
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: "pawpass-auth-storage",
    }
  )
);