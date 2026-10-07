"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

import { Modal } from "@/components/ui/modal";

import { getFoundPetImage } from "@/lib/imageDb";

import { COLORS } from "@/styles/colors";
import { localize } from "@/utils/localize";

import { MaleIcon, FemaleIcon } from "@/icons/GenderIcons";

import type { FoundPetReport } from "@/types/foundPet";
import type { Pet } from "@/types/pet";
import type { RecoveryConnection } from "@/types/recovery";

const LocationMap = dynamic(
  () => import("@/components/shared/LocationPicker/LocationMap"),
  {
    ssr: false,
  },
);

interface RecoveryConfirmedModalProps {
  open: boolean;
  recovery: RecoveryConnection | null;
  pet: Pet | null;
  foundReport: FoundPetReport | null;
  onClose: () => void;
  onViewRecovery: () => void;
}

export default function RecoveryConfirmedModal({
  open,
  recovery,
  pet,
  foundReport,
  onClose,
  onViewRecovery,
}: RecoveryConfirmedModalProps) {
  const [foundPhoto, setFoundPhoto] = useState<string | null>(null);
  const [isMapOpen, setIsMapOpen] = useState(false);

  useEffect(() => {
    if (!open || !recovery) {
      setFoundPhoto(null);
      return;
    }

    let mounted = true;

    const loadPhoto = async () => {
      try {
        const image = await getFoundPetImage(recovery.foundReportId);

        if (mounted) {
          setFoundPhoto(image);
        }
      } catch {
        if (mounted) {
          setFoundPhoto(null);
        }
      }
    };

    void loadPhoto();

    return () => {
      mounted = false;
    };
  }, [open, recovery]);

  useEffect(() => {
    if (!open) {
      setIsMapOpen(false);
    }
  }, [open]);

  if (!open || !recovery || !pet || !foundReport) {
    return null;
  }

  const petPhoto = foundPhoto || pet.photo;

  const mapPosition: [number, number] = [
    foundReport.latitude,
    foundReport.longitude,
  ];

  const calculateAge = () => {
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

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        onBack={onClose}
        title={localize.recovery.recovery_confirmed_title}
        className="max-w-xl"
        footer={
          <div className="flex w-full flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
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
              onClick={onViewRecovery}
              className="rounded-lg px-4 py-2.5 text-sm font-medium transition-opacity hover:opacity-90"
              style={{
                backgroundColor: COLORS.primary.DEFAULT,
                color: COLORS.neutral.white,
              }}
            >
              {localize.recovery.view_recovery_details}
            </button>
          </div>
        }
      >
        <div className="space-y-6">
          <div className="flex flex-col items-center text-center">
            <div
              className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full"
              style={{
                backgroundColor: COLORS.primary.background,
              }}
            >
              {petPhoto ? (
                <img
                  src={petPhoto}
                  alt={pet.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span
                  className="text-3xl font-semibold"
                  style={{
                    color: COLORS.primary.DEFAULT,
                  }}
                >
                  {pet.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>

            <h3
              className="mt-4 text-xl font-semibold"
              style={{
                color: COLORS.neutral.black,
              }}
            >
              {localize.recovery.pet_found_message.replace("{name}", pet.name)}
            </h3>

            <div
              className="mt-4 w-full rounded-lg px-4 py-3 text-left"
              style={{
                backgroundColor: COLORS.status.greenLight,
              }}
            >
              <p
                className="text-sm font-medium"
                style={{
                  color: COLORS.status.green,
                }}
              >
                {localize.recovery.recovery_confirmed_message}
              </p>

              <p
                className="mt-1 text-sm leading-6"
                style={{
                  color: COLORS.grey[600],
                }}
              >
                {localize.recovery.recovery_contact_note}
              </p>
            </div>
          </div>

          <section>
            <SectionTitle>{localize.recovery.pet_information}</SectionTitle>

            <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
              <InfoRow label="Name" value={pet.name} />

              <InfoRow label="Species" value={pet.species} />

              <div>
                <p
                  className="text-xs"
                  style={{
                    color: COLORS.grey[500],
                  }}
                >
                  {localize.found.gender}
                </p>

                <div className="mt-1 flex items-center gap-2">
                  {pet.gender === "Male" ? (
                    <MaleIcon size={17} color={COLORS.primary.DEFAULT} />
                  ) : (
                    <FemaleIcon size={17} color={COLORS.primary.DEFAULT} />
                  )}

                  <span
                    className="text-sm font-medium"
                    style={{
                      color: COLORS.neutral.black,
                    }}
                  >
                    {pet.gender}
                  </span>
                </div>
              </div>

              <InfoRow label={localize.found.age} value={calculateAge()} />

              <InfoRow label={localize.pets.dob} value={pet.dateOfBirth} />

              <InfoRow
                label={localize.lost.weight}
                value={pet.weight ? `${pet.weight} kg` : "-"}
              />

              <div>
                <p
                  className="text-xs"
                  style={{
                    color: COLORS.grey[500],
                  }}
                >
                  {localize.lost.report_status}
                </p>

                <span
                  className="mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold"
                  style={{
                    backgroundColor: COLORS.status.greenLight,
                    color: COLORS.status.green,
                  }}
                >
                  {localize.recovery.found_status}
                </span>
              </div>

              <InfoRow label={localize.lost.pet_id} value={pet.id} />
            </div>
          </section>

          {pet.notes && (
            <section>
              <SectionTitle>{localize.pets.about_pet}</SectionTitle>

              <p
                className="text-sm leading-6"
                style={{
                  color: COLORS.grey[600],
                }}
              >
                {pet.notes}
              </p>
            </section>
          )}

          <div
            className="border-t"
            style={{
              borderColor: COLORS.grey[200],
            }}
          />

          <section>
            <SectionTitle>{localize.recovery.found_information}</SectionTitle>

            <div>
              <p
                className="text-xs"
                style={{
                  color: COLORS.grey[500],
                }}
              >
                {localize.recovery.found_location}
              </p>

              <button
                type="button"
                onClick={() => setIsMapOpen(true)}
                className="mt-2 w-full rounded-lg border p-3 text-left transition-colors hover:bg-slate-50"
                style={{
                  borderColor: COLORS.grey[200],
                }}
              >
                <p
                  className="break-words text-sm font-medium"
                  style={{
                    color: COLORS.neutral.black,
                  }}
                >
                  {foundReport.foundLocation}
                </p>

                <p
                  className="mt-1 text-xs"
                  style={{
                    color: COLORS.primary.DEFAULT,
                  }}
                >
                  {localize.lost.open_map}
                </p>
              </button>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <InfoRow
                label={localize.recovery.date_found}
                value={foundReport.foundDate}
              />

              <InfoRow
                label={localize.recovery.time_found}
                value={foundReport.foundTime || localize.recovery.not_available}
              />
            </div>

            {foundReport.nearbyLandmark && (
              <div className="mt-4">
                <InfoRow
                  label={localize.recovery.nearby_landmark}
                  value={foundReport.nearbyLandmark}
                />
              </div>
            )}

            {foundReport.description && (
              <div className="mt-4">
                <InfoRow
                  label={localize.found.description}
                  value={foundReport.description}
                />
              </div>
            )}

            {foundReport.additionalDetails && (
              <div className="mt-4">
                <InfoRow
                  label={localize.found.additional_details}
                  value={foundReport.additionalDetails}
                />
              </div>
            )}
          </section>
        </div>
      </Modal>

      <Modal
        open={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        onBack={() => setIsMapOpen(false)}
        title={localize.recovery.found_location}
        className="max-w-4xl"
      >
        <div className="h-[500px] w-full overflow-hidden rounded-lg">
          <LocationMap position={mapPosition} selectedPosition={mapPosition} />
        </div>

        <p
          className="mt-4 text-sm font-medium"
          style={{
            color: COLORS.neutral.black,
          }}
        >
          {foundReport.foundLocation}
        </p>
      </Modal>
    </>
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
        className="mt-1 break-words text-sm font-medium"
        style={{
          color: COLORS.neutral.black,
        }}
      >
        {value || "-"}
      </p>
    </div>
  );
}

interface SectionTitleProps {
  children: React.ReactNode;
}

function SectionTitle({ children }: SectionTitleProps) {
  return (
    <h4
      className="mb-3 text-sm font-semibold"
      style={{
        color: COLORS.neutral.black,
      }}
    >
      {children}
    </h4>
  );
}
