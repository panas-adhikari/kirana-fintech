import { ReactElement } from "react";

// Updated Icon Imports to match the screenshot
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard'; // Matches the 4-square dashboard
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined'; // Matches Dealers (Shop icon)
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline'; // Matches Customers (Outline style)
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'; // Matches Settings
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'; // Matches Help Center

export interface SidebarChild {
  label: string;
  href: string;
}

export interface SidebarMenuItem {
  title: string;
  icon: React.ComponentType;
  href: string;
  children?: SidebarChild[];
}

// Sidebar Menu Data
export const sidebarMenu: SidebarMenuItem[] = [
  {
    title: "Dashboard",
    icon: SpaceDashboardIcon,
    href: "/dashboard",
  },
  {
    title: "Dealers",
    icon: StorefrontOutlinedIcon,
    href: "/dashboard/dealers",
  },
  {
    title: "Customers",
    icon: PeopleOutlineIcon,
    href: "/dashboard/customers",
  },
  {
    title: "Settings",
    icon: SettingsOutlinedIcon,
    href: "/dashboard/settings",
  },
  {
    title: "Help Center",
    icon: HelpOutlineIcon,
    href: "/dashboard/help",
  },
];