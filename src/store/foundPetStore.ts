import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { FoundPetReport } from "@/types/foundPet";

interface FoundPetStore {
  foundPets: FoundPetReport[];

  addFoundPet: (report: FoundPetReport) => void;

  updateFoundPet: (
    id: string,
    data: Partial<FoundPetReport>,
  ) => void;

  deleteFoundPet: (id: string) => void;

  getFoundPetById: (
    id: string,
  ) => FoundPetReport | undefined;
}

export const useFoundPetStore =
  create<FoundPetStore>()(
    persist(
      (set, get) => ({
        foundPets: [],

        addFoundPet: (report) => {
          set((state) => ({
            foundPets: [
              ...state.foundPets,
              report,
            ],
          }));
        },

        updateFoundPet: (id, data) => {
          set((state) => ({
            foundPets: state.foundPets.map(
              (report) => {
                if (report.id !== id) {
                  return report;
                }

                const {
                  finderId,
                  ...updateData
                } = data;

                return {
                  ...report,
                  ...updateData,
                };
              },
            ),
          }));
        },

        deleteFoundPet: (id) => {
          set((state) => ({
            foundPets: state.foundPets.filter(
              (report) => report.id !== id,
            ),
          }));
        },

        getFoundPetById: (id) => {
          return get().foundPets.find(
            (report) => report.id === id,
          );
        },
      }),
      {
        name: "pawpass-found-pets",
      },
    ),
  );