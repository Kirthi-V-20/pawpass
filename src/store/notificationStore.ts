import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { Notification } from "@/types/notification";

interface NotificationStore {
  notifications: Notification[];

  addNotification: (notification: Notification) => void;

  getNotificationsByUser: (userId: string) => Notification[];

  markAsRead: (id: string) => void;

  markAllAsRead: (userId: string) => void;

  deleteNotification: (id: string) => void;

  clearNotifications: (userId: string) => void;
}

export const useNotificationStore =
  create<NotificationStore>()(
    persist(
      (set, get) => ({
        notifications: [],

        addNotification: (notification) => {
          set((state) => ({
            notifications: [
              notification,
              ...state.notifications,
            ],
          }));
        },

        getNotificationsByUser: (userId) => {
          return get().notifications.filter(
            (notification) =>
              notification.userId === userId,
          );
        },

        markAsRead: (id) => {
          set((state) => ({
            notifications:
              state.notifications.map(
                (notification) =>
                  notification.id === id
                    ? {
                        ...notification,
                        isRead: true,
                      }
                    : notification,
              ),
          }));
        },

        markAllAsRead: (userId) => {
          set((state) => ({
            notifications:
              state.notifications.map(
                (notification) =>
                  notification.userId === userId
                    ? {
                        ...notification,
                        isRead: true,
                      }
                    : notification,
              ),
          }));
        },

        deleteNotification: (id) => {
          set((state) => ({
            notifications:
              state.notifications.filter(
                (notification) =>
                  notification.id !== id,
              ),
          }));
        },

        clearNotifications: (userId) => {
          set((state) => ({
            notifications:
              state.notifications.filter(
                (notification) =>
                  notification.userId !== userId,
              ),
          }));
        },
      }),
      {
        name: "pawpass-notifications",
      },
    ),
  );