"use client";

import { useMemo, useState } from "react";

import { useAuthStore } from "@/store/authStore";
import { useFoundPetStore } from "@/store/foundPetStore";
import { useLostPetStore } from "@/store/lostPetStore";
import { useNotificationStore } from "@/store/notificationStore";
import { usePetStore } from "@/store/petStore";
import { useUIStore } from "@/store/uiStore";

import FoundReportDetailsModal from "@/components/modals/FoundReportDetailsModal";

import { BellIcon } from "@/icons/BellIcon";

import { COLORS } from "@/styles/colors";
import { localize } from "@/utils/localize";

import type { Pet } from "@/types/pet";
import type { LostPetReport } from "@/types/lostPet";
import type { FoundPetReport } from "@/types/foundPet";
import type { Notification } from "@/types/notification";

export default function Topbar() {
  const user = useAuthStore((state) => state.user);

  const isSidebarCollapsed = useUIStore((state) => state.isSidebarCollapsed);

  const toggleSidebar = useUIStore((state) => state.toggleSidebar);

  const notifications = useNotificationStore((state) => state.notifications);

  const markAsRead = useNotificationStore((state) => state.markAsRead);

  const foundPets = useFoundPetStore((state) => state.foundPets);

  const lostPets = useLostPetStore((state) => state.lostPets);

  const pets = usePetStore((state) => state.pets);

  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);

  const [selectedLostReport, setSelectedLostReport] =
    useState<LostPetReport | null>(null);

  const [selectedFoundReport, setSelectedFoundReport] =
    useState<FoundPetReport | null>(null);

  const userNotifications = useMemo(() => {
    if (!user) {
      return [];
    }

    return notifications.filter(
      (notification) => notification.userId === user.id,
    );
  }, [notifications, user]);

  const unreadCount = useMemo(() => {
    return userNotifications.filter((notification) => !notification.isRead)
      .length;
  }, [userNotifications]);

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);

    if (notification.type !== "POSSIBLE_MATCH" || !notification.relatedId) {
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

    if (!user || lostReport.ownerId !== user.id) {
      return;
    }

    const pet = pets.find((item) => item.id === foundReport.petId);

    if (!pet) {
      return;
    }

    setSelectedPet(pet);
    setSelectedLostReport(lostReport);
    setSelectedFoundReport(foundReport);

    setIsNotificationOpen(false);
  };

  const handleCloseDetails = () => {
    setSelectedPet(null);
    setSelectedLostReport(null);
    setSelectedFoundReport(null);
  };

  const handleConfirmFound = () => {
    handleCloseDetails();
  };

  const handleDismissFound = () => {
    handleCloseDetails();
  };

  return (
    <>
      <header
        className="fixed right-0 top-0 z-40 flex h-16 items-center justify-between border-b px-5 transition-all duration-300"
        style={{
          left: isSidebarCollapsed ? "5rem" : "16rem",
          borderColor: COLORS.grey[200],
          backgroundColor: COLORS.neutral.white,
        }}
      >
        {/* Left side */}
        <div className="flex items-center">
          <button
            type="button"
            onClick={toggleSidebar}
            className="flex h-9 w-9 items-center justify-center rounded-lg"
            style={{
              color: COLORS.grey[600],
            }}
          >
            <span className="text-xl">☰</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsNotificationOpen((previous) => !previous)}
              className="relative flex h-10 w-10 items-center justify-center rounded-full"
              style={{
                color: COLORS.grey[600],
              }}
              aria-label={localize.common.notifications}
            >
              <BellIcon size={20} color={COLORS.grey[600]} />

              {unreadCount > 0 && (
                <span
                  className="absolute right-0 top-0 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-semibold"
                  style={{
                    backgroundColor: COLORS.primary.DEFAULT,
                    color: COLORS.neutral.white,
                  }}
                >
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {isNotificationOpen && (
              <div
                className="absolute right-0 top-12 w-96 overflow-hidden rounded-xl border shadow-lg"
                style={{
                  borderColor: COLORS.grey[200],
                  backgroundColor: COLORS.neutral.white,
                }}
              >
                <div
                  className="border-b px-4 py-3"
                  style={{
                    borderColor: COLORS.grey[200],
                  }}
                >
                  <div className="flex items-center justify-between">
                    <h3
                      className="text-sm font-semibold"
                      style={{
                        color: COLORS.neutral.black,
                      }}
                    >
                      {localize.common.notifications}
                    </h3>

                    {unreadCount > 0 && (
                      <span
                        className="text-xs font-medium"
                        style={{
                          color: COLORS.primary.DEFAULT,
                        }}
                      >
                        {unreadCount}
                      </span>
                    )}
                  </div>
                </div>

                <div className="max-h-[420px] overflow-y-auto">
                  {userNotifications.length === 0 ? (
                    <div className="px-5 py-10 text-center">
                      <p
                        className="text-sm"
                        style={{
                          color: COLORS.grey[500],
                        }}
                      >
                        {localize.common.notifications}
                      </p>
                    </div>
                  ) : (
                    userNotifications.map((notification) => (
                      <button
                        key={notification.id}
                        type="button"
                        onClick={() => handleNotificationClick(notification)}
                        className="w-full border-b px-4 py-4 text-left"
                        style={{
                          borderColor: COLORS.grey[100],
                          backgroundColor: notification.isRead
                            ? COLORS.neutral.white
                            : COLORS.grey[50],
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
                            <p
                              className="text-sm font-semibold"
                              style={{
                                color: COLORS.neutral.black,
                              }}
                            >
                              {notification.title}
                            </p>

                            <p
                              className="mt-1 text-xs leading-5"
                              style={{
                                color: COLORS.grey[600],
                              }}
                            >
                              {notification.message}
                            </p>

                            <p
                              className="mt-2 text-[11px]"
                              style={{
                                color: COLORS.grey[400],
                              }}
                            >
                              {new Date(
                                notification.createdAt,
                              ).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User */}
          {user && (
            <div className="hidden items-center gap-2 sm:flex">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold"
                style={{
                  backgroundColor: COLORS.primary.light,
                  color: COLORS.primary.DEFAULT,
                }}
              >
                {user.email.charAt(0).toUpperCase()}
              </div>

              <div className="hidden md:block">
                <p
                  className="text-sm font-medium"
                  style={{
                    color: COLORS.neutral.black,
                  }}
                >
                  {user.email}
                </p>
              </div>
            </div>
          )}
        </div>
      </header>

      <FoundReportDetailsModal
        open={
          selectedPet !== null &&
          selectedLostReport !== null &&
          selectedFoundReport !== null
        }
        onClose={handleCloseDetails}
        pet={selectedPet}
        lostReport={selectedLostReport}
        foundReport={selectedFoundReport}
        onConfirm={handleConfirmFound}
        onDismiss={handleDismissFound}
      />
    </>
  );
}
