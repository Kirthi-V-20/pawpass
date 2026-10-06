"use client";

import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";

import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import LocationPicker from "@/components/shared/LocationPicker/LocationPicker";

import { useLostPetStore } from "@/store/lostPetStore";

import { COLORS } from "@/styles/colors";
import { localize } from "@/utils/localize";

import type { Pet } from "@/types/pet";
import type { LostPetReport } from "@/types/lostPet";

interface EditLostPetModalProps {
  open: boolean;
  pet: Pet | null;
  report: LostPetReport | null;
  onClose: () => void;
}

interface FormData {
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
  lastSeenLocation: "",
  latitude: null,
  longitude: null,
  lastSeenDate: "",
  lastSeenTime: "",
  nearbyLandmark: "",
  description: "",
  photo: "",
};

export default function EditLostPetModal({
  open,
  pet,
  report,
  onClose,
}: EditLostPetModalProps) {
  const updateLostPet = useLostPetStore((state) => state.updateLostPet);

  const [formData, setFormData] = useState<FormData>(initialFormData);

  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);
  const [locationConfirmed, setLocationConfirmed] = useState(false);

  useEffect(() => {
    if (!open || !report) {
      return;
    }

    setFormData({
      lastSeenLocation: report.lastSeenLocation,
      latitude: report.latitude,
      longitude: report.longitude,
      lastSeenDate: report.lastSeenDate,
      lastSeenTime: report.lastSeenTime ?? "",
      nearbyLandmark: report.nearbyLandmark ?? "",
      description: report.description ?? "",
      photo: report.photo ?? "",
    });

    setLocationConfirmed(true);
    setIsLocationPickerOpen(false);
  }, [open, report]);

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
      if (typeof reader.result !== "string") {
        return;
      }

      setFormData((previous) => ({
        ...previous,
        photo: reader.result as string,
      }));
    };

    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!report) {
      return;
    }

    if (!formData.lastSeenLocation.trim()) {
      return;
    }

    if (formData.latitude === null || formData.longitude === null) {
      return;
    }

    if (!formData.lastSeenDate) {
      return;
    }

    updateLostPet(report.id, {
      lastSeenLocation: formData.lastSeenLocation.trim(),
      latitude: formData.latitude,
      longitude: formData.longitude,
      lastSeenDate: formData.lastSeenDate,
      lastSeenTime: formData.lastSeenTime,
      nearbyLandmark: formData.nearbyLandmark.trim() || undefined,
      description: formData.description.trim() || undefined,
      photo: formData.photo || undefined,
    });

    handleClose();
  };

  const handleClose = () => {
    setFormData(initialFormData);
    setLocationConfirmed(false);
    setIsLocationPickerOpen(false);
    onClose();
  };

  const canSave =
    Boolean(pet) &&
    Boolean(report) &&
    Boolean(formData.lastSeenLocation.trim()) &&
    formData.latitude !== null &&
    formData.longitude !== null &&
    Boolean(formData.lastSeenDate);

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        title={localize.lost.edit_modal_title}
        footer={
          <>
            <button
              type="button"
              onClick={handleClose}
              className="rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-slate-50"
              style={{
                borderColor: COLORS.grey[300],
                color: COLORS.neutral.black,
              }}
            >
              {localize.common.cancel}
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={!canSave}
              className="rounded-lg px-4 py-2 text-sm font-medium transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
              style={{
                backgroundColor: COLORS.primary.DEFAULT,
                color: COLORS.neutral.white,
              }}
            >
              {localize.common.save}
            </button>
          </>
        }
      >
        <div className="space-y-5">
          {pet && (
            <div
              className="flex items-center gap-4 rounded-lg border p-4"
              style={{
                borderColor: COLORS.grey[200],
                backgroundColor: COLORS.primary.background,
              }}
            >
              {pet.photo ? (
                <img
                  src={pet.photo}
                  alt={pet.name}
                  className="h-16 w-16 rounded-full object-cover"
                />
              ) : (
                <div
                  className="flex h-16 w-16 items-center justify-center rounded-full text-xl font-semibold"
                  style={{
                    backgroundColor: COLORS.primary.light,
                    color: COLORS.primary.DEFAULT,
                  }}
                >
                  {pet.name.charAt(0).toUpperCase()}
                </div>
              )}

              <div className="min-w-0">
                <h3
                  className="truncate text-base font-semibold"
                  style={{ color: COLORS.neutral.black }}
                >
                  {pet.name}
                </h3>

                <p className="mt-1 text-sm" style={{ color: COLORS.grey[600] }}>
                  {pet.species}
                </p>
              </div>
            </div>
          )}

          <div>
            <label
              className="mb-2 block text-sm font-medium"
              style={{ color: COLORS.neutral.black }}
            >
              {localize.lost.last_seen_loc}
            </label>

            <div
              className="rounded-lg border p-3"
              style={{
                borderColor: COLORS.grey[300],
                backgroundColor: COLORS.neutral.white,
              }}
            >
              {formData.lastSeenLocation ? (
                <p
                  className="break-words text-sm"
                  style={{ color: COLORS.neutral.black }}
                >
                  {formData.lastSeenLocation}
                </p>
              ) : (
                <p className="text-sm" style={{ color: COLORS.grey[500] }}>
                  {localize.lost.choose_location}
                </p>
              )}

              <button
                type="button"
                onClick={() => setIsLocationPickerOpen(true)}
                className="mt-3 rounded-md border px-3 py-2 text-sm font-medium transition-colors hover:bg-orange-50"
                style={{
                  borderColor: COLORS.primary.DEFAULT,
                  color: COLORS.primary.DEFAULT,
                }}
              >
                {formData.lastSeenLocation
                  ? localize.lost.change_location
                  : localize.lost.select_location}
              </button>

              {locationConfirmed && (
                <p
                  className="mt-2 text-xs font-medium"
                  style={{ color: COLORS.status.green }}
                >
                  {localize.lost.location_confirmed}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="edit-last-seen-date"
                className="mb-2 block text-sm font-medium"
                style={{ color: COLORS.neutral.black }}
              >
                {localize.lost.last_seen_date}
              </label>

              <Input
                id="edit-last-seen-date"
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
                htmlFor="edit-last-seen-time"
                className="mb-2 block text-sm font-medium"
                style={{ color: COLORS.neutral.black }}
              >
                {localize.lost.last_seen_time}
              </label>

              <Input
                id="edit-last-seen-time"
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
              htmlFor="edit-landmark"
              className="mb-2 block text-sm font-medium"
              style={{ color: COLORS.neutral.black }}
            >
              {localize.lost.landmark}
            </label>

            <Input
              id="edit-landmark"
              type="text"
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
              htmlFor="edit-description"
              className="mb-2 block text-sm font-medium"
              style={{ color: COLORS.neutral.black }}
            >
              {localize.lost.description}
            </label>

            <textarea
              id="edit-description"
              value={formData.description}
              onChange={(event) =>
                setFormData((previous) => ({
                  ...previous,
                  description: event.target.value,
                }))
              }
              rows={4}
              className="w-full resize-none rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2"
              style={{
                borderColor: COLORS.grey[300],
                color: COLORS.neutral.black,
              }}
            />
          </div>

          <div>
            <label
              htmlFor="edit-lost-pet-photo"
              className="mb-2 block text-sm font-medium"
              style={{ color: COLORS.neutral.black }}
            >
              {localize.lost.recent_photo}
            </label>

            <input
              id="edit-lost-pet-photo"
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="block w-full text-sm"
            />

            {formData.photo && (
              <div className="mt-3">
                <img
                  src={formData.photo}
                  alt={pet?.name ?? ""}
                  className="h-32 w-32 rounded-lg object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </Modal>

      <Modal
        open={isLocationPickerOpen}
        onClose={() => setIsLocationPickerOpen(false)}
        onBack={() => setIsLocationPickerOpen(false)}
        title={localize.lost.select_location}
        footer={
          <>
            <button
              type="button"
              onClick={() => setIsLocationPickerOpen(false)}
              className="rounded-lg border px-4 py-2 text-sm font-medium"
              style={{
                borderColor: COLORS.grey[300],
                color: COLORS.neutral.black,
              }}
            >
              {localize.common.cancel}
            </button>

            <button
              type="button"
              onClick={handleConfirmLocation}
              disabled={
                formData.latitude === null ||
                formData.longitude === null ||
                !formData.lastSeenLocation.trim()
              }
              className="rounded-lg px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50"
              style={{
                backgroundColor: COLORS.primary.DEFAULT,
                color: COLORS.neutral.white,
              }}
            >
              {localize.lost.confirm_location}
            </button>
          </>
        }
      >
        <div className="h-[500px]">
          <LocationPicker
            latitude={formData.latitude ?? undefined}
            longitude={formData.longitude ?? undefined}
            onLocationSelect={handleLocationSelect}
          />
        </div>
      </Modal>
    </>
  );
}
