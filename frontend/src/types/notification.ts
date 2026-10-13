export type NotificationType =
  | "POSSIBLE_MATCH"
  | "VACCINATION_DUE"
  | "VACCINATION_OVERDUE"
  | "PET_REPORTED_LOST"
  | "PET_FOUND"
  | "FOUND_REPORT_REJECTED"
  | "FOUND_REPORT_CONFIRMED"
  | "RECOVERY_CONFIRMED";

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  relatedId?: string;
  isRead: boolean;
  createdAt: string;
}