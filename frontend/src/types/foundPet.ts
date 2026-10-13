export type FoundPetStatus =
  | "PENDING"
  | "REJECTED"
  | "MATCH_CONFIRMED";

export interface FoundPetReport {
  id: string;

  lostReportId: string;

  petId: string;

  finderId: string;

  photoId?: string;

  foundLocation: string;

  latitude: number;

  longitude: number;

  foundDate: string;

  foundTime?: string;

  nearbyLandmark?: string;

  description?: string;

  additionalDetails?: string;

  status: FoundPetStatus;

  createdAt: string;
}