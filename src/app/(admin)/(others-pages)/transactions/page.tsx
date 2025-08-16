"use client"
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import React, { useEffect, useState } from "react";
import { EnrichedClientData, useAuth } from "@/context/AuthContext";
import DateRangePicker from "@/components/DateRangePicker";
import { format } from 'date-fns';
import BasicTablePlayer from "@/components/tables/BasicTablePlayer";


export default function Transactions() {
  const { userInfo, getAffiliatesWithTime, affiliatesListInSelectedTime, playerBalanceData } = useAuth();
  const [currentTotalDeposit, setCurrentTotalDeposit] = useState(0.00);
  const [currentTotalDepositCount, setCurrentTotalDepositCount] = useState(0);
  const [currentTotalWithdrawal, setCurrentTotalWithdrawal] = useState(0.00);
  const [currentTotalWithdrawalCount, setCurrentTotalWithdrawalCount] = useState(0);
  const [isLoadingTotal, setIsLoadingTotal] = useState(true);

  const formatDate = (date: Date) => format(date, 'dd-MM-yy')

  const today = new Date();
  const formattedToday = formatDate(today)

  const [range, setRange] = useState<{ MinCreatedLocal: string; MaxCreatedLocal: string }>({
    MinCreatedLocal: formattedToday,
    MaxCreatedLocal: formattedToday,
  });

  const calculateTotalDeposits = (clients: EnrichedClientData[]): { total: number; count: number } => {
      let total = 0;
      let count = 0;
  
      clients.forEach(client => {
        if (client.DepositAmount > 0) {
          total += client.DepositAmount;
          count += client.DepositCount;
        }
      });
  
      return {
        total: parseFloat(total.toFixed(2)),
        count
      };
    };

  const calculateTotalWithdrawals = (clients: EnrichedClientData[]): { total: number; count: number } => {
        let total = 0;
        let count = 0;
  
        clients.forEach(client => {
          if (client.WithdrawalAmount > 0) {
            total += client.WithdrawalAmount;
            count += client.WithdrawalCount;
          }
        });
  
        return {
          total: parseFloat(total.toFixed(2)),
          count
        };
      };

  const handleDateChange = (range: { MinCreatedLocal: string; MaxCreatedLocal: string }) => {
    setRange(range)
  }

  useEffect(() => {
    setIsLoadingTotal(true);
    getAffiliatesWithTime(range);
  }, [range])

  useEffect(() => {
    if(userInfo.pct === 0){
      return;
    }
    const currentDepositInfo = calculateTotalDeposits(affiliatesListInSelectedTime)
    setCurrentTotalDeposit(currentDepositInfo.total);
    setCurrentTotalDepositCount(currentDepositInfo.count)
    const currentWithdrawalInfo = calculateTotalWithdrawals(affiliatesListInSelectedTime)
    setCurrentTotalWithdrawal(currentWithdrawalInfo.total);
    setCurrentTotalWithdrawalCount(currentWithdrawalInfo.count);
    setIsLoadingTotal(false);
  }, [affiliatesListInSelectedTime, userInfo, playerBalanceData])
  
  return (
    <>
    <div className="flex flex-col md:flex-row items-center justify-between w-full h-auto py-8">
      <h1 className="font-bold text-xl px-2 mb-2 md:mb-0">Genel</h1>
        <div className="w-full md:w-auto flex items-center justify-center mt-5 md:mt-0">
          <DateRangePicker onChange={handleDateChange} />
        </div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full mb-5">
      <EcommerceMetrics name="Yatırım" amount={currentTotalDeposit} count={`${currentTotalDepositCount} Yatırım`} isLoading={isLoadingTotal} />
      <EcommerceMetrics name="Çekim" amount={currentTotalWithdrawal} count={`${currentTotalWithdrawalCount} Çekim`} isLoading={isLoadingTotal} />
      <EcommerceMetrics name="Yatırım - Çekim" amount={currentTotalDeposit - currentTotalWithdrawal} count="" isLoading={isLoadingTotal} /> 
    </div>
          <BasicTablePlayer contentType="GGA" />
    </>
  );
}
