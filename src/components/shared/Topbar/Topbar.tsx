"use client";

import { useMemo, useState } from "react";

import { useAuthStore } from "@/store/authStore";
import { useNotificationStore } from "@/store/notificationStore";
import { useUIStore } from "@/store/uiStore";

import NotificationCenter from "@/components/notifications/NotificationCenter";

import { BellIcon } from "@/icons/BellIcon";

import { COLORS } from "@/styles/colors";
import { localize } from "@/utils/localize";

export default function Topbar() {
  const user = useAuthStore((state) => state.user);

  const notifications = useNotificationStore((state) => state.notifications);

  const isSidebarCollapsed = useUIStore((state) => state.isSidebarCollapsed);

  const toggleSidebar = useUIStore((state) => state.toggleSidebar);

  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const unreadCount = useMemo(() => {
    if (!user) {
      return 0;
    }

    return notifications.filter(
      (notification) => notification.userId === user.id && !notification.isRead,
    ).length;
  }, [notifications, user]);

  return (
    <header
      className="fixed right-0 top-0 z-40 flex h-16 items-center justify-between border-b px-5 transition-all duration-300"
      style={{
        left: isSidebarCollapsed ? "5rem" : "16rem",
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
  );
}
