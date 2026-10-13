import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { Vaccination } from "@/types/vaccination";
import type { Medication } from "@/types/medication";

interface HealthStore {
  vaccinations: Vaccination[];
  medications: Medication[];

  addVaccination: (vaccination: Vaccination) => void;

  updateVaccination: (
    id: string,
    data: Partial<Vaccination>,
  ) => void;

  markVaccinationAsGiven: (id: string) => void;

  deleteVaccination: (id: string) => void;

  addMedication: (medication: Medication) => void;

  updateMedication: (
    id: string,
    data: Partial<Medication>,
  ) => void;

  markMedicationAsCompleted: (id: string) => void;

  markMedicationAsStopped: (id: string) => void;

  deleteMedication: (id: string) => void;
}



const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const useHealthStore = create<HealthStore>()(
  persist(
    (set) => ({
      vaccinations: [],
      medications: [],

      // -----------------------------
      // Vaccination
      // -----------------------------

      addVaccination: (vaccination) => {
        set((state) => ({
          vaccinations: [
            ...state.vaccinations,
            vaccination,
          ],
        }));
      },

      updateVaccination: (id, data) => {
        set((state) => ({
          vaccinations: state.vaccinations.map(
            (vaccination) =>
              vaccination.id === id
                ? {
                    ...vaccination,
                    ...data,
                  }
                : vaccination,
          ),
        }));
      },

    markVaccinationAsGiven: (id) => {
      set((state) => ({
        vaccinations: state.vaccinations.map((vaccination) =>
          vaccination.id === id
            ? {
                ...vaccination,
                givenDate: formatDate(new Date()),
                status: "UP_TO_DATE",
              }
            : vaccination,
        ),
      }));
    },

      deleteVaccination: (id) => {
        set((state) => ({
          vaccinations: state.vaccinations.filter(
            (vaccination) =>
              vaccination.id !== id,
          ),
        }));
      },

      // -----------------------------
      // Medication
      // -----------------------------

      addMedication: (medication) => {
        set((state) => ({
          medications: [
            ...state.medications,
            medication,
          ],
        }));
      },

      updateMedication: (id, data) => {
        set((state) => ({
          medications: state.medications.map(
            (medication) =>
              medication.id === id
                ? {
                    ...medication,
                    ...data,
                  }
                : medication,
          ),
        }));
      },

      markMedicationAsCompleted: (id) => {
        const today = new Date().toISOString();

        set((state) => ({
          medications: state.medications.map(
            (medication) =>
              medication.id === id
                ? {
                    ...medication,
                    endDate: today,
                    status: "COMPLETED",
                  }
                : medication,
          ),
        }));
      },

      markMedicationAsStopped: (id) => {
        set((state) => ({
          medications: state.medications.map(
            (medication) =>
              medication.id === id
                ? {
                    ...medication,
                    status: "STOPPED",
                  }
                : medication,
          ),
        }));
      },

      deleteMedication: (id) => {
        set((state) => ({
          medications: state.medications.filter(
            (medication) =>
              medication.id !== id,
          ),
        }));
      },
    }),
    {
      name: "pawpass-health",
    },
  ),
);