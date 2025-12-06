'use client';

import React from 'react';
import { cssStyles } from "@/components/animations/animations";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";

// Define the keyframes for the rotation


function FinancialCard({
  title,
  value,
  percentage,
  trend
}: {
  title: string;
  value: string;
  percentage: number;
  trend: "positive" | "negative";
}) {
  const isPositive = trend === "positive";

  return (
    /* 
      --- OUTER CONTAINER ---
      Condition: 
      - If positive: hover shadow is Green (Mint).
      - If negative: hover shadow is Red.
    */
    <div
      className={`relative h-full w-full rounded-xl overflow-hidden bg-gray-100 dark:bg-slate-700 shadow-[0_2px_4px_rgba(0,0,0,0.04)] transition-shadow duration-300 ease-in-out ${isPositive
        ? "hover:shadow-[0_8px_20px_rgba(52,211,153,0.3)]"
        : "hover:shadow-[0_8px_20px_rgba(248,113,113,0.3)]"
        }`}
    >

      {/* 
        --- ROTATING LAYER (THE BORDER LIGHT) ---
        Condition:
        - If positive: Conic gradient uses Emerald (#10B981).
        - If negative: Conic gradient uses Red (#EF4444).
      */}
      <div
        className={`absolute inset-[-100%] animate-border-spin ${isPositive
          ? "bg-[conic-gradient(from_0deg,transparent_0_340deg,#10B981_360deg)]"
          : "bg-[conic-gradient(from_0deg,transparent_0_340deg,#EF4444_360deg)]"
          }`}
      />

      {/* 
        --- INNER MASK (THE CONTENT) ---
        - Solid bg-white to ensure no animation inside.
      */}
      <Card
        className="absolute inset-[1.5px] rounded-[10px] border-none shadow-none bg-white dark:bg-slate-800 flex flex-col justify-center"
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6">
          <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          <div className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            {value}
          </div>
          <div className="flex items-center mt-2">
            <span
              className={`flex items-center text-xs font-medium px-2 py-0.5 rounded ${isPositive
                  ? "text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/10"
                  : "text-rose-700 bg-rose-50 dark:text-rose-400 dark:bg-rose-500/10"
                }`}
            >
              {isPositive ? (
                <ArrowUpIcon className="h-3 w-3 mr-1" />
              ) : (
                <ArrowDownIcon className="h-3 w-3 mr-1" />
              )}
              {Math.abs(percentage)}%
            </span>
            <span className="ml-2 text-xs text-gray-400 dark:text-gray-500">
              vs last month
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface DashboardStats {
  cashBalance: number;
  income: number;
  expenses: number;
  profit: number;
}

export function DashboardCards({ stats }: { stats?: DashboardStats }) {
  const cardData = [
    {
      title: "Cash Balance",
      value: stats ? `NPR ${stats.cashBalance.toLocaleString()}` : "NPR 0",
      percentage: 2.5, // TODO: Calculate real percentage change
      trend: "positive" as const,
    },
    {
      title: "Profit & Loss",
      value: stats ? `NPR ${stats.profit.toLocaleString()}` : "NPR 0",
      percentage: 10.1,
      trend: (stats?.profit || 0) >= 0 ? "positive" as const : "negative" as const,
    },
    {
      title: "Income",
      value: stats ? `NPR ${stats.income.toLocaleString()}` : "NPR 0",
      percentage: 5.8,
      trend: "positive" as const,
    },
    {
      title: "Expenses",
      value: stats ? `NPR ${stats.expenses.toLocaleString()}` : "NPR 0",
      percentage: -1.2,
      trend: "negative" as const,
    },
  ];

  return (
    <>
      <style jsx global>{cssStyles}</style>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 p-2">
        {cardData.map((card, index) => (
          // Wrapper for height consistency
          <div key={index} className="h-36 w-full">
            <FinancialCard
              title={card.title}
              value={card.value}
              percentage={card.percentage}
              trend={card.trend}
            />
          </div>
        ))}
      </div>
    </>
  );
}