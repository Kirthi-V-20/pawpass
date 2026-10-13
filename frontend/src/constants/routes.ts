export const ROUTES = {
  HOME: "/",
  SIGN_IN: "/signin",
  SIGN_UP: "/signup",
  DASHBOARD: "/dashboard",
  MY_PETS: "/pets",
  PET_DETAILS: (id: string) => `/pets/${id}`,
  HEALTH_PASSPORT: "/health-passport",
  QR_CODES: "/qr-codes",
  LOST_PETS: "/lost-pets",
  REPORT_FOUND: "/report-found",
  PROFILE: "/profile",
} as const;