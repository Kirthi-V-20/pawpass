"use client";

import { useEffect, useState } from "react";

import { Modal } from "@/components/ui/modal";
import { getFoundPetImage } from "@/lib/imageDb";
import { COLORS } from "@/styles/colors";
import { localize } from "@/utils/localize";

import type { FoundPetReport } from "@/types/foundPet";
import type { Pet } from "@/types/pet";
import type { RecoveryConnection } from "@/types/recovery";

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

    loadPhoto();

    return () => {
      mounted = false;
    };
  }, [open, recovery]);

  if (!open || !recovery || !pet || !foundReport) {
    return null;
  }

  const petPhoto = foundPhoto || pet.photo;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={localize.recovery.recovery_confirmed_title}
      className="max-w-md"
      footer={
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="whitespace-nowrap rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-slate-50"
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
            className="whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium transition-opacity hover:opacity-90"
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
            style={{ color: COLORS.neutral.black }}
          >
            {localize.recovery.pet_found_message.replace("{name}", pet.name)}
          </h3>

          <p
            className="mt-2 text-sm leading-6"
            style={{ color: COLORS.grey[600] }}
          >
            {localize.recovery.recovery_confirmed_message}
          </p>
        </div>

        <div>
          <h4
            className="mb-3 text-sm font-semibold"
            style={{ color: COLORS.neutral.black }}
          >
            {localize.recovery.pet_information}
          </h4>

          <div
            className="rounded-lg p-4"
            style={{ backgroundColor: COLORS.grey[50] }}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm" style={{ color: COLORS.grey[600] }}>
                {pet.name}
              </span>

              <span
                className="rounded-full px-2.5 py-1 text-xs font-medium"
                style={{
                  backgroundColor: COLORS.status.greenLight,
                  color: COLORS.status.green,
                }}
              >
                {localize.recovery.found_status}
              </span>
            </div>
          </div>
        </div>

        <div>
          <h4
            className="mb-3 text-sm font-semibold"
            style={{ color: COLORS.neutral.black }}
          >
            {localize.recovery.found_information}
          </h4>

          <div className="space-y-3">
            <div>
              <p className="text-xs" style={{ color: COLORS.grey[500] }}>
                {localize.recovery.found_location}
              </p>

              <p className="text-sm" style={{ color: COLORS.grey[800] }}>
                {foundReport.foundLocation}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs" style={{ color: COLORS.grey[500] }}>
                  {localize.recovery.date_found}
                </p>

                <p className="text-sm" style={{ color: COLORS.grey[800] }}>
                  {foundReport.foundDate}
                </p>
              </div>

              <div>
                <p className="text-xs" style={{ color: COLORS.grey[500] }}>
                  {localize.recovery.time_found}
                </p>

                <p className="text-sm" style={{ color: COLORS.grey[800] }}>
                  {foundReport.foundTime || localize.recovery.not_available}
                </p>
              </div>
            </div>

            {foundReport.nearbyLandmark && (
              <div>
                <p className="text-xs" style={{ color: COLORS.grey[500] }}>
                  {localize.recovery.nearby_landmark}
                </p>

                <p className="text-sm" style={{ color: COLORS.grey[800] }}>
                  {foundReport.nearbyLandmark}
                </p>
              </div>
            )}
          </div>
        </div>

        <p className="text-sm" style={{ color: COLORS.grey[600] }}>
          {localize.recovery.recovery_contact_note}
        </p>
      </div>
    </Modal>
  );
}
