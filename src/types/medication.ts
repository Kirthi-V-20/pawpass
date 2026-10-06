export type MedicationStatus =
  | "UPCOMING"
  | "ACTIVE"
  | "COMPLETED"
  | "STOPPED";

export interface Medication {
  id: string;
  petId: string;

  medicationName: string;
  dosage: string;
  frequency: string;

  startDate: string;
  endDate?: string;

  notes?: string;

  status?: MedicationStatus;

  createdAt: string;
}