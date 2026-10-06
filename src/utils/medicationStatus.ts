import type { Medication } from "@/types/medication";

const getDateOnly = (dateString: string) => {
  const [year, month, day] = dateString.split("T")[0].split("-").map(Number);

  return new Date(year, month - 1, day);
};

const getToday = () => {
  const today = new Date();

  return new Date(today.getFullYear(), today.getMonth(), today.getDate());
};

export const getMedicationStatus = (
  medication: Medication,
): Medication["status"] => {
  if (medication.status === "STOPPED") {
    return "STOPPED";
  }

  if (medication.status === "COMPLETED") {
    return "COMPLETED";
  }

  const today = getToday();
  const startDate = getDateOnly(medication.startDate);

  if (startDate > today) {
    return "UPCOMING";
  }

  if (!medication.endDate) {
    return "ACTIVE";
  }

  const endDate = getDateOnly(medication.endDate);

  if (endDate < today) {
    return "COMPLETED";
  }

  return "ACTIVE";
};