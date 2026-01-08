'use client';
import React from 'react';
import { cssStyles } from '@/components/animations/animations';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface CashFlowChartProps {
  opening: string;
  netChange: string;
  closing: string;
  cashIn?: number;
  cashOut?: number;
}

export function CashFlowChart({
  opening,
  netChange,
  closing,
  cashIn = 0,
  cashOut = 0,
}: CashFlowChartProps) {
  const total = cashIn + cashOut || 1; // Avoid division by zero
  const inWidth = (cashIn / total) * 100;
  const outWidth = (cashOut / total) * 100;
  const netValue = cashIn - cashOut;

  return (
    <div className="relative rounded-xl overflow-hidden bg-gray-100 dark:bg-slate-700 shadow-[0_2px_4px_rgba(0,0,0,0.04)] transition-shadow duration-300 ease-in-out hover:shadow-[0_8px_20px_rgba(52,211,153,0.3)]">
      {/* Rotating border effect */}
      <div className="absolute inset-[-100%] animate-border-spin bg-[conic-gradient(from_0deg,transparent_0_340deg,#10B981_360deg)]" />

      {/* Inner content container */}
      <Card className="absolute inset-[1.5px] rounded-[10px] border-none shadow-none bg-white dark:bg-slate-800">
        <style jsx global>{cssStyles}</style>
        <CardHeader className="flex flex-col items-start p-4 pb-2">
          <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white">
            Cash Flow
          </CardTitle>
          <div className="text-sm text-gray-500 dark:text-gray-400">Last 30 Days</div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          

          {/* Cash Flow Bars */}
          <div className="space-y-3">
            {/* Cash In */}
            <div>
              <div className="flex justify-between text-sm font-medium text-green-800 dark:text-green-300 mb-2">
                <span>Cash In</span>
                <span>
                  NPR {cashIn.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-green-700 rounded-full transition-all"
                  style={{ width: `${inWidth}%` }}
                ></div>
              </div>
            </div>

            {/* Cash Out */}
            <div>
              <div className="flex justify-between text-sm font-medium text-red-600 dark:text-red-400 mb-2">
                <span>Cash Out</span>
                <span>
                  NPR {cashOut.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full transition-all"
                  style={{ width: `${outWidth}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Summary Footer */}
          <div className="mt-4 pt-5 border-t border-gray-200 dark:border-slate-700 grid grid-cols-3 gap-2 text-center text-sm">
            <div>
              <div className="text-gray-500 dark:text-gray-400 text-xs mb-1">
                Opening Balance
              </div>
              <div className="font-bold text-gray-700 dark:text-gray-200">NPR {opening}</div>
            </div>
            <div>
              <div className="text-gray-500 dark:text-gray-400 text-xs mb-1">Net Change</div>
              <div className="font-bold text-green-700 dark:text-green-400">NPR {netChange}</div>
            </div>
            <div>
              <div className="text-gray-500 dark:text-gray-400 text-xs mb-1">
                Closing Balance
              </div>
              <div className="font-bold text-gray-900 dark:text-gray-100">NPR {closing}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
