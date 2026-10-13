"use client";

import { useEffect, useState } from "react";

import ConfirmationModal from "@/components/modals/ConfirmationModal";
import { Modal } from "@/components/ui/modal";

import type { FoundPetReport } from "@/types/foundPet";
import type { LostPetReport } from "@/types/lostPet";
import type { Pet } from "@/types/pet";

import { getFoundPetImage } from "@/lib/imageDb";

import { COLORS } from "@/styles/colors";
import { localize } from "@/utils/localize";

interface FoundReportDetailsModalProps {
  open: boolean;
  onClose: () => void;
  pet: Pet | null;
  lostReport: LostPetReport | null;
  foundReport: FoundPetReport | null;
  onConfirm: () => void;
  onDismiss: () => void;
}

type ConfirmationType = "confirm" | "dismiss" | null;

export default function FoundReportDetailsModal({
  open,
  onClose,
  pet,
  lostReport,
  foundReport,
  onConfirm,
  onDismiss,
}: FoundReportDetailsModalProps) {
  const [foundPhoto, setFoundPhoto] = useState<string | null>(null);

  const [confirmationType, setConfirmationType] =
    useState<ConfirmationType>(null);

  useEffect(() => {
    let mounted = true;

    const loadFoundPhoto = async () => {
      if (!foundReport) {
        setFoundPhoto(null);
        return;
      }

      try {
        const image = await getFoundPetImage(foundReport.id);

        if (mounted) {
          setFoundPhoto(image);
        }
      } catch {
        if (mounted) {
          setFoundPhoto(null);
        }
      }
    };

    void loadFoundPhoto();

    return () => {
      mounted = false;
    };
  }, [foundReport]);

  useEffect(() => {
    if (!open) {
      setConfirmationType(null);
    }
  }, [open]);

  if (!pet || !lostReport || !foundReport) {
    return null;
  }

  const formatDate = (value?: string) => {
    if (!value) {
      return "-";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleDateString();
  };

  const getPetAge = () => {
    const birthDate = new Date(pet.dateOfBirth);

    if (Number.isNaN(birthDate.getTime())) {
      return "-";
    }

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

    if (years > 0) {
      if (months > 0) {
        return `${years} ${
          years === 1 ? localize.lost.year : localize.lost.years
        }, ${months} ${
          months === 1 ? localize.lost.month : localize.lost.months
        }`;
      }

      return `${years} ${
        years === 1 ? localize.lost.year : localize.lost.years
      }`;
    }

    if (months > 0) {
      return `${months} ${
        months === 1 ? localize.lost.month : localize.lost.months
      }`;
    }

    return localize.lost.less_than_one_month;
  };

  const handleClose = () => {
    setConfirmationType(null);
    onClose();
  };

  const handleConfirmClick = () => {
    setConfirmationType("confirm");
  };

  const handleDismissClick = () => {
    setConfirmationType("dismiss");
  };

  const handleConfirmationClose = () => {
    setConfirmationType(null);
  };

  const handleConfirmedAction = () => {
    setConfirmationType(null);

    if (confirmationType === "confirm") {
      onConfirm();
      return;
    }

    if (confirmationType === "dismiss") {
      onDismiss();
    }
  };

  const getStatusLabel = () => {
    if (foundReport.status === "MATCH_CONFIRMED") {
      return localize.found.confirmed;
    }

    if (foundReport.status === "REJECTED") {
      return localize.found.dismissed;
    }

    return localize.found.pending;
  };

  const getStatusBackgroundColor = () => {
    if (foundReport.status === "MATCH_CONFIRMED") {
      return COLORS.status.greenLight;
    }

    if (foundReport.status === "REJECTED") {
      return COLORS.status.redLight;
    }

    return COLORS.status.yellowLight;
  };

  const getStatusColor = () => {
    if (foundReport.status === "MATCH_CONFIRMED") {
      return COLORS.status.green;
    }

    if (foundReport.status === "REJECTED") {
      return COLORS.status.red;
    }

    return COLORS.status.yellow;
  };

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        onBack={handleClose}
        title={localize.found.possible_match_title}
        className="max-w-3xl"
        footer={
          foundReport.status === "PENDING" ? (
            <div className="flex w-full flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleClose}
                className="rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-slate-50"
                style={{
                  borderColor: COLORS.grey[300],
                  color: COLORS.grey[700],
                }}
              >
                {localize.common.close}
              </button>

              <button
                type="button"
                onClick={handleDismissClick}
                className="rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-red-50"
                style={{
                  borderColor: COLORS.status.red,
                  color: COLORS.status.red,
                }}
              >
                {localize.found.not_my_pet}
              </button>

              <button
                type="button"
                onClick={handleConfirmClick}
                className="rounded-lg px-4 py-2.5 text-sm font-medium transition-opacity hover:opacity-90"
                style={{
                  backgroundColor: COLORS.primary.DEFAULT,
                  color: COLORS.neutral.white,
                }}
              >
                {localize.found.this_is_my_pet}
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleClose}
              className="w-full rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-slate-50"
              style={{
                borderColor: COLORS.grey[300],
                color: COLORS.grey[700],
              }}
            >
              {localize.common.close}
            </button>
          )
        }
      >
        <div className="space-y-7">
          <div>
            <p
              className="text-sm leading-6"
              style={{
                color: COLORS.grey[600],
              }}
            >
              {localize.found.possible_match_message.replace(
                "{name}",
                pet.name,
              )}
            </p>
          </div>

          <section>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <p
                  className="mb-2 text-sm font-medium"
                  style={{
                    color: COLORS.grey[700],
                  }}
                >
                  {localize.found.lost_pet_photo}
                </p>

                <div
                  className="flex h-56 items-center justify-center overflow-hidden rounded-xl"
                  style={{
                    backgroundColor: COLORS.grey[50],
                  }}
                >
                  {pet.photo || lostReport.photo ? (
                    <img
                      src={pet.photo ?? lostReport.photo}
                      alt={pet.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span
                      className="text-sm"
                      style={{
                        color: COLORS.grey[400],
                      }}
                    >
                      {localize.lost.no_photo}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <p
                  className="mb-2 text-sm font-medium"
                  style={{
                    color: COLORS.grey[700],
                  }}
                >
                  {localize.found.found_photo}
                </p>

                <div
                  className="flex h-56 items-center justify-center overflow-hidden rounded-xl"
                  style={{
                    backgroundColor: COLORS.grey[50],
                  }}
                >
                  {foundPhoto ? (
                    <img
                      src={foundPhoto}
                      alt={localize.found.found_photo}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span
                      className="text-sm"
                      style={{
                        color: COLORS.grey[400],
                      }}
                    >
                      {localize.lost.no_photo}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </section>

          <section>
            <SectionTitle>{localize.found.pet_information}</SectionTitle>

            <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
              <InfoRow label="Name" value={pet.name} />

              <InfoRow label="Species" value={pet.species} />

              <InfoRow label={localize.found.gender} value={pet.gender} />

              <InfoRow label={localize.found.age} value={getPetAge()} />
            </div>
          </section>

          <section>
            <SectionTitle>{localize.found.found_information}</SectionTitle>

            <div className="space-y-5">
              <InfoRow
                label={localize.found.found_loc}
                value={foundReport.foundLocation}
              />

              <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
                <InfoRow
                  label={localize.found.last_seen_date}
                  value={formatDate(foundReport.foundDate)}
                />

                {foundReport.foundTime && (
                  <InfoRow label="Time" value={foundReport.foundTime} />
                )}
              </div>

              {foundReport.nearbyLandmark && (
                <InfoRow
                  label={localize.lost.landmark}
                  value={foundReport.nearbyLandmark}
                />
              )}

              {foundReport.description && (
                <InfoRow
                  label={localize.found.description}
                  value={foundReport.description}
                />
              )}

              {foundReport.additionalDetails && (
                <InfoRow
                  label={localize.found.additional_details}
                  value={foundReport.additionalDetails}
                />
              )}
            </div>
          </section>

          <div
            className="flex items-center justify-between border-t pt-5"
            style={{
              borderColor: COLORS.grey[200],
            }}
          >
            <span
              className="text-sm font-medium"
              style={{
                color: COLORS.grey[600],
              }}
            >
              {localize.lost.report_status}
            </span>

            <span
              className="rounded-full px-3 py-1 text-xs font-semibold"
              style={{
                backgroundColor: getStatusBackgroundColor(),
                color: getStatusColor(),
              }}
            >
              {getStatusLabel()}
            </span>
          </div>
        </div>
      </Modal>

      <ConfirmationModal
        open={confirmationType !== null}
        title={
          confirmationType === "confirm"
            ? localize.notification.confirm_match_title
            : localize.notification.reject_match_title
        }
        message={
          confirmationType === "confirm"
            ? localize.notification.confirm_match_message.replace(
                "{name}",
                pet.name,
              )
            : localize.notification.reject_match_message.replace(
                "{name}",
                pet.name,
              )
        }
        onClose={handleConfirmationClose}
        onConfirm={handleConfirmedAction}
        confirmLabel={
          confirmationType === "confirm"
            ? localize.notification.yes_mark_found
            : localize.notification.not_my_pet
        }
      />
    </>
  );
}

interface SectionTitleProps {
  children: React.ReactNode;
}

function SectionTitle({ children }: SectionTitleProps) {
  return (
    <h3
      className="mb-4 text-sm font-semibold"
      style={{
        color: COLORS.neutral.black,
      }}
    >
      {children}
    </h3>
  );
}

interface InfoRowProps {
  label: string;
  value: string | number;
}

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div>
      <p
        className="text-xs"
        style={{
          color: COLORS.grey[500],
        }}
      >
        {label}
      </p>

      <p
        className="mt-1 break-words text-sm font-medium leading-6"
        style={{
          color: COLORS.neutral.black,
        }}
      >
        {value || "-"}
      </p>
    </div>
  );
}
