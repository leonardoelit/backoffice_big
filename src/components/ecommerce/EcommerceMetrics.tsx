"use client";
import React from "react";
import Badge from "../ui/badge/Badge";
import { ArrowUpIcon, ArrowDownIcon, DollarLineIcon } from "@/icons";
import CountUp from 'react-countup'

export const EcommerceMetrics = ({ name, amount, count, isLoading }: { name:string, amount:number, count:string, isLoading:boolean }) => {
  return (
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 w-full">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          {name !== 'Yatırım - Çekim' && (
            <DollarLineIcon className="text-[#1a652a] size-6 dark:text-white/90" />
          )}
          {name === 'Deposit' || name === 'Yatırım'
                ? (
                  <ArrowUpIcon className="text-success-600 size-6 dark:text-white/90" />
                )
                : name === 'Withdrawal' || name === 'Çekim'
                ? (
                  <ArrowDownIcon className="text-error-600 size-6 dark:text-white/90" />
                )
                : name === 'Commission' ||  name ==='Komisyon'
                ? (
                  <></>
                ) : name === 'Deposit - Withdrawal' ||  name ==='Yatırım - Çekim' ? (
                  <div className="flex items-center justify-center gap-0">
                    <ArrowUpIcon className="text-success-600 size-6 dark:text-white/90" />
                    <ArrowDownIcon className="text-error-600 size-3 dark:text-white/90" />
                  </div>
                ) : (
                  <DollarLineIcon className="text-[#1a652a] size-6 dark:text-white/90" />
                )}
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
              <CountUp end={amount} duration={1.5} separator="," decimals={name === 'Toplam Bakiye' ? 2 : 0} />
          </h4>
            )}
          </div>
          {isLoading ? (
          <div className="w-16 h-6 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-md" />
        ) : (
          <Badge
            color={
              name === 'Total Balance' || name === 'Komisyon'
                ? 'info'
                : name === 'Withdrawal' || name === 'Çekim'
                ? 'error'
                : 'success'
            }
          >
            {count}
          </Badge>
        )}
        </div>
      </div>
  );
};
