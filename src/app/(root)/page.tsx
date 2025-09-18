"use client";

import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import React, { startTransition, useEffect, useState } from "react";
import DateRangePicker from "@/components/DateRangePicker";
import ComponentCard from "@/components/common/ComponentCard";
import BasicTableSmall from "@/components/tables/BasicTableSmall";
import CountUp from "react-countup";
import { getDashboardStats } from "@/components/lib/api";
import { showToast } from "@/utils/toastUtil";
import { DashboardPlayerData } from "@/components/constants/types";
import { useAuth } from "@/context/AuthContext";

export default function Ecommerce() {
  const { token, isAuthenticated } = useAuth();

  const [profit, setProfit] = useState<number | undefined>();
  const [prevProfit, setPrevProfit] = useState<number | undefined>();
  const [playerCount, setPlayerCount] = useState<number | undefined>();
  const [currentTotalCasinoBet, setCurrentTotalCasinoBet] = useState<number>(0.0);
  const [currentTotalCasinoWin, setCurrentTotalCasinoWin] = useState<number>(0.0);
  const [currentTotalDeposit, setCurrentTotalDeposit] = useState(0.0);
  const [currentTotalDepositCount, setCurrentTotalDepositCount] = useState(0);
  const [topTenTotalDeposit, setTopTenTotalDeposit] = useState<DashboardPlayerData[]>([]);
  const [currentTotalWithdrawal, setCurrentTotalWithdrawal] = useState(0.0);
  const [currentTotalWithdrawalCount, setCurrentTotalWithdrawalCount] = useState(0);
  const [topTenTotalWithdrawal, setTopTenTotalWithdrawal] = useState<DashboardPlayerData[]>([]);
  const [currentTotalBonusAmount, setCurrentTotalBonusAmount] = useState(0.0);
  const [currentGGR, setCurrentGGR] = useState(0.0);
  const [isLoading, setIsLoading] = useState(true);

  const today = new Date();

  const [range, setRange] = useState<{ MinCreatedLocal: string; MaxCreatedLocal: string }>({
    MinCreatedLocal: new Date(today.setHours(0,0,0,0)).toISOString(),
    MaxCreatedLocal: new Date(today.setHours(23,59,59,999)).toISOString(),
  });

  const handleDateChange = (range: { MinCreatedLocal: string; MaxCreatedLocal: string }) => setRange(range);

  const getStats = async (range: { MinCreatedLocal: string; MaxCreatedLocal: string }) => {
    if(!isLoading) setIsLoading(true);
    const result = await getDashboardStats({ from: range.MinCreatedLocal, to: range.MaxCreatedLocal });
    if(!result.isSuccess){
      showToast(result.message ? result.message : "Dashboard yüklenirken hata!", "error")
      setIsLoading(false)
      return;
    }
    if(result.stats){
      const data = result.stats;
      startTransition(() => {
        setCurrentTotalDeposit(data.totalDepositAmount)
        setCurrentTotalDepositCount(data.totalDepositCount)
        setCurrentTotalWithdrawal(Math.max(0, data.totalWithdrawalAmount))
        setCurrentTotalWithdrawalCount(Math.max(0, data.totalWithdrawalCount))
        setPrevProfit(profit)
        setProfit(data.totalDepositAmount - Math.max(0, data.totalWithdrawalAmount))
        setCurrentTotalBonusAmount(data.totalBonus)
        setCurrentGGR(data.ggr)
        setCurrentTotalCasinoBet(data.totalCasinoBet)
        setCurrentTotalCasinoWin(data.totalCasinoWin)
        setPlayerCount(data.totalPlayerCount)
        setTopTenTotalDeposit(data.playersWithMostDeposit ? data.playersWithMostDeposit : [])
        setTopTenTotalWithdrawal(data.playersWithMostWithdrawal ? data.playersWithMostWithdrawal.filter((p) => p.amount > 0) : [])
      })
    }else{
      showToast("Dashboard yüklenirken hata!", "error")
    }
    setIsLoading(false)
  }
  // 🔑 Populate metrics
  useEffect(() => {
  if (isAuthenticated && token) {
    getStats(range);
  }
}, [range, isAuthenticated, token]);


  return (
    <>
      {/* header */}
      <div className="flex flex-col md:flex-row items-center justify-between w-full h-auto py-8">
        <h1 className="font-bold text-xl px-2 mb-2 md:mb-0">Genel</h1>
        <div className="flex flex-col md:flex-row items-center justify-between w-full md:w-[50%]">
          <div className="flex flex-row items-center gap-8 justify-end w-full">
            {/* Profit */}
            <div className="flex flex-col items-center justify-center">
              <h2 className="font-light text-sm text-center">Kar</h2>
              <div className={`font-semibold ${profit && profit >= 0 ? "text-green-700" : "text-red-700"} text-sm`}>
                {profit !== undefined ? <CountUp end={profit} start={prevProfit ?? 0} duration={1.5} decimals={2} /> : "-"}
              </div>
            </div>
            {/* User Count */}
            <div className="flex flex-col items-center justify-center">
              <h2 className="font-light text-sm text-center">Oyuncu Sayısı</h2>
              <div className="font-semibold text-sm">
                {playerCount !== undefined ? <CountUp end={playerCount} duration={1.5} /> : "-"}
              </div>
            </div>
          <div className="w-full md:w-auto flex items-center justify-center mt-5 md:mt-0">
            <DateRangePicker
              onChange={handleDateChange}
              isChanged={!!range.MinCreatedLocal && !!range.MaxCreatedLocal}
              initialStartDate={new Date(range.MinCreatedLocal)}
              initialEndDate={new Date(range.MaxCreatedLocal)}
            />
          </div>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full mb-5">
        <EcommerceMetrics name="Yatırım" amount={currentTotalDeposit} count={`${currentTotalDepositCount} Yatırım`} isLoading={isLoading} />
        <EcommerceMetrics name="Çekim" amount={currentTotalWithdrawal} count={`${currentTotalWithdrawalCount} Çekim`} isLoading={isLoading} />
        <EcommerceMetrics name="Bonus Miktarı" amount={currentTotalBonusAmount}  isLoading={isLoading} />
        <EcommerceMetrics name="Casino Bet" amount={currentTotalCasinoBet} isLoading={isLoading} />
        <EcommerceMetrics name="Casino Win" amount={currentTotalCasinoWin} isLoading={isLoading} />
        <EcommerceMetrics name="GGR" amount={currentGGR} isLoading={isLoading} />
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ComponentCard title="En Yüksek Yatırımlar">
          <BasicTableSmall list={topTenTotalDeposit} type="deposit" />
        </ComponentCard>
        <ComponentCard title="En Yüksek Toplam Çekim">
          <BasicTableSmall list={topTenTotalWithdrawal} type="withdrawal" />
        </ComponentCard>
      </div>
    </>
  );
}
