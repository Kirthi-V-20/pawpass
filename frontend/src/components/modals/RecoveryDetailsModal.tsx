"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

import { Modal } from "@/components/ui/modal";

import { useAuthStore } from "@/store/authStore";
import { useProfileStore } from "@/store/profileStore";

import { getFoundPetImage } from "@/lib/imageDb";

import { MaleIcon, FemaleIcon } from "@/icons/GenderIcons";

import { COLORS } from "@/styles/colors";
import { localize } from "@/utils/localize";

import type { FoundPetReport } from "@/types/foundPet";
import type { Pet } from "@/types/pet";
import type { RecoveryConnection } from "@/types/recovery";

const LocationMap = dynamic(
  () => import("@/components/shared/LocationPicker/LocationMap"),
  {
    ssr: false,
  },
);

interface RecoveryDetailsModalProps {
  open: boolean;
  recovery: RecoveryConnection | null;
  pet: Pet | null;
  foundReport: FoundPetReport | null;
  onClose: () => void;
}

export default function RecoveryDetailsModal({
  open,
  recovery,
  pet,
  foundReport,
  onClose,
}: RecoveryDetailsModalProps) {
  const user = useAuthStore((state) => state.user);
  const getProfile = useProfileStore((state) => state.getProfile);

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

  if (!open || !recovery || !pet || !foundReport || !user) {
    return null;
  }

  const isOwner = recovery.ownerId === user.id;
  const isFinder = recovery.finderId === user.id;

  if (!isOwner && !isFinder) {
    return null;
  }

  const contactUserId = isOwner ? recovery.finderId : recovery.ownerId;

  const contactProfile = getProfile(contactUserId);

  const contactName = isOwner
    ? contactProfile?.fullName?.trim() || recovery.finderName
    : contactProfile?.fullName?.trim() || recovery.ownerName;

  const contactEmail = isOwner
    ? contactProfile?.email?.trim() || recovery.finderEmail
    : contactProfile?.email?.trim() || recovery.ownerEmail;

  const contactPhone = contactProfile?.phone?.trim() || "";

  const contactRole = isOwner
    ? localize.recovery.found_by
    : localize.recovery.pet_owner;

  const petPhoto = foundPhoto || pet.photo;

  const recoveryMessage = isOwner
    ? localize.recovery.owner_recovery_message.replace("{name}", pet.name)
    : localize.recovery.finder_recovery_message.replace("{name}", pet.name);

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

  const mapPosition: [number, number] = [
    foundReport.latitude,
    foundReport.longitude,
  ];

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        onBack={onClose}
        title={localize.recovery.recovery_details}
        className="max-w-xl"
        footer={
          <div className="flex w-full justify-end">
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-slate-50 sm:w-auto"
              style={{
                borderColor: COLORS.grey[300],
                color: COLORS.grey[700],
              }}
            >
              {localize.common.close}
            </button>
          </div>
        }
      >
        <div className="min-w-0 space-y-6">
          <div className="flex flex-col items-center text-center">
            {petPhoto ? (
              <img
                src={petPhoto}
                alt={pet.name}
                className="h-24 w-24 rounded-full object-cover"
              />
            ) : (
              <div
                className="flex h-24 w-24 items-center justify-center rounded-full"
                style={{
                  backgroundColor: COLORS.grey[100],
                  color: COLORS.grey[500],
                }}
              >
                {localize.common.pet_image_alt}
              </div>
            )}

            <h3
              className="mt-4 text-lg font-semibold"
              style={{
                color: COLORS.neutral.black,
              }}
            >
              {localize.recovery.recovery_confirmed}
            </h3>

            <p
              className="mt-2 max-w-md break-words text-sm leading-6"
              style={{
                color: COLORS.status.green,
              }}
            >
              {recoveryMessage}
            </p>
          </div>

          <section>
            <SectionTitle>{localize.recovery.pet_information}</SectionTitle>

            <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
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

          <Divider />

          <section>
            <SectionTitle>{localize.recovery.found_information}</SectionTitle>

            <div className="min-w-0">
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
                className="mt-2 w-full min-w-0 overflow-hidden rounded-lg border p-3 text-left transition-colors hover:bg-slate-50"
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

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
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
              <div className="mt-4 min-w-0">
                <InfoRow
                  label={localize.found.description}
                  value={foundReport.description}
                />
              </div>
            )}

            {foundReport.additionalDetails && (
              <div className="mt-4 min-w-0">
                <InfoRow
                  label={localize.found.additional_details}
                  value={foundReport.additionalDetails}
                />
              </div>
            )}
          </section>

          <Divider />

          <section>
            <SectionTitle>{contactRole}</SectionTitle>

            <div className="min-w-0 space-y-4">
              <InfoRow
                label={localize.recovery.name}
                value={contactName || localize.recovery.name_not_available}
              />

              <InfoRow
                label={localize.recovery.email}
                value={contactEmail || localize.recovery.not_available}
              />

              <InfoRow
                label={localize.recovery.phone}
                value={contactPhone || localize.recovery.not_available}
              />

              <div className="flex flex-col gap-3 pt-1 sm:flex-row">
                {contactPhone && (
                  <a
                    href={`tel:${contactPhone}`}
                    className="w-full rounded-lg px-14 py-2.5 text-center text-sm font-medium transition-opacity hover:opacity-90 sm:w-auto"
                    style={{
                      backgroundColor: COLORS.primary.DEFAULT,
                      color: COLORS.neutral.white,
                    }}
                  >
                    {localize.recovery.call}
                  </a>
                )}

                {contactEmail && (
                  <a
                    href={`mailto:${contactEmail}`}
                    className="w-full rounded-lg border px-12 py-2.5 text-center text-sm font-medium transition-colors hover:bg-slate-50 sm:w-auto"
                    style={{
                      borderColor: COLORS.grey[300],
                      color: COLORS.grey[700],
                    }}
                  >
                    {localize.recovery.email}
                  </a>
                )}
              </div>
            </div>
          </section>
        </div>
      </Modal>

      <Modal
        open={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        onBack={() => setIsMapOpen(false)}
        title={localize.recovery.found_location}
        className="w-full max-w-4xl"
      >
        <div className="h-[350px] w-full overflow-hidden rounded-lg sm:h-[500px]">
          <LocationMap position={mapPosition} selectedPosition={mapPosition} />
        </div>

        <p
          className="mt-4 break-words text-sm font-medium"
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
    <div className="min-w-0">
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

function Divider() {
  return (
    <div
      className="border-t"
      style={{
        borderColor: COLORS.grey[200],
      }}
    />
  );
}
