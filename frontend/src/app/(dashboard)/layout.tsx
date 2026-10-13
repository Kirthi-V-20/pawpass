"use client";

import Sidebar from "@/components/shared/Sidebar/Sidebar";
import Topbar from "@/components/shared/Topbar/Topbar";
import { COLORS } from "@/styles/colors";
import { useUIStore } from "@/store/uiStore";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isSidebarCollapsed = useUIStore((state) => state.isSidebarCollapsed);

  return (
    <div
      className="h-screen overflow-hidden"
      style={{
        backgroundColor: COLORS.primary.background,
      }}
    >
      <Sidebar />

      <div
        className="flex h-full min-w-0 flex-col transition-all duration-200"
        style={{
          marginLeft: isSidebarCollapsed ? "72px" : "256px",
        }}
      >
        <Topbar />

        <main className="min-h-0 flex-1 pt-16">{children}</main>
      </div>
    </div>
  );
}
