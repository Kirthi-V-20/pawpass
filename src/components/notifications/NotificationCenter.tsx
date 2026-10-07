"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import FoundReportDetailsModal from "@/components/modals/FoundReportDetailsModal";
import RecoveryConfirmedModal from "@/components/modals/RecoveryConfirmedModal";
import RecoveryDetailsModal from "@/components/modals/RecoveryDetailsModal";

import { useAuthStore } from "@/store/authStore";
import { useFoundPetStore } from "@/store/foundPetStore";
import { useLostPetStore } from "@/store/lostPetStore";
import { useNotificationStore } from "@/store/notificationStore";
import { usePetStore } from "@/store/petStore";
import { useProfileStore } from "@/store/profileStore";
import { useRecoveryStore } from "@/store/recoveryStore";

import DeleteIcon from "@/icons/DeleteIcon";
import { COLORS } from "@/styles/colors";
import { localize } from "@/utils/localize";

import type { Notification } from "@/types/notification";

interface NotificationCenterProps {
  open: boolean;
  onClose: () => void;
}

export default function NotificationCenter({
  open,
  onClose,
}: NotificationCenterProps) {
  const notificationRef = useRef<HTMLDivElement>(null);

  const user = useAuthStore((state) => state.user);

  const notifications = useNotificationStore((state) => state.notifications);

  const addNotification = useNotificationStore(
    (state) => state.addNotification,
  );

  const markAsRead = useNotificationStore((state) => state.markAsRead);

  const deleteNotification = useNotificationStore(
    (state) => state.deleteNotification,
  );

  const clearNotifications = useNotificationStore(
    (state) => state.clearNotifications,
  );

  const foundPets = useFoundPetStore((state) => state.foundPets);

  const updateFoundPet = useFoundPetStore((state) => state.updateFoundPet);

  const lostPets = useLostPetStore((state) => state.lostPets);

  const updateLostPet = useLostPetStore((state) => state.updateLostPet);

  const pets = usePetStore((state) => state.pets);

  const updatePet = usePetStore((state) => state.updatePet);

  const addRecovery = useRecoveryStore((state) => state.addRecovery);

  const recoveries = useRecoveryStore((state) => state.recoveries);

  const getProfile = useProfileStore((state) => state.getProfile);

  const [selectedFoundReportId, setSelectedFoundReportId] = useState<
    string | null
  >(null);

  const [selectedRecoveryId, setSelectedRecoveryId] = useState<string | null>(
    null,
  );

  const [recoveryDetailsId, setRecoveryDetailsId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleOutsideClick = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [open, onClose]);

  const visibleNotifications = useMemo(() => {
    if (!user) {
      return [];
    }

    return notifications
      .filter((notification) => notification.userId === user.id)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }, [notifications, user]);

  const selectedFoundReport = useMemo(() => {
    if (!selectedFoundReportId) {
      return null;
    }

    return (
      foundPets.find((report) => report.id === selectedFoundReportId) ?? null
    );
  }, [foundPets, selectedFoundReportId]);

  const selectedLostReport = useMemo(() => {
    if (!selectedFoundReport) {
      return null;
    }

    return (
      lostPets.find(
        (report) => report.id === selectedFoundReport.lostReportId,
      ) ?? null
    );
  }, [lostPets, selectedFoundReport]);

  const selectedPet = useMemo(() => {
    if (!selectedFoundReport) {
      return null;
    }

    return pets.find((pet) => pet.id === selectedFoundReport.petId) ?? null;
  }, [pets, selectedFoundReport]);

  const selectedRecovery = useMemo(() => {
    if (!selectedRecoveryId) {
      return null;
    }

    return (
      recoveries.find((recovery) => recovery.id === selectedRecoveryId) ?? null
    );
  }, [recoveries, selectedRecoveryId]);

  const recoveryDetails = useMemo(() => {
    if (!recoveryDetailsId) {
      return null;
    }

    return (
      recoveries.find((recovery) => recovery.id === recoveryDetailsId) ?? null
    );
  }, [recoveries, recoveryDetailsId]);

  const selectedRecoveryFoundReport = useMemo(() => {
    if (!selectedRecovery) {
      return null;
    }

    return (
      foundPets.find(
        (report) => report.id === selectedRecovery.foundReportId,
      ) ?? null
    );
  }, [foundPets, selectedRecovery]);

  const recoveryDetailsFoundReport = useMemo(() => {
    if (!recoveryDetails) {
      return null;
    }

    return (
      foundPets.find((report) => report.id === recoveryDetails.foundReportId) ??
      null
    );
  }, [foundPets, recoveryDetails]);

  const selectedRecoveryPet = useMemo(() => {
    if (!selectedRecovery) {
      return null;
    }

    return pets.find((pet) => pet.id === selectedRecovery.petId) ?? null;
  }, [pets, selectedRecovery]);

  const recoveryDetailsPet = useMemo(() => {
    if (!recoveryDetails) {
      return null;
    }

    return pets.find((pet) => pet.id === recoveryDetails.petId) ?? null;
  }, [pets, recoveryDetails]);

  const handleDeleteNotification = (
    event: React.MouseEvent<HTMLButtonElement>,
    notificationId: string,
  ) => {
    event.stopPropagation();

    deleteNotification(notificationId);
  };

  const handleDeleteAllNotifications = () => {
    if (!user) {
      return;
    }

    clearNotifications(user.id);
  };

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);

    if (notification.type === "POSSIBLE_MATCH") {
      if (!notification.relatedId || !user) {
        return;
      }

      const foundReport = foundPets.find(
        (report) => report.id === notification.relatedId,
      );

      if (!foundReport) {
        return;
      }

      const lostReport = lostPets.find(
        (report) => report.id === foundReport.lostReportId,
      );

      if (!lostReport) {
        return;
      }

      if (lostReport.ownerId !== user.id) {
        return;
      }

      setSelectedRecoveryId(null);
      setRecoveryDetailsId(null);
      setSelectedFoundReportId(foundReport.id);

      return;
    }

    if (notification.type === "FOUND_REPORT_CONFIRMED") {
      if (!notification.relatedId || !user) {
        return;
      }

      const recovery = recoveries.find(
        (item) => item.id === notification.relatedId,
      );

      if (!recovery) {
        return;
      }

      if (recovery.finderId !== user.id) {
        return;
      }

      setSelectedFoundReportId(null);
      setRecoveryDetailsId(null);
      setSelectedRecoveryId(recovery.id);

      return;
    }

    if (notification.type === "RECOVERY_CONFIRMED") {
      if (!notification.relatedId || !user) {
        return;
      }

      const recovery = recoveries.find(
        (item) => item.id === notification.relatedId,
      );

      if (!recovery) {
        return;
      }

      if (recovery.ownerId !== user.id) {
        return;
      }

      setSelectedFoundReportId(null);
      setRecoveryDetailsId(null);
      setSelectedRecoveryId(recovery.id);
    }
  };

  const handleConfirmMatch = () => {
    if (!user || !selectedFoundReport || !selectedLostReport || !selectedPet) {
      return;
    }

    if (selectedLostReport.ownerId !== user.id) {
      return;
    }

    const ownerProfile = getProfile(selectedLostReport.ownerId);

    const finderProfile = getProfile(selectedFoundReport.finderId);

    const ownerName = ownerProfile?.fullName?.trim() || user.fullName;

    const ownerEmail = ownerProfile?.email?.trim() || user.email;

    const ownerPhone = ownerProfile?.phone?.trim() || "";

    const finderName = finderProfile?.fullName?.trim() || "";

    const finderEmail = finderProfile?.email?.trim() || "";

    const finderPhone = finderProfile?.phone?.trim() || "";

    const recoveryId = crypto.randomUUID();

    const recovery = {
      id: recoveryId,

      foundReportId: selectedFoundReport.id,

      lostReportId: selectedLostReport.id,

      petId: selectedPet.id,

      ownerId: selectedLostReport.ownerId,

      finderId: selectedFoundReport.finderId,

      ownerName,

      ownerEmail,

      ownerPhone,

      finderName,

      finderEmail,

      finderPhone,

      foundLocation: selectedFoundReport.foundLocation,

      foundDate: selectedFoundReport.foundDate,

      foundTime: selectedFoundReport.foundTime,

      status: "ACTIVE" as const,

      createdAt: new Date().toISOString(),
    };

    updateFoundPet(selectedFoundReport.id, {
      status: "MATCH_CONFIRMED",
    });

    updateLostPet(selectedLostReport.id, {
      status: "RESOLVED",
    });

    updatePet(selectedPet.id, {
      status: "FOUND",
    });

    addRecovery(recovery);

    addNotification({
      id: crypto.randomUUID(),

      userId: selectedFoundReport.finderId,

      type: "FOUND_REPORT_CONFIRMED",

      title: localize.notification.match_confirmed_title,

      message: localize.notification.match_confirmed_message.replace(
        "{name}",
        selectedPet.name,
      ),

      relatedId: recoveryId,

      isRead: false,

      createdAt: new Date().toISOString(),
    });

    addNotification({
      id: crypto.randomUUID(),

      userId: selectedLostReport.ownerId,

      type: "RECOVERY_CONFIRMED",

      title: localize.notification.recovery_confirmed_title,

      message: localize.notification.recovery_confirmed_message
        .replace("{finder}", finderName || localize.notification.someone)
        .replace("{name}", selectedPet.name),

      relatedId: recoveryId,

      isRead: false,

      createdAt: new Date().toISOString(),
    });

    setSelectedFoundReportId(null);

    setSelectedRecoveryId(recoveryId);
  };

  const handleDismissMatch = () => {
    if (!user || !selectedFoundReport || !selectedLostReport || !selectedPet) {
      return;
    }

    if (selectedLostReport.ownerId !== user.id) {
      return;
    }

    updateFoundPet(selectedFoundReport.id, {
      status: "REJECTED",
    });

    addNotification({
      id: crypto.randomUUID(),

      userId: selectedFoundReport.finderId,

      type: "FOUND_REPORT_REJECTED",

      title: localize.notification.match_rejected_title,

      message: localize.notification.match_rejected_message.replace(
        "{name}",
        selectedPet.name,
      ),

      relatedId: selectedFoundReport.id,

      isRead: false,

      createdAt: new Date().toISOString(),
    });

    setSelectedFoundReportId(null);
  };

  const handleCloseFoundReportModal = () => {
    setSelectedFoundReportId(null);
  };

  const handleCloseRecoveryModal = () => {
    setSelectedRecoveryId(null);
  };

  const handleViewRecovery = () => {
    if (!selectedRecovery) {
      return;
    }

    setRecoveryDetailsId(selectedRecovery.id);

    setSelectedRecoveryId(null);
  };

  const handleCloseRecoveryDetails = () => {
    setRecoveryDetailsId(null);
  };

  if (!open) {
    return null;
  }

  return (
    <>
      <div
        ref={notificationRef}
        className="absolute right-0 top-12 z-50 w-[360px] overflow-hidden rounded-xl border shadow-lg"
        style={{
          borderColor: COLORS.grey[200],
          backgroundColor: COLORS.neutral.white,
        }}
      >
        <div
          className="flex items-center justify-between border-b px-4 py-3"
          style={{
            borderColor: COLORS.grey[200],
          }}
        >
          <h3
            className="text-sm font-semibold"
            style={{
              color: COLORS.neutral.black,
            }}
          >
            {localize.notification.title}
          </h3>

          <div className="flex items-center gap-3">
            {visibleNotifications.length > 0 && (
              <button
                type="button"
                onClick={handleDeleteAllNotifications}
                className="text-xs font-medium transition-opacity hover:opacity-70"
                style={{
                  color: COLORS.status.red,
                }}
              >
                {localize.notification.delete_all}
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="text-xs font-medium"
              style={{
                color: COLORS.grey[500],
              }}
            >
              {localize.common.close}
            </button>
          </div>
        </div>

        <div className="max-h-[350px] overflow-y-auto">
          {visibleNotifications.length === 0 ? (
            <div className="px-4 py-10 text-center">
              <p
                className="text-sm"
                style={{
                  color: COLORS.grey[500],
                }}
              >
                {localize.notification.no_notifications}
              </p>
            </div>
          ) : (
            visibleNotifications.map((notification) => {
              const isPossibleMatch = notification.type === "POSSIBLE_MATCH";

              const isConfirmed =
                notification.type === "FOUND_REPORT_CONFIRMED";

              const isRecoveryConfirmed =
                notification.type === "RECOVERY_CONFIRMED";

              return (
                <div
                  key={notification.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleNotificationClick(notification)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();

                      handleNotificationClick(notification);
                    }
                  }}
                  className="cursor-pointer border-b px-4 py-4 text-left transition-colors hover:bg-slate-50"
                  style={{
                    borderColor: COLORS.grey[100],

                    backgroundColor: notification.isRead
                      ? COLORS.neutral.white
                      : COLORS.primary.background,
                  }}
                >
                  <div className="flex gap-3">
                    <div
                      className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{
                        backgroundColor: notification.isRead
                          ? COLORS.grey[300]
                          : COLORS.primary.DEFAULT,
                      }}
                    />

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <p
                          className="text-sm font-semibold"
                          style={{
                            color: COLORS.neutral.black,
                          }}
                        >
                          {notification.title}
                        </p>

                        <div className="flex shrink-0 items-center gap-2">
                          {!notification.isRead && (
                            <span
                              className="text-[10px] font-medium"
                              style={{
                                color: COLORS.primary.DEFAULT,
                              }}
                            >
                              {localize.notification.new}
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={(event) =>
                              handleDeleteNotification(event, notification.id)
                            }
                            className="rounded-md p-1.5 transition-colors hover:bg-slate-100"
                            style={{
                              color: COLORS.grey[500],
                            }}
                            aria-label={localize.notification.delete}
                            title={localize.notification.delete}
                          >
                            <DeleteIcon size={15} strokeWidth={1.8} />
                          </button>
                        </div>
                      </div>

                      <p
                        className="mt-1 text-xs leading-5"
                        style={{
                          color: COLORS.grey[600],
                        }}
                      >
                        {notification.message}
                      </p>

                      {isPossibleMatch && (
                        <p
                          className="mt-2 text-xs font-medium"
                          style={{
                            color: COLORS.primary.DEFAULT,
                          }}
                        >
                          {localize.notification.view_details}
                        </p>
                      )}

                      {(isConfirmed || isRecoveryConfirmed) && (
                        <p
                          className="mt-2 text-xs font-medium"
                          style={{
                            color: COLORS.status.green,
                          }}
                        >
                          {localize.notification.view_recovery_details}
                        </p>
                      )}

                      <p
                        className="mt-2 text-[10px]"
                        style={{
                          color: COLORS.grey[400],
                        }}
                      >
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <FoundReportDetailsModal
        open={selectedFoundReportId !== null}
        foundReport={selectedFoundReport}
        lostReport={selectedLostReport}
        pet={selectedPet}
        onClose={handleCloseFoundReportModal}
        onConfirm={handleConfirmMatch}
        onDismiss={handleDismissMatch}
      />

      <RecoveryConfirmedModal
        open={selectedRecoveryId !== null}
        recovery={selectedRecovery}
        pet={selectedRecoveryPet}
        foundReport={selectedRecoveryFoundReport}
        onClose={handleCloseRecoveryModal}
        onViewRecovery={handleViewRecovery}
      />

      <RecoveryDetailsModal
        open={recoveryDetailsId !== null}
        recovery={recoveryDetails}
        pet={recoveryDetailsPet}
        foundReport={recoveryDetailsFoundReport}
        onClose={handleCloseRecoveryDetails}
      />
    </>
  );
}
