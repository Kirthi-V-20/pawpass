"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

import { ArrowLeftIcon } from "@/icons/ArrowLeftIcon";
import { CloseIcon } from "@/icons/CloseIcon";

import { COLORS } from "@/styles/colors";
import { localize } from "@/utils/localize";

import { useUIStore } from "@/store/uiStore";

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
  const isSidebarCollapsed = useUIStore((state) => state.isSidebarCollapsed);

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-y-0 right-0 z-50 flex items-center justify-center bg-black/40 p-2 sm:p-4"
      style={{
        left: isSidebarCollapsed ? "5rem" : "16rem",
      }}
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
          "relative flex max-h-[calc(100vh-1rem)] w-full min-w-0 max-w-lg flex-col overflow-hidden",
          "rounded-md border border-slate-200 bg-white shadow-xl",
          "sm:max-h-[90vh]",
          className,
        )}
      >
        <div className="flex min-w-0 items-start justify-between gap-3 border-b border-slate-200 px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex min-w-0 items-start gap-2 sm:gap-3">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md transition hover:bg-slate-100"
                aria-label={localize.common.back}
              >
                <ArrowLeftIcon size={18} color={COLORS.grey[700]} />
              </button>
            )}

            <div className="min-w-0">
              <h2
                id="modal-title"
                className="break-words text-base font-semibold text-slate-900 sm:text-lg"
              >
                {title}
              </h2>

              {subtitle && (
                <p className="mt-1 break-words text-sm text-slate-500">
                  {subtitle}
                </p>
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

        <div className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">
          {children}
        </div>

        {footer && (
          <div className="min-w-0 border-t border-slate-200 px-4 py-3 sm:px-6 sm:py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
