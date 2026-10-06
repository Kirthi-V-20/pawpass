"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";

import { Modal } from "@/components/ui/modal";
import QRViewModal from "@/components/modals/QRViewModal";

import { COLORS } from "@/styles/colors";
import { localize } from "@/utils/localize";

import { MaleIcon, FemaleIcon } from "@/icons/GenderIcons";
import { DownloadIcon } from "@/icons/DownloadIcon";
import { downloadQRCode } from "@/utils/downloadQRCode";

import type { Pet } from "@/types/pet";

interface PetDetailsModalProps {
  open: boolean;
  pet: Pet | null;

  onClose: () => void;

  onReportLost: (pet: Pet) => void;

  onMarkFound: (pet: Pet) => void;
}

export default function PetDetailsModal({
  open,
  pet,
  onClose,
  onReportLost,
  onMarkFound,
}: PetDetailsModalProps) {
  const [isQRViewOpen, setIsQRViewOpen] = useState(false);

  if (!pet) {
    return null;
  }

  const qrData = {
    qrCodeId: pet.qrCodeId,
    name: pet.name,
    species: pet.species,
    gender: pet.gender,
    dateOfBirth: pet.dateOfBirth,
    weight: pet.weight,
  };

  const isLost = pet.status === "LOST";

  const handleLostAction = () => {
    if (isLost) {
      onMarkFound(pet);
      return;
    }

    onReportLost(pet);
  };

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        onBack={onClose}
        title={localize.pets.modal_details_title}
        className="max-w-xl"
        footer={
          <button
            type="button"
            onClick={handleLostAction}
            className="w-full rounded-lg px-4 py-2.5 text-sm font-medium transition-opacity hover:opacity-90"
            style={{
              backgroundColor: isLost ? COLORS.status.green : COLORS.status.red,

              color: COLORS.neutral.white,
            }}
          >
            {isLost ? localize.lost.found : localize.pets.report_lost}
          </button>
        }
      >
        <div className="space-y-6">
          <div className="flex gap-5">
            <div
              className="flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-xl"
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
                  className="flex h-20 w-20 items-center justify-center rounded-full"
                  style={{
                    backgroundColor: COLORS.primary.light,
                    color: COLORS.primary.DEFAULT,
                  }}
                >
                  <span className="text-3xl font-semibold">
                    {pet.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <h3
                className="text-xl font-semibold"
                style={{
                  color: COLORS.neutral.black,
                }}
              >
                {pet.name}
              </h3>

              <p
                className="mt-1 text-sm"
                style={{
                  color: COLORS.grey[600],
                }}
              >
                {pet.species}
              </p>

              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2">
                  {pet.gender === "Male" ? (
                    <MaleIcon size={17} color={COLORS.primary.DEFAULT} />
                  ) : (
                    <FemaleIcon size={17} color={COLORS.primary.DEFAULT} />
                  )}

                  <span
                    className="text-sm"
                    style={{
                      color: COLORS.grey[700],
                    }}
                  >
                    {pet.gender}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
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

                <div className="flex items-center justify-between gap-4">
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
              </div>
            </div>
          </div>

          <div
            className="rounded-lg border p-4"
            style={{
              borderColor: COLORS.grey[200],
              backgroundColor: COLORS.grey[50],
            }}
          >
            <h4
              className="text-sm font-semibold"
              style={{
                color: COLORS.neutral.black,
              }}
            >
              About Pet
            </h4>

            <p
              className="mt-2 text-sm leading-6"
              style={{
                color: COLORS.grey[600],
              }}
            >
              {pet.notes || "No information added about this pet."}
            </p>
          </div>

          <div
            className="rounded-lg border p-4"
            style={{
              borderColor: COLORS.grey[200],
            }}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <h4
                  className="text-sm font-semibold"
                  style={{
                    color: COLORS.neutral.black,
                  }}
                >
                  QR Code
                </h4>

                <p
                  className="mt-1 break-all text-xs"
                  style={{
                    color: COLORS.grey[500],
                  }}
                >
                  {pet.qrCodeId}
                </p>
              </div>

              <div
                className="flex h-20 w-20 shrink-0 items-center justify-center rounded-md border p-1"
                style={{
                  borderColor: COLORS.grey[200],
                  backgroundColor: COLORS.neutral.white,
                }}
              >
                <QRCodeSVG
                  id={`qr-code-${pet.id}`}
                  value={JSON.stringify(qrData)}
                  size={72}
                  level="M"
                />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setIsQRViewOpen(true)}
                className="rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-slate-50"
                style={{
                  borderColor: COLORS.grey[300],
                  color: COLORS.neutral.black,
                }}
              >
                {localize.pets.view_qr}
              </button>

              <button
                type="button"
                onClick={() => downloadQRCode(`qr-code-${pet.id}`, pet.name)}
                className="flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90"
                style={{
                  backgroundColor: COLORS.primary.DEFAULT,
                  color: COLORS.neutral.white,
                }}
              >
                <DownloadIcon size={16} color={COLORS.neutral.white} />

                {localize.pets.download}
              </button>
            </div>
          </div>
        </div>
      </Modal>

      <QRViewModal
        open={isQRViewOpen}
        pet={pet}
        onClose={() => setIsQRViewOpen(false)}
      />
    </>
  );
}
