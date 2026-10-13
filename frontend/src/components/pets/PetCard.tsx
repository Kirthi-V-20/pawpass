"use client";

import { COLORS } from "@/styles/colors";
import { localize } from "@/utils/localize";
import type { Pet } from "@/types/pet";

import { MaleIcon, FemaleIcon } from "@/icons/GenderIcons";

interface PetCardProps {
  pet: Pet;
  onViewDetails: (pet: Pet) => void;
  onEdit: (pet: Pet) => void;
  onDelete: (pet: Pet) => void;
}

export default function PetCard({
  pet,
  onViewDetails,
  onEdit,
  onDelete,
}: PetCardProps) {
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

        <div className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm">
          {pet.gender === "Male" ? (
            <MaleIcon size={20} color={COLORS.primary.DEFAULT} />
          ) : (
            <FemaleIcon size={20} color={COLORS.primary.DEFAULT} />
          )}
        </div>
      </div>

      <div className="p-5">
        <div className="mb-5">
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

        <div className="mb-3 flex items-center justify-between">
          <span
            className="text-sm"
            style={{
              color: COLORS.grey[500],
            }}
          >
            {localize.pets.dob}
          </span>

          <span
            className="text-sm font-medium"
            style={{
              color: COLORS.neutral.black,
            }}
          >
            {pet.dateOfBirth}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span
            className="text-sm"
            style={{
              color: COLORS.grey[500],
            }}
          >
            {localize.pets.weight}
          </span>

          <span
            className="text-sm font-medium"
            style={{
              color: COLORS.neutral.black,
            }}
          >
            {pet.weight ? `${pet.weight} kg` : "-"}
          </span>
        </div>

        <div
          className="mt-5 grid grid-cols-3 gap-2 border-t pt-3"
          style={{
            borderColor: COLORS.grey[200],
          }}
        >
          <button
            type="button"
            onClick={() => onViewDetails(pet)}
            className="rounded-md border px-2 py-2 text-xs font-medium transition-colors hover:bg-orange-50"
            style={{
              borderColor: COLORS.grey[300],
              color: COLORS.neutral.black,
            }}
          >
            {localize.common.view_details}{" "}
          </button>

          <button
            type="button"
            onClick={() => onEdit(pet)}
            className="rounded-md border px-2 py-2 text-xs font-medium transition-colors hover:bg-orange-50"
            style={{
              borderColor: COLORS.grey[300],
              color: COLORS.neutral.black,
            }}
          >
            {localize.common.edit}{" "}
          </button>

          <button
            type="button"
            onClick={() => onDelete(pet)}
            className="rounded-md border px-2 py-2 text-xs font-medium transition-colors hover:bg-red-50"
            style={{
              borderColor: COLORS.grey[300],
              color: COLORS.status.red,
            }}
          >
            {localize.common.delete}{" "}
          </button>
        </div>
      </div>
    </div>
  );
}
