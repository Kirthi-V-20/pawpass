"use client";

import { COLORS } from "@/styles/colors";
import { localize } from "@/utils/localize";

import type { Pet } from "@/types/pet";
import type { LostPetReport } from "@/types/lostPet";

import { MaleIcon, FemaleIcon } from "@/icons/GenderIcons";

interface LostPetCardProps {
  pet: Pet;
  report: LostPetReport;

  onViewDetails: (pet: Pet, report: LostPetReport) => void;
  onEdit: (pet: Pet, report: LostPetReport) => void;
  onDelete: (pet: Pet, report: LostPetReport) => void;
}

export default function LostPetCard({
  pet,
  report,
  onViewDetails,
  onEdit,
  onDelete,
}: LostPetCardProps) {
  const displayPhoto = report.photo || pet.photo;
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
        {displayPhoto ? (
          <img
            src={displayPhoto}
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

        <div
          className="absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold"
          style={{
            backgroundColor: COLORS.status.red,
            color: COLORS.neutral.white,
          }}
        >
          {localize.lost.status_lost}
        </div>

        <div className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm">
          {pet.gender === "Male" ? (
            <MaleIcon size={20} color={COLORS.primary.DEFAULT} />
          ) : (
            <FemaleIcon size={20} color={COLORS.primary.DEFAULT} />
          )}
        </div>
      </div>

      <div className="p-2">
        <div className="mb-1">
          <h2
            className="text-lg font-semibold"
            style={{
              color: COLORS.neutral.black,
            }}
          >
            {pet.name}
          </h2>

          <p
            className="mt-0 text-sm"
            style={{
              color: COLORS.grey[600],
            }}
          >
            {pet.species}
          </p>
        </div>

        <div className="mb-1 flex items-center justify-between">
          <span
            className="text-sm"
            style={{
              color: COLORS.grey[500],
            }}
          >
            {localize.lost.last_seen_loc}
          </span>

          <span
            className="max-w-[150px] truncate text-right text-sm font-medium"
            style={{
              color: COLORS.neutral.black,
            }}
            title={report.lastSeenLocation}
          >
            {report.lastSeenLocation}
          </span>
        </div>

        <div className="mb-1 flex items-center justify-between">
          <span
            className="text-sm"
            style={{
              color: COLORS.grey[500],
            }}
          >
            {localize.lost.last_seen_date}
          </span>

          <span
            className="text-sm font-medium"
            style={{
              color: COLORS.neutral.black,
            }}
          >
            {report.lastSeenDate}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span
            className="text-sm"
            style={{
              color: COLORS.grey[500],
            }}
          >
            {localize.lost.last_seen_time}
          </span>

          <span
            className="text-sm font-medium"
            style={{
              color: COLORS.neutral.black,
            }}
          >
            {report.lastSeenTime || "-"}
          </span>
        </div>

        <div
          className="mt-4 grid grid-cols-3 gap-3 border-t pt-3"
          style={{
            borderColor: COLORS.grey[200],
          }}
        >
          <button
            type="button"
            onClick={() => onViewDetails(pet, report)}
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
            onClick={() => onEdit(pet, report)}
            className="rounded-md border px-2 py-2 text-xs font-medium transition-colors hover:bg-orange-50"
            style={{
              borderColor: COLORS.grey[300],
              color: COLORS.neutral.black,
            }}
          >
            {localize.common.edit}
          </button>

          <button
            type="button"
            onClick={() => onDelete(pet, report)}
            className="rounded-md border px-2 py-2 text-xs font-medium transition-colors hover:bg-red-50"
            style={{
              borderColor: COLORS.grey[300],
              color: COLORS.status.red,
            }}
          >
            {localize.common.delete}
          </button>
        </div>
      </div>
    </div>
  );
}
