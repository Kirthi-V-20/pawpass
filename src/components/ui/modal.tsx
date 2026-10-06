"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { ArrowLeftIcon } from "@/icons/ArrowLeftIcon";
import { CloseIcon } from "@/icons/CloseIcon";
import { COLORS } from "@/styles/colors";
import { localize } from "@/utils/localize";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  onBack?: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function Modal({
  open,
  onClose,
  title,
  subtitle,
  onBack,
  children,
  footer,
  className,
}: ModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className={cn(
          "relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden",
          "rounded-md border border-slate-200 bg-white shadow-xl",
          className,
        )}
      >
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-4">
          <div className="flex items-start gap-3">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-md transition hover:bg-slate-100"
                aria-label={localize.common.back}
              >
                <ArrowLeftIcon size={18} color={COLORS.grey[700]} />
              </button>
            )}

            <div>
              <h2
                id="modal-title"
                className="text-lg font-semibold text-slate-900"
              >
                {title}
              </h2>

              {subtitle && (
                <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md transition hover:bg-slate-100"
            aria-label={localize.common.close}
          >
            <CloseIcon size={18} color={COLORS.grey[600]} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>

        {footer && (
          <div className="flex items-center justify-end gap-3 border-t border-slate-200 px-6 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
