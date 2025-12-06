'use client';

import React from 'react';
import {
  FileText,
  Briefcase,
  UserPlus,
  Minus,
  Plus,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface Activity {
  id: string | number;
  title: string;
  subtitle: string;
  amount?: string;
  trend: 'positive' | 'negative' | 'neutral';
  icon?: React.ReactNode;
  timestamp?: string;
}

interface RecentActivityProps {
  activities?: Activity[];
  title?: string;
}

export function RecentActivity({
  activities,
  title = 'Recent Activity',
}: RecentActivityProps) {
  const defaultActivities: Activity[] = [
    {
      id: 1,
      title: 'Invoice #124 paid',
      subtitle: 'From Acme Corp',
      amount: '+2,500.00',
      trend: 'positive',
      icon: <FileText className="w-4 h-4" />,
      timestamp: '2 hours ago',
    },
    {
      id: 2,
      title: 'Office Supplies',
      subtitle: 'Expense recorded',
      amount: '-150.25',
      trend: 'negative',
      icon: <Briefcase className="w-4 h-4" />,
      timestamp: '4 hours ago',
    },
    {
      id: 3,
      title: 'New Client Added',
      subtitle: 'Innovate LLC',
      amount: '',
      trend: 'neutral',
      icon: <UserPlus className="w-4 h-4" />,
      timestamp: '6 hours ago',
    },
    {
      id: 4,
      title: 'Invoice #123 paid',
      subtitle: 'From Tech Solutions',
      amount: '+1,800.00',
      trend: 'positive',
      icon: <FileText className="w-4 h-4" />,
      timestamp: '8 hours ago',
    },
    {
      id: 5,
      title: 'Bank Fee',
      subtitle: 'Monthly service charge',
      amount: '-25.00',
      trend: 'negative',
      icon: <Minus className="w-4 h-4" />,
      timestamp: '1 day ago',
    },
  ];

  const displayActivities = activities || defaultActivities;

  const getColorClasses = (trend: string) => {
    switch (trend) {
      case 'positive':
        return 'text-emerald-600 dark:text-emerald-400';
      case 'negative':
        return 'text-red-500 dark:text-red-400';
      case 'neutral':
      default:
        return 'text-gray-500 dark:text-gray-400';
    }
  };

  const getIconBackground = (trend: string) => {
    switch (trend) {
      case 'positive':
        return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400';
      case 'negative':
        return 'bg-red-100 dark:bg-red-900/30 text-red-500 dark:text-red-400';
      case 'neutral':
      default:
        return 'bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-400';
    }
  };

  return (
    <Card className="col-span-1 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="h-auto">
        <div className="space-y-4">
          {displayActivities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start justify-between py-3 border-b border-gray-100 dark:border-slate-700 last:border-b-0"
            >
              <div className="flex items-start flex-1">
                {/* Icon */}
                <div
                  className={`mr-3 p-2 rounded-lg ${getIconBackground(activity.trend)} flex-shrink-0`}
                >
                  {activity.icon || <FileText className="w-4 h-4" />}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-800 dark:text-gray-100 truncate">
                    {activity.title}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {activity.subtitle}
                  </div>
                  {activity.timestamp && (
                    <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      {activity.timestamp}
                    </div>
                  )}
                </div>
              </div>

              {/* Amount */}
              {activity.amount && (
                <div
                  className={`font-semibold text-sm ml-2 flex-shrink-0 ${getColorClasses(activity.trend)}`}
                >
                  {activity.amount}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
