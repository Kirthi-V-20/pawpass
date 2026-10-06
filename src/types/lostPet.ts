export type LostPetStatus =
  | "ACTIVE"
  | "RESOLVED";

export interface LostPetReport {
  id: string;

  petId: string;
  ownerId: string;

  lastSeenLocation: string;
  latitude: number;
  longitude: number;

  lastSeenDate: string;
  lastSeenTime?: string;

  nearbyLandmark?: string;
  description?: string;
  photo?: string;

  status: LostPetStatus;

  createdAt: string;
}