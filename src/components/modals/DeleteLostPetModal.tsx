"use client";

import ConfirmationModal from "@/components/modals/ConfirmationModal";
import { localize } from "@/utils/localize";

interface DeleteLostPetModalProps {
  open: boolean;
  petName: string;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteLostPetModal({
  open,
  petName,
  onClose,
  onConfirm,
}: DeleteLostPetModalProps) {
  return (
    <ConfirmationModal
      open={open}
      title={localize.pets.delete_confirmation_title}
      message={localize.pets.delete_confirmation.replace("{name}", petName)}
      onClose={onClose}
      onConfirm={onConfirm}
    />
  );
}
