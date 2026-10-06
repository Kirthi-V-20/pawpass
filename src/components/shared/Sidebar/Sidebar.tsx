"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { NAVIGATION_ITEMS } from "@/constants/navigation";
import { ROUTES } from "@/constants/routes";
import { COLORS } from "@/styles/colors";
import { localize } from "@/utils/localize";
import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store/uiStore";

export default function Sidebar() {
  const pathname = usePathname() ?? "";

  const logout = useAuthStore((state) => state.logout);

  const isSidebarCollapsed = useUIStore((state) => state.isSidebarCollapsed);

  return (
    <aside
      className="fixed left-0 top-0 z-50 flex h-screen shrink-0 flex-col border-r transition-all duration-200"
      style={{
        width: isSidebarCollapsed ? "72px" : "256px",
        backgroundColor: COLORS.neutral.white,
        borderColor: COLORS.grey[200],
      }}
    >
      {/* Logo */}
      <div
        className="flex h-20 shrink-0 items-center"
        style={{
          justifyContent: isSidebarCollapsed ? "center" : "flex-start",
          paddingLeft: isSidebarCollapsed ? "0" : "24px",
          paddingRight: isSidebarCollapsed ? "0" : "24px",
        }}
      >
        <Link href={ROUTES.DASHBOARD} className="flex items-center gap-3">
          <img
            src="/assets/icons/logo.png"
            alt={localize.common.logo_alt}
            className="h-10 w-10 shrink-0 object-contain"
          />

          {!isSidebarCollapsed && (
            <span className="text-xl font-bold">
              <span style={{ color: COLORS.primary.DEFAULT }}>
                {localize.common.logo_paw}
              </span>

              <span style={{ color: COLORS.neutral.black }}>
                {localize.common.logo_pass}
              </span>
            </span>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav
        className="flex-1 overflow-y-auto py-4"
        style={{
          paddingLeft: isSidebarCollapsed ? "8px" : "16px",
          paddingRight: isSidebarCollapsed ? "8px" : "16px",
        }}
      >
        <div className="space-y-1">
          {NAVIGATION_ITEMS.map((item, index) => {
            const Icon = item.icon;

            const showSection =
              !isSidebarCollapsed &&
              item.section &&
              (index === 0 ||
                NAVIGATION_ITEMS[index - 1]?.section !== item.section);

            const isActive =
              pathname === item.route ||
              (item.route !== ROUTES.DASHBOARD &&
                pathname.startsWith(`${item.route}/`));

            return (
              <div key={item.route}>
                {showSection && (
                  <p
                    className="mb-2 mt-6 px-3 text-xs font-medium uppercase tracking-wide"
                    style={{
                      color: COLORS.grey[500],
                    }}
                  >
                    {item.section}
                  </p>
                )}

                <Link
                  href={item.route}
                  title={isSidebarCollapsed ? item.label : undefined}
                  className="flex h-10 items-center rounded-md text-sm font-medium transition-colors"
                  style={{
                    justifyContent: isSidebarCollapsed
                      ? "center"
                      : "flex-start",
                    gap: isSidebarCollapsed ? "0" : "12px",
                    paddingLeft: isSidebarCollapsed ? "0" : "12px",
                    paddingRight: isSidebarCollapsed ? "0" : "12px",
                    backgroundColor: isActive
                      ? COLORS.primary.light
                      : "transparent",
                    color: isActive ? COLORS.primary.DEFAULT : COLORS.grey[700],
                  }}
                  onMouseEnter={(event) => {
                    if (!isActive) {
                      event.currentTarget.style.backgroundColor =
                        COLORS.primary.light;

                      event.currentTarget.style.color = COLORS.primary.DEFAULT;
                    }
                  }}
                  onMouseLeave={(event) => {
                    if (!isActive) {
                      event.currentTarget.style.backgroundColor = "transparent";

                      event.currentTarget.style.color = COLORS.grey[700];
                    }
                  }}
                >
                  <Icon
                    size={19}
                    color={isActive ? COLORS.primary.DEFAULT : COLORS.grey[500]}
                  />

                  {!isSidebarCollapsed && <span>{item.label}</span>}
                </Link>
              </div>
            );
          })}
        </div>
      </nav>

      {/* Logout */}
      <div
        className="shrink-0 border-t p-4"
        style={{
          borderColor: COLORS.grey[200],
          paddingLeft: isSidebarCollapsed ? "8px" : "16px",
          paddingRight: isSidebarCollapsed ? "8px" : "16px",
        }}
      >
        <button
          type="button"
          onClick={logout}
          title={isSidebarCollapsed ? localize.common.logout : undefined}
          className="flex h-10 w-full items-center rounded-md text-sm font-medium transition-colors"
          style={{
            justifyContent: isSidebarCollapsed ? "center" : "flex-start",
            gap: isSidebarCollapsed ? "0" : "12px",
            paddingLeft: isSidebarCollapsed ? "0" : "12px",
            paddingRight: isSidebarCollapsed ? "0" : "12px",
            color: COLORS.grey[700],
          }}
          onMouseEnter={(event) => {
            event.currentTarget.style.backgroundColor = COLORS.primary.light;

            event.currentTarget.style.color = COLORS.primary.DEFAULT;
          }}
          onMouseLeave={(event) => {
            event.currentTarget.style.backgroundColor = "transparent";

            event.currentTarget.style.color = COLORS.grey[700];
          }}
        >
          <span>{isSidebarCollapsed ? "↪" : localize.common.logout}</span>
        </button>
      </div>
    </aside>
  );
}
