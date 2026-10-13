import { ROUTES } from "./routes";
import { localize } from "../utils/localize";
import { DashboardIcon } from "../icons/DashboardIcon";
import { PetsIcon } from "../icons/PetsIcon";
import { HealthIcon } from "../icons/HealthIcon";
import { QRIcon } from "../icons/QRIcon";
import { LostIcon } from "../icons/LostIcon";
import { FoundIcon } from "../icons/FoundIcon";
import { ProfileIcon } from "../icons/ProfileIcon";

export interface NavItem {
  label: string;
  route: string;
  icon: React.ComponentType<{ size?: number; color?: string; className?: string }>;
  section?: string;
}

export const NAVIGATION_ITEMS: NavItem[] = [
  { label: localize.sidebar.dashboard, route: ROUTES.DASHBOARD, icon: DashboardIcon },
  { label: localize.sidebar.my_pets, route: ROUTES.MY_PETS, icon: PetsIcon },
  { label: localize.sidebar.health_passport, route: ROUTES.HEALTH_PASSPORT, icon: HealthIcon },
  { label: localize.sidebar.qr_codes, route: ROUTES.QR_CODES, icon: QRIcon },
  
  { label: localize.sidebar.lost_pet, route: ROUTES.LOST_PETS, icon: LostIcon, section: localize.sidebar.safety },
  { label: localize.sidebar.report_found, route: ROUTES.REPORT_FOUND, icon: FoundIcon, section: localize.sidebar.safety },
  
  { label: localize.sidebar.profile, route: ROUTES.PROFILE, icon: ProfileIcon, section: localize.sidebar.system },
];