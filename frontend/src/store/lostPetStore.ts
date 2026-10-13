import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { LostPetReport } from "@/types/lostPet";

interface LostPetStore {
  lostPets: LostPetReport[];

  addLostPet: (report: LostPetReport) => void;

  updateLostPet: (
    id: string,
    data: Partial<LostPetReport>,
  ) => void;

  deleteLostPet: (id: string) => void;

  getLostPetById: (
    id: string,
  ) => LostPetReport | undefined;

  getActiveLostPetByPetId: (
    petId: string,
  ) => LostPetReport | undefined;
}

export const useLostPetStore =
  create<LostPetStore>()(
    persist(
      (set, get) => ({
        lostPets: [],

        addLostPet: (report) => {
          set((state) => ({
            lostPets: [
              ...state.lostPets,
              report,
            ],
          }));
        },

        updateLostPet: (id, data) => {
          set((state) => ({
            lostPets: state.lostPets.map(
              (report) => {
                if (report.id !== id) {
                  return report;
                }

                const {
                  ownerId,
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

        deleteLostPet: (id) => {
          set((state) => ({
            lostPets: state.lostPets.filter(
              (report) => report.id !== id,
            ),
          }));
        },

        getLostPetById: (id) => {
          return get().lostPets.find(
            (report) => report.id === id,
          );
        },

        getActiveLostPetByPetId: (petId) => {
          return get().lostPets.find(
            (report) =>
              report.petId === petId &&
              report.status === "ACTIVE",
          );
        },
      }),
      {
        name: "pawpass-lost-pets",
      },
    ),
  );