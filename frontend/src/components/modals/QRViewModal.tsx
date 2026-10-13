"use client";

import { QRCodeSVG } from "qrcode.react";

import { Modal } from "@/components/ui/modal";
import { COLORS } from "@/styles/colors";
import type { Pet } from "@/types/pet";

interface QRViewModalProps {
  open: boolean;
  pet: Pet | null;
  onClose: () => void;
}

export default function QRViewModal({ open, pet, onClose }: QRViewModalProps) {
  if (!pet) return null;

  const qrData = {
    qrCodeId: pet.qrCodeId,
    name: pet.name,
    species: pet.species,
    gender: pet.gender,
    dateOfBirth: pet.dateOfBirth,
    weight: pet.weight,
  };
  return (
    <Modal open={open} onClose={onClose} title="QR Code" className="max-w-sm">
      <div className="flex flex-col items-center">
        <h3
          className="text-lg font-semibold"
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
          Scan this QR code to view {pet.name}'s profile
        </p>

        <div
          className="mt-6 rounded-xl border p-4"
          style={{
            borderColor: COLORS.grey[200],
            backgroundColor: COLORS.neutral.white,
          }}
        >
          <QRCodeSVG value={JSON.stringify(qrData)} size={220} level="M" />
        </div>

        <p
          className="mt-4 text-xs"
          style={{
            color: COLORS.grey[500],
          }}
        >
          {pet.qrCodeId}
        </p>
      </div>
    </Modal>
  );
}
