"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { QRCodeSVG } from "qrcode.react";

import { Modal } from "@/components/ui/modal";
import QRViewModal from "@/components/modals/QRViewModal";

import { COLORS } from "@/styles/colors";
import { localize } from "@/utils/localize";

import { MaleIcon, FemaleIcon } from "@/icons/GenderIcons";
import { DownloadIcon } from "@/icons/DownloadIcon";
import { downloadQRCode } from "@/utils/downloadQRCode";

import type { Pet } from "@/types/pet";
import type { LostPetReport } from "@/types/lostPet";

const LocationMap = dynamic(
  () => import("@/components/shared/LocationPicker/LocationMap"),
  {
    ssr: false,
  },
);

interface LostPetDetailsModalProps {
  open: boolean;
  pet: Pet | null;
  report: LostPetReport | null;
  onClose: () => void;
  onMarkAsFound: () => void;
}

export default function LostPetDetailsModal({
  open,
  pet,
  report,
  onClose,
  onMarkAsFound,
}: LostPetDetailsModalProps) {
  const [isQRViewOpen, setIsQRViewOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);

  if (!pet || !report) {
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

  const mapPosition: [number, number] = [report.latitude, report.longitude];

  const calculateAge = () => {
    const birthDate = new Date(pet.dateOfBirth);
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
        title={localize.lost.details}
        className="max-w-xl"
        footer={
          <button
            type="button"
            onClick={onMarkAsFound}
            className="w-full rounded-lg px-4 py-2.5 text-sm font-medium transition-opacity hover:opacity-90"
            style={{
              backgroundColor: COLORS.status.green,
              color: COLORS.neutral.white,
            }}
          >
            {localize.lost.mark_as_found}
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
              <div className="flex items-start justify-between gap-3">
                <div>
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
                </div>

                <span
                  className="rounded-full px-3 py-1 text-xs font-semibold"
                  style={{
                    backgroundColor: COLORS.status.red,
                    color: COLORS.neutral.white,
                  }}
                >
                  {localize.lost.status_lost}
                </span>
              </div>

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
                    {localize.lost.age}
                  </span>

                  <span
                    className="text-sm font-medium"
                    style={{
                      color: COLORS.neutral.black,
                    }}
                  >
                    {calculateAge()}
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
                    {localize.lost.weight}
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
              {localize.pets.about_pet}
            </h4>

            <p
              className="mt-2 text-sm leading-6"
              style={{
                color: COLORS.grey[600],
              }}
            >
              {pet.notes || localize.pets.no_information}
            </p>
          </div>

          {/* QR Code */}
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
                  {localize.pets.qr_code}
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
                  id={`lost-qr-code-${pet.id}`}
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
                onClick={() =>
                  downloadQRCode(`lost-qr-code-${pet.id}`, pet.name)
                }
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

          <div
            className="rounded-lg border p-4"
            style={{
              borderColor: COLORS.grey[200],
            }}
          >
            <div className="flex items-center justify-between gap-3">
              <h4
                className="text-sm font-semibold"
                style={{
                  color: COLORS.neutral.black,
                }}
              >
                {localize.lost.last_seen_loc}
              </h4>
            </div>

            <button
              type="button"
              onClick={() => setIsMapOpen(true)}
              className="mt-3 w-full rounded-lg border p-3 text-left transition-colors hover:bg-slate-50"
              style={{
                borderColor: COLORS.grey[200],
              }}
            >
              <p
                className="text-sm font-medium"
                style={{
                  color: COLORS.neutral.black,
                }}
              >
                {report.lastSeenLocation}
              </p>

              <p
                className="mt-1 text-xs"
                style={{
                  color: COLORS.grey[500],
                }}
              >
                {localize.lost.open_map}
              </p>
            </button>

            <div className="mt-3 grid grid-cols-2 gap-4">
              <div>
                <p
                  className="text-xs"
                  style={{
                    color: COLORS.grey[500],
                  }}
                >
                  {localize.lost.last_seen_date}
                </p>

                <p
                  className="mt-1 text-sm font-medium"
                  style={{
                    color: COLORS.neutral.black,
                  }}
                >
                  {report.lastSeenDate}
                </p>
              </div>

              <div>
                <p
                  className="text-xs"
                  style={{
                    color: COLORS.grey[500],
                  }}
                >
                  {localize.lost.last_seen_time}
                </p>

                <p
                  className="mt-1 text-sm font-medium"
                  style={{
                    color: COLORS.neutral.black,
                  }}
                >
                  {report.lastSeenTime || "-"}
                </p>
              </div>
            </div>

            {report.nearbyLandmark && (
              <div className="mt-4">
                <p
                  className="text-xs"
                  style={{
                    color: COLORS.grey[500],
                  }}
                >
                  {localize.lost.landmark}
                </p>

                <p
                  className="mt-1 text-sm"
                  style={{
                    color: COLORS.grey[700],
                  }}
                >
                  {report.nearbyLandmark}
                </p>
              </div>
            )}
          </div>

          {report.description && (
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
                {localize.lost.description}
              </h4>

              <p
                className="mt-2 text-sm leading-6"
                style={{
                  color: COLORS.grey[600],
                }}
              >
                {report.description}
              </p>
            </div>
          )}

          {report.photo && (
            <div
              className="rounded-lg border p-4"
              style={{
                borderColor: COLORS.grey[200],
              }}
            >
              <h4
                className="text-sm font-semibold"
                style={{
                  color: COLORS.neutral.black,
                }}
              >
                {localize.lost.recent_photo}
              </h4>

              <div className="mt-3 overflow-hidden rounded-lg">
                <img
                  src={report.photo}
                  alt={pet.name}
                  className="h-48 w-full object-cover"
                />
              </div>
            </div>
          )}

          <div
            className="rounded-lg border p-4"
            style={{
              borderColor: COLORS.grey[200],
            }}
          >
            <div className="flex items-center justify-between gap-4">
              <span
                className="text-sm"
                style={{
                  color: COLORS.grey[500],
                }}
              >
                {localize.lost.pet_id}
              </span>

              <span
                className="text-sm font-medium"
                style={{
                  color: COLORS.neutral.black,
                }}
              >
                {pet.id}
              </span>
            </div>

            <div className="mt-2 flex items-center justify-between gap-4">
              <span
                className="text-sm"
                style={{
                  color: COLORS.grey[500],
                }}
              >
                {localize.lost.report_status}
              </span>

              <span
                className="text-sm font-medium"
                style={{
                  color: COLORS.status.red,
                }}
              >
                {localize.lost.status_lost}
              </span>
            </div>
          </div>
        </div>
      </Modal>

      <QRViewModal
        open={isQRViewOpen}
        pet={pet}
        onClose={() => setIsQRViewOpen(false)}
      />

      <Modal
        open={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        onBack={() => setIsMapOpen(false)}
        title={localize.lost.last_seen_loc}
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
          {report.lastSeenLocation}
        </p>
      </Modal>
    </>
  );
}
