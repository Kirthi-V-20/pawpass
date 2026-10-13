export type RecoveryStatus =
  | "ACTIVE"
  | "COMPLETED";

export interface RecoveryConnection {
  id: string;

  foundReportId: string;
  lostReportId: string;
  petId: string;

  ownerId: string;
  finderId: string;

  ownerName: string;
  ownerEmail: string;

  finderName: string;
  finderEmail: string;

  foundLocation: string;
  foundDate: string;
  foundTime?: string;

  status: RecoveryStatus;

  createdAt: string;
}