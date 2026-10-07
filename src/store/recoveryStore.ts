import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { RecoveryConnection } from "@/types/recovery";

interface RecoveryStore {
  recoveries: RecoveryConnection[];

  addRecovery: (
    recovery: RecoveryConnection,
  ) => void;

  updateRecovery: (
    id: string,
    data: Partial<RecoveryConnection>,
  ) => void;

  getRecoveryById: (
    id: string,
  ) => RecoveryConnection | undefined;

  getRecoveriesByUser: (
    userId: string,
  ) => RecoveryConnection[];

  deleteRecovery: (id: string) => void;
}

export const useRecoveryStore =
  create<RecoveryStore>()(
    persist(
      (set, get) => ({
        recoveries: [],

        addRecovery: (recovery) => {
          set((state) => ({
            recoveries: [
              recovery,
              ...state.recoveries,
            ],
          }));
        },

        updateRecovery: (id, data) => {
          set((state) => ({
            recoveries: state.recoveries.map(
              (recovery) =>
                recovery.id === id
                  ? {
                      ...recovery,
                      ...data,
                    }
                  : recovery,
            ),
          }));
        },

        getRecoveryById: (id) => {
          return get().recoveries.find(
            (recovery) =>
              recovery.id === id,
          );
        },

        getRecoveriesByUser: (userId) => {
          return get().recoveries.filter(
            (recovery) =>
              recovery.ownerId === userId ||
              recovery.finderId === userId,
          );
        },

        deleteRecovery: (id) => {
          set((state) => ({
            recoveries:
              state.recoveries.filter(
                (recovery) =>
                  recovery.id !== id,
              ),
          }));
        },
      }),
      {
        name: "pawpass-recoveries",
      },
    ),
  );