"use client";
import React from "react";
import Badge from "../ui/badge/Badge";
import { ArrowUpIcon, ArrowDownIcon, DollarLineIcon } from "@/icons";
import CountUp from 'react-countup'

interface EcommerceMetricsProps {
  name: string;
  amount: number;
  count?: string;
  isLoading: boolean;
}

export const EcommerceMetrics = ({ name, amount, count, isLoading }: EcommerceMetricsProps) => {
  const getIcon = () => {
    switch (name) {
      case 'Yatırım':
        return <ArrowUpIcon className="text-success-600 size-6 dark:text-white/90" />;
      case 'Çekim':
        return <ArrowDownIcon className="text-error-600 size-6 dark:text-white/90" />;
      case 'Bonus Miktarı':
        return <DollarLineIcon className="text-blue-600 size-6 dark:text-white/90" />;
      case 'Casino Bet':
        return <DollarLineIcon className="text-purple-600 size-6 dark:text-white/90" />;
      case 'Casino Win':
        return <DollarLineIcon className="text-teal-600 size-6 dark:text-white/90" />;
      case 'GGR':
        return <DollarLineIcon className="text-orange-600 size-6 dark:text-white/90" />;
      default:
        return <DollarLineIcon className="text-gray-600 size-6 dark:text-white/90" />;
    }
  }

  const getBadgeColor = () => {
    switch (name) {
      case 'Yatırım':
      case 'Bonus Miktarı':
      case 'Casino Bet':
      case 'Casino Win':
        return 'success';
      case 'Çekim':
        return 'error';
      case 'GGR':
        return 'warning';
      default:
        return 'info';
    }
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 w-full">
      <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
        {getIcon()}
      </div>

      <div className="flex items-end justify-between mt-5">
        <div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {name}
          </span>
          {isLoading ? (
            <div className="w-16 h-6 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-md mt-5.5" />
          ) : (
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90 min-h-[32px]">
              <CountUp end={amount} duration={1.5} separator="," decimals={name === 'GGR' || name === 'Casino Win' || name === 'Casino Bet' ? 2 : 0} />
            </h4>
          )}
        </div>
        {isLoading ? (
          <div className="w-16 h-6 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-md" />
        ) : (
          <Badge color={getBadgeColor()}>
            {count}
          </Badge>
        )}
      </div>
    </div>
  )
};
