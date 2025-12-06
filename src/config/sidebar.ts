import { ReactElement } from "react";
import { FaTachometerAlt, FaFileInvoice, FaMoneyBillAlt, FaMoneyCheckAlt, FaUsers, FaUserAlt, FaChartLine, FaCog } from "react-icons/fa";

export interface SidebarChild {
  label: string;
  href: string;
}

export interface SidebarMenuItem {
  title: string;
  icon: React.ComponentType;  // Icon should be a React element
  href: string;
  children?: SidebarChild[];
}

// Sidebar Menu Data
export const sidebarMenu: SidebarMenuItem[] = [
  {
    title: "Dashboard",
    icon: FaTachometerAlt,  // Use the React component, not the JSX element
    href: "/dashboard",
  },
  {
    title: "Invoices",
    icon: FaFileInvoice,  // Use the React component
    href: "/invoices",
    children: [
      { label: "Paid", href: "/invoices/paid" },
      { label: "Pending", href: "/invoices/pending" },
      { label: "Overdue", href: "/invoices/overdue" },
    ],
  },
  {
    title: "Expenses",
    icon: FaMoneyBillAlt,  // Use the React component
    href: "/expenses",
  },
  {
    title: "Incomes",
    icon: FaMoneyCheckAlt,  // Use the React component
    href: "/incomes",
  },
  {
    title: "Dealers",
    icon: FaUsers,  // Use the React component
    href: "/dealers",
  },
  {
    title: "Customers",
    icon: FaUserAlt,  // Use the React component
    href: "/customers",
  },
  {
    title: "Reports",
    icon: FaChartLine,  // Use the React component
    href: "/reports",
    children: [
      { label: "Sales", href: "/reports/sales" },
      { label: "Expenses", href: "/reports/expenses" },
    ],
  },
  {
    title: "Settings",
    icon: FaCog,  // Use the React component
    href: "/settings",
  },
  {
    title: "Transactions",
    icon: FaFileInvoice,
    href: "/dashboard/transactions",
  },
];
