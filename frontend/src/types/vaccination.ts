export type VaccinationStatus =
  | "UP_TO_DATE"
  | "DUE_SOON"
  | "OVERDUE";

export interface Vaccination {
  id: string;
  petId: string;

  vaccineName: string;
  givenDate: string;
  nextDueDate: string;

  veterinaryClinic?: string;
  veterinarian?: string;
  notes?: string;

  status?: VaccinationStatus;

  createdAt: string;
}