import type { Vaccination } from "@/types/vaccination";

const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;

const getDateOnly = (dateString: string) => {
  const [year, month, day] = dateString
    .split("T")[0]
    .split("-")
    .map(Number);

  return new Date(year, month - 1, day);
};

const getToday = () => {
  const today = new Date();

  return new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
};

export const getVaccinationStatus = (
  vaccination: Vaccination,
): Vaccination["status"] => {
  // If the vaccination has been marked as given,
  // it should remain UP_TO_DATE.
  if (vaccination.status === "UP_TO_DATE") {
    return "UP_TO_DATE";
  }

  const today = getToday();
  const dueDate = getDateOnly(vaccination.nextDueDate);

  const differenceInTime =
    dueDate.getTime() - today.getTime();

  const differenceInDays = Math.round(
    differenceInTime / MILLISECONDS_PER_DAY,
  );

  if (differenceInDays < 0) {
    return "OVERDUE";
  }

  if (differenceInDays <= 3) {
    return "DUE_SOON";
  }

  return "UP_TO_DATE";
};