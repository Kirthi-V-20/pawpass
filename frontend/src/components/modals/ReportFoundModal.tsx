"use client";

import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import { saveFoundPetImage } from "@/lib/imageDb";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import LocationPicker from "@/components/shared/LocationPicker/LocationPicker";

import { MaleIcon, FemaleIcon } from "@/icons/GenderIcons";

import { useAuthStore } from "@/store/authStore";
import { useFoundPetStore } from "@/store/foundPetStore";
import { useNotificationStore } from "@/store/notificationStore";

import { COLORS } from "@/styles/colors";
import { localize } from "@/utils/localize";

import type { Pet } from "@/types/pet";
import type { LostPetReport } from "@/types/lostPet";
import type { FoundPetReport } from "@/types/foundPet";
import type { Notification } from "@/types/notification";

interface ReportFoundModalProps {
  open: boolean;
  onClose: () => void;
  pet: Pet | null;
  report: LostPetReport | null;
}

interface FormData {
  foundLocation: string;
  latitude: number | null;
  longitude: number | null;
  foundDate: string;
  foundTime: string;
  description: string;
  additionalDetails: string;
  photo: string;
}

const initialFormData: FormData = {
  foundLocation: "",
  latitude: null,
  longitude: null,
  foundDate: "",
  foundTime: "",
  description: "",
  additionalDetails: "",
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

export default function ReportFoundModal({
  open,
  onClose,
  pet,
  report,
}: ReportFoundModalProps) {
  const user = useAuthStore((state) => state.user);

  const addFoundPet = useFoundPetStore((state) => state.addFoundPet);

  const addNotification = useNotificationStore(
    (state) => state.addNotification,
  );

  const [formData, setFormData] = useState<FormData>(initialFormData);

  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);

  const [locationConfirmed, setLocationConfirmed] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    setFormData(initialFormData);
    setIsLocationPickerOpen(false);
    setLocationConfirmed(false);
    setIsSubmitting(false);
  }, [open, pet, report]);

  const handleLocationSelect = (
    latitude: number,
    longitude: number,
    locationName: string,
  ) => {
    setFormData((previous) => ({
      ...previous,
      latitude,
      longitude,
      foundLocation: locationName || localize.lost.selected_map_location,
    }));

    setLocationConfirmed(false);
  };

  const handleConfirmLocation = () => {
    if (
      formData.latitude === null ||
      formData.longitude === null ||
      !formData.foundLocation.trim()
    ) {
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
    if (isSubmitting) {
      return;
    }

    setFormData(initialFormData);
    setLocationConfirmed(false);
    setIsLocationPickerOpen(false);

    onClose();
  };

  const canSubmit =
    Boolean(user?.id) &&
    Boolean(pet) &&
    Boolean(report) &&
    Boolean(formData.foundLocation.trim()) &&
    formData.latitude !== null &&
    formData.longitude !== null &&
    locationConfirmed &&
    Boolean(formData.foundDate) &&
    Boolean(formData.foundTime) &&
    Boolean(formData.photo);

  const handleSubmit = async () => {
    if (!user?.id || !pet || !report) {
      return;
    }

    if (!canSubmit) {
      return;
    }

    if (formData.latitude === null || formData.longitude === null) {
      return;
    }

    if (user.id === report.ownerId) {
      return;
    }

    setIsSubmitting(true);

    try {
      const foundReportId = crypto.randomUUID();

      await saveFoundPetImage(foundReportId, formData.photo);

      const foundReport: FoundPetReport = {
        id: foundReportId,

        lostReportId: report.id,

        petId: pet.id,

        finderId: user.id,

        photoId: foundReportId,

        foundLocation: formData.foundLocation.trim(),

        latitude: formData.latitude,

        longitude: formData.longitude,

        foundDate: formData.foundDate,

        foundTime: formData.foundTime,

        description: formData.description.trim() || undefined,

        additionalDetails: formData.additionalDetails.trim() || undefined,

        status: "PENDING",

        createdAt: new Date().toISOString(),
      };

      addFoundPet(foundReport);

      const notification: Notification = {
        id: crypto.randomUUID(),

        userId: report.ownerId,

        type: "POSSIBLE_MATCH",

        title: localize.found.possible_match_title,

        message: localize.found.possible_match_message.replace(
          "{name}",
          pet.name,
        ),

        relatedId: foundReport.id,

        isRead: false,

        createdAt: new Date().toISOString(),
      };

      addNotification(notification);

      handleClose();
    } catch (error) {
      console.error("Failed to submit found pet report:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Modal
        open={open && !isLocationPickerOpen}
        onClose={handleClose}
        onBack={handleClose}
        title={localize.found.modal_title}
        className="max-w-2xl"
        footer={
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 rounded-lg border px-4 py-2.5 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50"
              style={{
                borderColor: COLORS.grey[300],
                color: COLORS.grey[700],
                backgroundColor: COLORS.neutral.white,
              }}
            >
              {localize.common.cancel}
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canSubmit || isSubmitting}
              className="flex-1 rounded-lg px-4 py-2.5 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50"
              style={{
                backgroundColor: COLORS.primary.DEFAULT,
                color: COLORS.neutral.white,
              }}
            >
              {isSubmitting ? localize.found.submit : localize.found.submit}
            </button>
          </div>
        }
      >
        <div className="space-y-6">
          {pet && report && (
            <section
              className="rounded-xl border p-4"
              style={{
                borderColor: COLORS.grey[200],
                backgroundColor: COLORS.grey[50],
              }}
            >
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg">
                  {pet.photo ? (
                    <img
                      src={pet.photo}
                      alt={pet.name}
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
                  <div className="flex items-center gap-2">
                    <h4
                      className="text-base font-semibold"
                      style={{
                        color: COLORS.neutral.black,
                      }}
                    >
                      {pet.name}
                    </h4>

                    {pet.gender === "Male" ? (
                      <MaleIcon size={18} color={COLORS.primary.DEFAULT} />
                    ) : (
                      <FemaleIcon size={18} color={COLORS.primary.DEFAULT} />
                    )}
                  </div>

                  <p
                    className="mt-1 text-sm"
                    style={{
                      color: COLORS.grey[600],
                    }}
                  >
                    {pet.species}
                  </p>

                  <div
                    className="mt-2 flex flex-wrap items-center gap-3 text-sm"
                    style={{
                      color: COLORS.grey[600],
                    }}
                  >
                    <span>
                      {localize.lost.age}: {formatAge(pet.dateOfBirth)}
                    </span>

                    <span>
                      {pet.weight !== undefined
                        ? `${pet.weight} kg`
                        : localize.lost.weight_not_available}
                    </span>
                  </div>
                </div>
              </div>

              <div
                className="mt-4 rounded-lg border p-3"
                style={{
                  borderColor: COLORS.grey[200],
                  backgroundColor: COLORS.neutral.white,
                }}
              >
                <p
                  className="text-xs font-medium"
                  style={{
                    color: COLORS.grey[500],
                  }}
                >
                  {localize.found.last_seen_location}
                </p>

                <p
                  className="mt-1 text-sm"
                  style={{
                    color: COLORS.neutral.black,
                  }}
                >
                  {report.lastSeenLocation}
                </p>

                <p
                  className="mt-2 text-xs"
                  style={{
                    color: COLORS.grey[500],
                  }}
                >
                  {localize.found.last_seen_date}: {report.lastSeenDate}
                </p>
              </div>
            </section>
          )}

          <section>
            <label
              className="mb-2 block text-sm font-medium"
              style={{
                color: COLORS.grey[700],
              }}
            >
              {localize.found.found_loc}
            </label>

            <button
              type="button"
              onClick={() => setIsLocationPickerOpen(true)}
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
                  {formData.foundLocation || localize.lost.choose_location}
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
          </section>

          <section>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  className="mb-2 block text-sm font-medium"
                  style={{
                    color: COLORS.grey[700],
                  }}
                >
                  {localize.found.found_date}
                </label>

                <Input
                  type="date"
                  value={formData.foundDate}
                  onChange={(event) =>
                    setFormData((previous) => ({
                      ...previous,
                      foundDate: event.target.value,
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
                  value={formData.foundTime}
                  onChange={(event) =>
                    setFormData((previous) => ({
                      ...previous,
                      foundTime: event.target.value,
                    }))
                  }
                />
              </div>
            </div>
          </section>

          <section>
            <label
              className="mb-2 block text-sm font-medium"
              style={{
                color: COLORS.grey[700],
              }}
            >
              {localize.found.found_photo}
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
                  alt={localize.common.pet_image_alt}
                  className="h-full w-full object-cover"
                />
              </div>
            )}
          </section>

          <section>
            <label
              className="mb-2 block text-sm font-medium"
              style={{
                color: COLORS.grey[700],
              }}
            >
              {localize.found.description}
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
          </section>

          <section>
            <label
              className="mb-2 block text-sm font-medium"
              style={{
                color: COLORS.grey[700],
              }}
            >
              {localize.found.additional_details}
            </label>

            <textarea
              value={formData.additionalDetails}
              onChange={(event) =>
                setFormData((previous) => ({
                  ...previous,
                  additionalDetails: event.target.value,
                }))
              }
              rows={3}
              className="w-full resize-none rounded-md border px-3 py-2 text-sm outline-none"
              style={{
                borderColor: COLORS.grey[300],
                backgroundColor: COLORS.neutral.white,
                color: COLORS.neutral.black,
              }}
            />
          </section>
        </div>
      </Modal>

      <Modal
        open={open && isLocationPickerOpen}
        onClose={() => setIsLocationPickerOpen(false)}
        onBack={() => setIsLocationPickerOpen(false)}
        title={localize.found.found_loc}
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
              {localize.common.cancel}
            </button>

            <button
              type="button"
              onClick={handleConfirmLocation}
              disabled={
                formData.latitude === null ||
                formData.longitude === null ||
                !formData.foundLocation.trim()
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
