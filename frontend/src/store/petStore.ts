import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { Pet } from "@/types/pet";

interface PetStore {
  pets: Pet[];

  addPet: (pet: Pet) => void;
  updatePet: (id: string, data: Partial<Pet>) => void;
  deletePet: (id: string) => void;
  getPetById: (id: string) => Pet | undefined;
}

export const usePetStore = create<PetStore>()(
  persist(
    (set, get) => ({
      pets: [],

      addPet: (pet) => {
        set((state) => ({
          pets: [...state.pets, pet],
        }));
      },

      updatePet: (id, data) => {
        set((state) => ({
          pets: state.pets.map((pet) => {
            if (pet.id !== id) {
              return pet;
            }

            const { ownerId, ...updateData } = data;

            return {
              ...pet,
              ...updateData,
            };
          }),
        }));
      },

      deletePet: (id) => {
        set((state) => ({
          pets: state.pets.filter(
            (pet) => pet.id !== id,
          ),
        }));
      },

      getPetById: (id) => {
        return get().pets.find(
          (pet) => pet.id === id,
        );
      },
    }),
    {
      name: "pawpass-pets",
    },
  ),
);