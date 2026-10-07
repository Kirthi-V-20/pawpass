import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Profile {
  fullName: string;
  email: string;
  phone: string;
  photo?: string;
}

interface ProfileStore {
  profiles: Record<string, Profile>;

  getProfile: (userId: string) => Profile | null;

  setProfile: (
    userId: string,
    profile: Profile,
  ) => void;

  updateProfile: (
    userId: string,
    data: Partial<Profile>,
  ) => void;

  clearProfile: (userId: string) => void;
}

export const useProfileStore =
  create<ProfileStore>()(
    persist(
      (set, get) => ({
        profiles: {},

        getProfile: (userId) => {
          return get().profiles[userId] ?? null;
        },

        setProfile: (userId, profile) => {
          set((state) => ({
            profiles: {
              ...state.profiles,
              [userId]: profile,
            },
          }));
        },

        updateProfile: (userId, data) => {
          set((state) => {
            const existingProfile =
              state.profiles[userId];

            if (!existingProfile) {
              return state;
            }

            return {
              profiles: {
                ...state.profiles,
                [userId]: {
                  ...existingProfile,
                  ...data,
                },
              },
            };
          });
        },

        clearProfile: (userId) => {
          set((state) => {
            const profiles = {
              ...state.profiles,
            };

            delete profiles[userId];

            return {
              profiles,
            };
          });
        },
      }),
      {
        name: "pawpass-profile",
      },
    ),
  );