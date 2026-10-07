"use client";

import { COLORS } from "@/styles/colors";
import { localize } from "@/utils/localize";

import type { Pet } from "@/types/pet";
import type { LostPetReport } from "@/types/lostPet";

import { MaleIcon, FemaleIcon } from "@/icons/GenderIcons";

interface ReportFoundCardProps {
  pet: Pet;
  report: LostPetReport;
  distance: number;
  onViewDetails: () => void;
  onReportFound: () => void;
}

function calculateAge(dateOfBirth: string): {
  years: number;
  months: number;
} {
  if (!dateOfBirth) {
    return {
      years: 0,
      months: 0,
    };
  }

  const birthDate = new Date(dateOfBirth);
  const today = new Date();

  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();

  if (today.getDate() < birthDate.getDate()) {
    months -= 1;
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return {
    years: Math.max(years, 0),
    months: Math.max(months, 0),
  };
}

function formatAge(dateOfBirth: string): string {
  const age = calculateAge(dateOfBirth);

  if (age.years > 0) {
    return `${age.years} ${
      age.years === 1 ? localize.lost.year : localize.lost.years
    }`;
  }

  if (age.months > 0) {
    return `${age.months} ${
      age.months === 1 ? localize.lost.month : localize.lost.months
    }`;
  }

  return localize.lost.less_than_one_month;
}

export default function ReportFoundCard({
  pet,
  report,
  distance,
  onViewDetails,
  onReportFound,
}: ReportFoundCardProps) {
  return (
    <div
      className="w-[280px] overflow-hidden rounded-xl border bg-white"
      style={{
        borderColor: COLORS.grey[200],
      }}
    >
      <div
        className="relative flex h-45 items-center justify-center"
        style={{
          backgroundColor: COLORS.primary.background,
        }}
      >
        {pet.photo ? (
          <img
            src={pet.photo}
            alt={pet.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div
            className="flex h-28 w-28 items-center justify-center rounded-full"
            style={{
              backgroundColor: COLORS.primary.light,
              color: COLORS.primary.DEFAULT,
            }}
          >
            <span className="text-4xl font-semibold">
              {pet.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        <span
          className="absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold"
          style={{
            backgroundColor: COLORS.status.red,
            color: COLORS.neutral.white,
          }}
        >
          {localize.lost.status_lost}
        </span>

        <div className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm">
          {pet.gender === "Male" ? (
            <MaleIcon size={20} color={COLORS.primary.DEFAULT} />
          ) : (
            <FemaleIcon size={20} color={COLORS.primary.DEFAULT} />
          )}
        </div>
      </div>

      <div className="p-3">
        <div className="mb-2">
          <h2
            className="text-lg font-semibold"
            style={{
              color: COLORS.neutral.black,
            }}
          >
            {pet.name}
          </h2>

          <p
            className="mt-1 text-sm"
            style={{
              color: COLORS.grey[600],
            }}
          >
            {pet.species}
          </p>
        </div>

        <div className="mb-1 flex items-center justify-between gap-2">
          <span
            className="text-sm"
            style={{
              color: COLORS.grey[500],
            }}
          >
            {localize.lost.age}
          </span>

          <span
            className="text-right text-sm font-medium"
            style={{
              color: COLORS.neutral.black,
            }}
          >
            {formatAge(pet.dateOfBirth)}
          </span>
        </div>

        <div className="mb-1 flex items-start justify-between gap-2">
          <span
            className="shrink-0 text-sm"
            style={{
              color: COLORS.grey[500],
            }}
          >
            {localize.found.last_seen_location}
          </span>

          <span
            className="max-w-[155px] truncate text-right text-sm font-medium"
            style={{
              color: COLORS.neutral.black,
            }}
            title={report.lastSeenLocation}
          >
            {report.lastSeenLocation}
          </span>
        </div>

        <div className="mb-1 flex items-center justify-between gap-2">
          <span
            className="text-sm"
            style={{
              color: COLORS.grey[500],
            }}
          >
            {localize.found.last_seen_date}
          </span>

          <span
            className="text-right text-sm font-medium"
            style={{
              color: COLORS.neutral.black,
            }}
          >
            {report.lastSeenDate}
          </span>
        </div>

        {report.lastSeenTime && (
          <div className="mb-1 flex items-center justify-between gap-2">
            <span
              className="text-sm"
              style={{
                color: COLORS.grey[500],
              }}
            >
              {localize.lost.last_seen_time}
            </span>

            <span
              className="text-right text-sm font-medium"
              style={{
                color: COLORS.neutral.black,
              }}
            >
              {report.lastSeenTime}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between gap-2">
          <span
            className="text-sm"
            style={{
              color: COLORS.grey[500],
            }}
          >
            {localize.found.distance}
          </span>

          <span
            className="text-right text-sm font-medium"
            style={{
              color: COLORS.neutral.black,
            }}
          >
            {distance.toFixed(1)} km
          </span>
        </div>

        <div
          className="mt-2 grid grid-cols-2 gap-2 border-t pt-1"
          style={{
            borderColor: COLORS.grey[200],
          }}
        >
          <button
            type="button"
            onClick={onViewDetails}
            className="rounded-md border px-2 py-2 text-xs font-medium transition-colors hover:bg-orange-50"
            style={{
              borderColor: COLORS.grey[300],
              color: COLORS.neutral.black,
            }}
          >
            {localize.common.view_details}
          </button>

          <button
            type="button"
            onClick={onReportFound}
            className="rounded-md px-2 py-2 text-xs font-medium transition-colors"
            style={{
              backgroundColor: COLORS.status.green,
              color: COLORS.neutral.white,
            }}
          >
            {localize.found.report_found_btn}
          </button>
        </div>
      </div>
    </div>
  );
}
