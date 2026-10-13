"use client";

import { useEffect, useMemo, useState } from "react";

import { useAuthStore } from "@/store/authStore";
import { useNotificationStore } from "@/store/notificationStore";
import { useProfileStore } from "@/store/profileStore";
import { useUIStore } from "@/store/uiStore";

import NotificationCenter from "@/components/notifications/NotificationCenter";

import { BellIcon } from "@/icons/BellIcon";

import { getProfileImage } from "@/lib/imageDb";

import { COLORS } from "@/styles/colors";
import { localize } from "@/utils/localize";

export default function Topbar() {
  const user = useAuthStore((state) => state.user);

  const notifications = useNotificationStore((state) => state.notifications);

  const getProfile = useProfileStore((state) => state.getProfile);

  const isSidebarCollapsed = useUIStore((state) => state.isSidebarCollapsed);

  const toggleSidebar = useUIStore((state) => state.toggleSidebar);

  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

  const profile = user ? getProfile(user.id) : null;

  const unreadCount = useMemo(() => {
    if (!user) {
      return 0;
    }

    return notifications.filter(
      (notification) => notification.userId === user.id && !notification.isRead,
    ).length;
  }, [notifications, user]);

  useEffect(() => {
    if (!user) {
      setProfilePhoto(null);
      return;
    }

    let mounted = true;

    const loadProfileImage = async () => {
      try {
        const storedImage = await getProfileImage(user.id);

        if (mounted) {
          setProfilePhoto(storedImage ?? null);
        }
      } catch (error) {
        console.error("Failed to load profile image:", error);

        if (mounted) {
          setProfilePhoto(null);
        }
      }
    };

    void loadProfileImage();

    return () => {
      mounted = false;
    };
  }, [user]);

  return (
    <header
      className="fixed right-0 top-0 z-40 flex h-16 items-center justify-between border-b px-5 transition-all duration-300"
      style={{
        left: isSidebarCollapsed ? "72px" : "256px",
        borderColor: COLORS.grey[200],
        backgroundColor: COLORS.neutral.white,
      }}
    >
      <div className="flex items-center">
        <button
          type="button"
          onClick={toggleSidebar}
          className="flex h-9 w-9 items-center justify-center rounded-lg"
          style={{
            color: COLORS.grey[600],
          }}
          aria-label={localize.common.toggle_sidebar}
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
                className="absolute right-0 top-0 flex min-h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[10px] font-bold leading-none"
                style={{
                  backgroundColor: COLORS.status.red,
                  color: COLORS.neutral.white,
                }}
              >
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>

          {isNotificationOpen && (
            <NotificationCenter
              open={isNotificationOpen}
              onClose={() => setIsNotificationOpen(false)}
            />
          )}
        </div>

        {user && (
          <div className="hidden items-center gap-2 sm:flex">
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full text-sm font-semibold"
              style={{
                backgroundColor: COLORS.primary.light,
                color: COLORS.primary.DEFAULT,
              }}
            >
              {profilePhoto ? (
                <img
                  src={profilePhoto}
                  alt={localize.common.logo_alt}
                  className="h-full w-full object-cover"
                />
              ) : (
                profile?.fullName?.charAt(0).toUpperCase() ||
                user.fullName?.charAt(0).toUpperCase() ||
                user.email.charAt(0).toUpperCase()
              )}
            </div>

            <div className="hidden md:block">
              <p
                className="text-sm font-medium"
                style={{
                  color: COLORS.neutral.black,
                }}
              >
                {profile?.fullName || user.fullName || user.email}
              </p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
