"use client";

import { Modal } from "@/components/ui/modal";
import { COLORS } from "@/styles/colors";
import { localize } from "@/utils/localize";

interface ConfirmationModalProps {
  open: boolean;
  title: string;
  message: string;
  onClose: () => void;
  onConfirm: () => void;
  confirmLabel?: string;
}

export default function ConfirmationModal({
  open,
  title,
  message,
  onClose,
  onConfirm,
  confirmLabel,
}: ConfirmationModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      className="max-w-md"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border px-4 py-2 text-sm font-medium transition-colors hover:bg-slate-50"
            style={{
              borderColor: COLORS.grey[300],
              color: COLORS.grey[700],
            }}
          >
            {localize.common.cancel}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="rounded-md px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90"
            style={{
              backgroundColor: COLORS.status.red,
              color: COLORS.neutral.white,
            }}
          >
            {confirmLabel ?? localize.common.delete}
          </button>
        </>
      }
    >
      <p
        className="text-sm leading-6"
        style={{
          color: COLORS.grey[600],
        }}
      >
        {message}
      </p>
    </Modal>
  );
}
