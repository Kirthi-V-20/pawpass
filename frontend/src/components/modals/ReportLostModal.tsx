"use client";

import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent } from "react";

import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import LocationPicker from "@/components/shared/LocationPicker/LocationPicker";

import { useAuthStore } from "@/store/authStore";
import { useLostPetStore } from "@/store/lostPetStore";
import { usePetStore } from "@/store/petStore";

import { COLORS } from "@/styles/colors";
import { localize } from "@/utils/localize";

import { MaleIcon, FemaleIcon } from "@/icons/GenderIcons";

import type { Pet } from "@/types/pet";
import type { LostPetReport } from "@/types/lostPet";

interface ReportLostModalProps {
  open: boolean;
  onClose: () => void;
  pet?: Pet | null;
}

interface FormData {
  petId: string;

  lastSeenLocation: string;

  latitude: number | null;
  longitude: number | null;

  lastSeenDate: string;
  lastSeenTime: string;

  nearbyLandmark: string;
  description: string;

  photo: string;
}

const initialFormData: FormData = {
  petId: "",
  lastSeenLocation: "",
  latitude: null,
  longitude: null,
  lastSeenDate: "",
  lastSeenTime: "",
  nearbyLandmark: "",
  description: "",
  photo: "",
};

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

export default function ReportLostModal({
  open,
  onClose,
  pet,
}: ReportLostModalProps) {
  const { user } = useAuthStore();

  const { pets, updatePet } = usePetStore();

  const { addLostPet } = useLostPetStore();

  const [formData, setFormData] = useState<FormData>(initialFormData);

  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);

  const [locationConfirmed, setLocationConfirmed] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    setFormData({
      ...initialFormData,
      petId: pet?.id ?? "",
    });

    setLocationConfirmed(false);
    setIsLocationPickerOpen(false);
  }, [open, pet]);

  const selectedPet = useMemo(() => {
    return pets.find((item) => item.id === formData.petId);
  }, [pets, formData.petId]);

  const handlePetChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setFormData((previous) => ({
      ...previous,
      petId: event.target.value,
    }));

    setLocationConfirmed(false);
  };

  const handleLocationSelect = (
    latitude: number,
    longitude: number,
    locationName: string,
  ) => {
    setFormData((previous) => ({
      ...previous,
      latitude,
      longitude,
      lastSeenLocation: locationName || localize.lost.selected_map_location,
    }));

    setLocationConfirmed(false);
  };

  const handleOpenLocationPicker = () => {
    setIsLocationPickerOpen(true);
  };

  const handleConfirmLocation = () => {
    if (formData.latitude === null || formData.longitude === null) {
      return;
    }

    if (!formData.lastSeenLocation.trim()) {
      return;
    }

    setLocationConfirmed(true);
    setIsLocationPickerOpen(false);
  };

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result;

      if (typeof result !== "string") {
        return;
      }

      setFormData((previous) => ({
        ...previous,
        photo: result,
      }));
    };

    reader.readAsDataURL(file);
  };

  const handleClose = () => {
    setFormData(initialFormData);
    setLocationConfirmed(false);
    setIsLocationPickerOpen(false);

    onClose();
  };

  const canSubmit =
    Boolean(formData.petId) &&
    Boolean(formData.lastSeenLocation.trim()) &&
    formData.latitude !== null &&
    formData.longitude !== null &&
    locationConfirmed &&
    Boolean(formData.lastSeenDate) &&
    Boolean(formData.lastSeenTime);

  const handleSubmit = () => {
    if (!user) {
      return;
    }

    if (!canSubmit) {
      return;
    }

    if (formData.latitude === null || formData.longitude === null) {
      return;
    }

    const report: LostPetReport = {
      id: crypto.randomUUID(),

      petId: formData.petId,

      ownerId: user.id,

      lastSeenLocation: formData.lastSeenLocation.trim(),

      latitude: formData.latitude,

      longitude: formData.longitude,

      lastSeenDate: formData.lastSeenDate,

      lastSeenTime: formData.lastSeenTime,

      nearbyLandmark: formData.nearbyLandmark.trim() || undefined,

      description: formData.description.trim() || undefined,

      photo: formData.photo || undefined,

      status: "ACTIVE",

      createdAt: new Date().toISOString(),
    };

    addLostPet(report);

    updatePet(formData.petId, {
      status: "LOST",
    });

    handleClose();
  };

  return (
    <>
      <Modal
        open={open && !isLocationPickerOpen}
        onClose={handleClose}
        onBack={handleClose}
        title={localize.lost.modal_title}
        className="max-w-2xl"
        footer={
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 rounded-lg border px-4 py-2.5 text-sm font-medium"
              style={{
                borderColor: COLORS.grey[300],
                color: COLORS.grey[700],
                backgroundColor: COLORS.neutral.white,
              }}
            >
              {localize.lost.cancel}
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="flex-1 rounded-lg px-4 py-2.5 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50"
              style={{
                backgroundColor: COLORS.status.red,
                color: COLORS.neutral.white,
              }}
            >
              {selectedPet
                ? `${localize.lost.report} ${selectedPet.name} ${localize.lost.as_lost}`
                : localize.lost.report_lost_btn}
            </button>
          </div>
        }
      >
        <div className="space-y-6">
          <section>
            <h3
              className="mb-3 text-sm font-semibold"
              style={{
                color: COLORS.neutral.black,
              }}
            >
              {localize.lost.select_pet}
            </h3>

            <select
              value={formData.petId}
              onChange={handlePetChange}
              disabled={Boolean(pet)}
              className="h-10 w-full rounded-md border px-3 text-sm outline-none disabled:cursor-not-allowed disabled:bg-gray-50"
              style={{
                borderColor: COLORS.grey[300],
                backgroundColor: COLORS.neutral.white,
                color: COLORS.neutral.black,
              }}
            >
              <option value="">{localize.lost.select_pet}</option>

              {pets.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </section>

          {selectedPet && (
            <section
              className="rounded-xl border p-4"
              style={{
                borderColor: COLORS.grey[200],
                backgroundColor: COLORS.grey[50],
              }}
            >
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg">
                  {selectedPet.photo ? (
                    <img
                      src={selectedPet.photo}
                      alt={selectedPet.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div
                      className="flex h-full w-full items-center justify-center text-xs"
                      style={{
                        backgroundColor: COLORS.grey[200],
                        color: COLORS.grey[500],
                      }}
                    >
                      {localize.lost.no_photo}
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h4
                    className="text-base font-semibold"
                    style={{
                      color: COLORS.neutral.black,
                    }}
                  >
                    {selectedPet.name}
                  </h4>

                  <div
                    className="mt-2 flex flex-wrap items-center gap-3 text-sm"
                    style={{
                      color: COLORS.grey[600],
                    }}
                  >
                    <span className="flex items-center gap-1">
                      {selectedPet.gender === "Male" ? (
                        <MaleIcon />
                      ) : (
                        <FemaleIcon />
                      )}

                      {selectedPet.gender}
                    </span>

                    <span>
                      {localize.lost.age}: {formatAge(selectedPet.dateOfBirth)}
                    </span>

                    <span>
                      {selectedPet.weight !== undefined
                        ? `${selectedPet.weight} kg`
                        : localize.lost.weight_not_available}
                    </span>
                  </div>
                </div>
              </div>
            </section>
          )}

          <section>
            <h3
              className="mb-4 text-sm font-semibold"
              style={{
                color: COLORS.neutral.black,
              }}
            >
              {localize.lost.details}
            </h3>

            <div className="space-y-4">
              <div>
                <label
                  className="mb-2 block text-sm font-medium"
                  style={{
                    color: COLORS.grey[700],
                  }}
                >
                  {localize.lost.last_seen_loc}
                </label>

                <button
                  type="button"
                  onClick={handleOpenLocationPicker}
                  className="flex w-full items-center justify-between rounded-lg border px-4 py-3 text-left transition"
                  style={{
                    borderColor: locationConfirmed
                      ? COLORS.status.green
                      : COLORS.grey[300],

                    backgroundColor: locationConfirmed
                      ? COLORS.status.greenLight
                      : COLORS.neutral.white,
                  }}
                >
                  <div className="min-w-0">
                    <p
                      className="truncate text-sm font-medium"
                      style={{
                        color: COLORS.neutral.black,
                      }}
                    >
                      {formData.lastSeenLocation ||
                        localize.lost.choose_location}
                    </p>

                    {locationConfirmed && (
                      <p
                        className="mt-1 text-xs"
                        style={{
                          color: COLORS.status.green,
                        }}
                      >
                        {localize.lost.location_confirmed}
                      </p>
                    )}
                  </div>

                  <span
                    className="ml-3 shrink-0 text-sm font-medium"
                    style={{
                      color: COLORS.primary.DEFAULT,
                    }}
                  >
                    {locationConfirmed
                      ? localize.lost.change_location
                      : localize.lost.select_location}
                  </span>
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    className="mb-2 block text-sm font-medium"
                    style={{
                      color: COLORS.grey[700],
                    }}
                  >
                    {localize.lost.last_seen_date}
                  </label>

                  <Input
                    type="date"
                    value={formData.lastSeenDate}
                    onChange={(event) =>
                      setFormData((previous) => ({
                        ...previous,
                        lastSeenDate: event.target.value,
                      }))
                    }
                  />
                </div>

                <div>
                  <label
                    className="mb-2 block text-sm font-medium"
                    style={{
                      color: COLORS.grey[700],
                    }}
                  >
                    {localize.lost.last_seen_time}
                  </label>

                  <Input
                    type="time"
                    value={formData.lastSeenTime}
                    onChange={(event) =>
                      setFormData((previous) => ({
                        ...previous,
                        lastSeenTime: event.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <div>
                <label
                  className="mb-2 block text-sm font-medium"
                  style={{
                    color: COLORS.grey[700],
                  }}
                >
                  {localize.lost.landmark}
                </label>

                <Input
                  value={formData.nearbyLandmark}
                  onChange={(event) =>
                    setFormData((previous) => ({
                      ...previous,
                      nearbyLandmark: event.target.value,
                    }))
                  }
                />
              </div>

              <div>
                <label
                  className="mb-2 block text-sm font-medium"
                  style={{
                    color: COLORS.grey[700],
                  }}
                >
                  {localize.lost.description}
                </label>

                <textarea
                  value={formData.description}
                  onChange={(event) =>
                    setFormData((previous) => ({
                      ...previous,
                      description: event.target.value,
                    }))
                  }
                  rows={4}
                  className="w-full resize-none rounded-md border px-3 py-2 text-sm outline-none"
                  style={{
                    borderColor: COLORS.grey[300],
                    backgroundColor: COLORS.neutral.white,
                    color: COLORS.neutral.black,
                  }}
                />
              </div>

              <div>
                <label
                  className="mb-2 block text-sm font-medium"
                  style={{
                    color: COLORS.grey[700],
                  }}
                >
                  {localize.lost.recent_photo}
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="block w-full text-sm"
                />

                {formData.photo && (
                  <div className="mt-3 h-24 w-24 overflow-hidden rounded-lg">
                    <img
                      src={formData.photo}
                      alt={localize.lost.recent_photo}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </Modal>

      <Modal
        open={open && isLocationPickerOpen}
        onClose={() => setIsLocationPickerOpen(false)}
        onBack={() => setIsLocationPickerOpen(false)}
        title={localize.lost.select_location}
        className="max-w-3xl"
        footer={
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setIsLocationPickerOpen(false)}
              className="flex-1 rounded-lg border px-4 py-2.5 text-sm font-medium"
              style={{
                borderColor: COLORS.grey[300],
                color: COLORS.grey[700],
                backgroundColor: COLORS.neutral.white,
              }}
            >
              {localize.lost.cancel}
            </button>

            <button
              type="button"
              onClick={handleConfirmLocation}
              disabled={
                formData.latitude === null || formData.longitude === null
              }
              className="flex-1 rounded-lg px-4 py-2.5 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50"
              style={{
                backgroundColor: COLORS.primary.DEFAULT,
                color: COLORS.neutral.white,
              }}
            >
              {localize.lost.confirm_location}
            </button>
          </div>
        }
      >
        <LocationPicker
          latitude={formData.latitude ?? undefined}
          longitude={formData.longitude ?? undefined}
          onLocationSelect={handleLocationSelect}
        />
      </Modal>
    </>
  );
}
