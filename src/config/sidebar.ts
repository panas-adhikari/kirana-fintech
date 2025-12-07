import { ReactElement } from "react";

// Updated Icon Imports to match the screenshot
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard'; // Matches the 4-square dashboard
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'; // Matches the Invoice document look
import RequestQuoteOutlinedIcon from '@mui/icons-material/RequestQuoteOutlined'; // Matches Expenses (Document with symbol)
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined'; // Matches Incomes (Bill/Cash)
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined'; // Matches Dealers (Shop icon)
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline'; // Matches Customers (Outline style)
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined'; // Matches Reports (Bar graph)
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
    title: "Invoices",
    icon: DescriptionOutlinedIcon,
    href: "/invoices",
    children: [
      { label: "Paid", href: "/invoices/paid" },
      { label: "Pending", href: "/invoices/pending" },
      { label: "Overdue", href: "/invoices/overdue" },
    ],
  },
  {
    title: "Expenses",
    icon: RequestQuoteOutlinedIcon, // Changed to match the document-style icon in image
    href: "/expenses",
  },
  {
    title: "Incomes",
    icon: PaymentsOutlinedIcon, // Changed to match the cash bill icon in image
    href: "/incomes",
  },
  {
    title: "Dealers",
    icon: StorefrontOutlinedIcon, // Changed from Tag to Shop icon as per image
    href: "/dealers",
  },
  {
    title: "Customers",
    icon: PeopleOutlineIcon,
    href: "/customers",
  },
  {
    title: "Reports",
    icon: BarChartOutlinedIcon, // Changed to Bar Chart as per image
    href: "/reports",
    children: [
      { label: "Sales", href: "/reports/sales" },
      { label: "Expenses", href: "/reports/expenses" },
    ],
  },
  {
    title: "Settings",
    icon: SettingsOutlinedIcon,
    href: "/settings",
  },
  // I added Help Center because it is in your screenshot
  {
    title: "Help Center",
    icon: HelpOutlineIcon,
    href: "/help",
  },
];