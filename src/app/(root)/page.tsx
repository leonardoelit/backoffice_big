"use client"
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import React, { useEffect, useState } from "react";
import { EnrichedClientData, PlayerBalanceList, useAuth } from "@/context/AuthContext";
import DateRangePicker from "@/components/DateRangePicker";
import { format } from 'date-fns';
import ComponentCard from "@/components/common/ComponentCard";
import BasicTableSmall from "@/components/tables/BasicTableSmall";
import CountUp from "react-countup";


export default function Ecommerce() {
  const { userInfo, getAffiliatesWithTime, affiliatesListInSelectedTime, playerBalanceData } = useAuth();
  const [profit, setProfit] = useState<number | undefined>();
  const [prevProfit, setPrevProfit] = useState(Number);
  const [userCount, setUserCount] = useState<number | undefined>(); 
  const [pendingCommision, setPendingCommision] = useState<number | undefined>();  
  const [currentTotalDeposit, setCurrentTotalDeposit] = useState(0.00);
  const [currentTotalDepositCount, setCurrentTotalDepositCount] = useState(0);
  const [topFiveTotalDeposit, setTopFiveTotalDeposit] = useState<EnrichedClientData[]>([])
  const [currentTotalWithdrawal, setCurrentTotalWithdrawal] = useState(0.00);
  const [currentTotalWithdrawalCount, setCurrentTotalWithdrawalCount] = useState(0);
  const [topFiveTotalWithdrawal, setTopFiveTotalWithdrawal] = useState<EnrichedClientData[]>([])
  const [topFiveNetContribution, setTopFiveNetContribution] = useState<EnrichedClientData[]>([])
  const [currentTotalCommisionAmount, setCurrentTotalCommisionAmount] = useState(0.00);
  const [currentTotalBalance, setCurrentTotalBalance] = useState(0.00);
  const [currentBalanceUserCount, setCurrentBalanceUserCount] = useState(0);
  const [isLoadingTotal, setIsLoadingTotal] = useState(true);

  const formatDate = (date: Date) => format(date, 'dd-MM-yy')

  const today = new Date();
  const formattedToday = formatDate(today)

  const [range, setRange] = useState<{ MinCreatedLocal: string; MaxCreatedLocal: string }>({
    MinCreatedLocal: formattedToday,
    MaxCreatedLocal: formattedToday,
  });

  const calculatePercentageProfit = (clients: EnrichedClientData[]): number => {
    const totalDeposit = clients.reduce((sum, c) => sum + c.DepositAmount, 0);
    const totalWithdrawal = clients.reduce((sum, c) => sum + c.WithdrawalAmount, 0);
    const profit = totalDeposit - totalWithdrawal;

    if (totalDeposit === 0) return 0;

    const percentage = (profit / totalDeposit) * 100;
    return parseFloat(percentage.toFixed(2));
  };

    const calculatePendingCommission = (clients: EnrichedClientData[], pct: number): number => {
      // Calculate the total amount (TotalDeposit - TotalWithdrawal)
      const total = clients.reduce((acc, client) => {
        return acc + (client.DepositAmount - client.WithdrawalAmount);
      }, 0);

      // Convert pct to a decimal (e.g., 20 becomes 0.20)
      const pctDecimal = pct / 100;

      // Calculate the percentage of the total
      const commission = total * pctDecimal;

      // Return the commission rounded to 2 decimal places
      return parseFloat(commission.toFixed(2));
    };

  const calculateTotalDeposits = (clients: EnrichedClientData[]): { total: number; count: number } => {
    let total = 0;
    let count = 0;

    clients.forEach(client => {
      if (client.DepositAmount > 0) {
        total += client.DepositAmount;
        count += client.DepositCount;
      }
    });

    const topFiveDeposits = clients
      .filter(client => client.DepositAmount > 0) // Optional: filter clients with non-zero TotalDeposit
      .sort((a, b) => b.DepositAmount - a.DepositAmount) // Sort by TotalDeposit in descending order
      .slice(0, 5); // Get the first 5 elements after sorting

    setTopFiveTotalDeposit(topFiveDeposits);

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

      const topFiveWithdrawals = clients
      .filter(client => client.WithdrawalAmount > 0) // Optional: filter clients with non-zero TotalDeposit
      .sort((a, b) => b.WithdrawalAmount - a.WithdrawalAmount) // Sort by TotalDeposit in descending order
      .slice(0, 5); // Get the first 5 elements after sorting

      setTopFiveTotalWithdrawal(topFiveWithdrawals);

      return {
        total: parseFloat(total.toFixed(2)),
        count
      };
    };

  const calculateTotalBalance = (clients: PlayerBalanceList[]): { total: number } => {
      let total = 0;

      clients.forEach(client => {
        if (client.playerBalance > 0) {
          total += client.playerBalance;
        }
      });

      return {
        total: parseFloat(total.toFixed(2))
      };
    };

  function getTop5ByNetDeposit(clientKpis: EnrichedClientData[]): EnrichedClientData[] {
    return clientKpis
      .map(client => ({
        ...client,
        netDeposit: client.DepositAmount - client.WithdrawalAmount,
      }))
      .sort((a, b) => b.netDeposit - a.netDeposit)
      .slice(0, 5);
  }

  const handleDateChange = (range: { MinCreatedLocal: string; MaxCreatedLocal: string }) => {
    setRange(range)
  }

  useEffect(() => {
    setIsLoadingTotal(true);
    getAffiliatesWithTime(range);
  }, [range])

  useEffect(() => {
    if(userInfo.pct === 0 && affiliatesListInSelectedTime && playerBalanceData){
      return;
    }
    if(typeof profit === 'number'){
      setPrevProfit(profit)
    }
    setUserCount(userInfo.userCount)
    const pending = (userInfo.TMTDeposit - userInfo.TMTWithdrawal) * userInfo.pct / 100;
    const profitNow = calculatePercentageProfit(affiliatesListInSelectedTime);
    setPendingCommision(pending);
    setProfit(profitNow)
    const currentDepositInfo = calculateTotalDeposits(affiliatesListInSelectedTime)
    setCurrentTotalDeposit(currentDepositInfo.total);
    setCurrentTotalDepositCount(currentDepositInfo.count)
    const currentWithdrawalInfo = calculateTotalWithdrawals(affiliatesListInSelectedTime)
    setCurrentTotalWithdrawal(currentWithdrawalInfo.total);
    setCurrentTotalWithdrawalCount(currentWithdrawalInfo.count);
    setCurrentTotalCommisionAmount(calculatePendingCommission(affiliatesListInSelectedTime, userInfo.pct));
    const currentBalanceInfo = calculateTotalBalance(playerBalanceData.balanceList);
    setCurrentTotalBalance(currentBalanceInfo.total)
    setCurrentBalanceUserCount(playerBalanceData.playerCount)
    const netContributionList = getTop5ByNetDeposit(affiliatesListInSelectedTime)
    setTopFiveNetContribution(netContributionList)
    console.log(netContributionList)
    setIsLoadingTotal(false);
  }, [affiliatesListInSelectedTime, userInfo, playerBalanceData])
  
  return (
    <>
    <div className="flex flex-col md:flex-row items-center justify-between w-full h-auto py-8">
      <h1 className="font-bold text-xl px-2 mb-2 md:mb-0">Genel</h1>
      <div className="flex flex-col md:flex-row items-center justify-between w-full md:w-[50%]">
        <div className="flex flex-row items-center gap-2 justify-between w-full md:w-[60%] ">
        <div className="flex flex-col items-center justify-center">
          <h2 className="font-light text-sm text-center">Kar</h2>
          <div
            className={`font-semibold ${
              typeof profit === 'number' && profit >= 0 ? 'text-green-700' : 'text-red-700'
            } text-sm text-center min-w-[60px]`}
          >
            {typeof profit === 'number' ? (
                <span>
                  <CountUp end={profit} start={prevProfit} duration={1.5} separator="," decimals={2} />%
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <div className="w-10 h-5 items-center bg-gray-200 dark:bg-gray-700 animate-pulse rounded-md" />
                </span>
              )}
          </div>
        </div>
        <div className="flex flex-col items-center justify-center">
          <h2 className="font-light text-sm text-center">Bekleyen Komisyon</h2>
          <div className="font-semibold text-sm text-center">
            {typeof pendingCommision === 'number' ? (
              <span>
                <CountUp end={pendingCommision} duration={1.5} separator="," decimals={2} />
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <div className="w-15 h-5 items-center bg-gray-200 dark:bg-gray-700 animate-pulse rounded-md" />
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col items-center justify-center">
          <h2 className="font-light text-sm text-center">Oyuncu Sayısı</h2>
          <div className="font-semibold text-sm text-center">
            {typeof userCount === 'number' ? (
              <span>
                <CountUp end={userCount} duration={1.5} separator="," />
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <div className="w-10 h-5 items-center bg-gray-200 dark:bg-gray-700 animate-pulse rounded-md" />
              </span>
            )}
          </div>
        </div>
        </div>
        <div className="w-full md:w-auto flex items-center justify-center mt-5 md:mt-0">
          <DateRangePicker onChange={handleDateChange} />
        </div>

      </div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full mb-5">
      <EcommerceMetrics name="Yatırım" amount={currentTotalDeposit} count={`${currentTotalDepositCount} Yatırım`} isLoading={isLoadingTotal} />
      <EcommerceMetrics name="Çekim" amount={currentTotalWithdrawal} count={`${currentTotalWithdrawalCount} Çekim`} isLoading={isLoadingTotal} />
      <EcommerceMetrics name="Komisyon" amount={currentTotalCommisionAmount} count={`${userInfo.pct === 0 ? '20' : userInfo.pct}% Oran`} isLoading={isLoadingTotal} />
      <EcommerceMetrics name="Toplam Bakiye" amount={currentTotalBalance} count={`${currentBalanceUserCount} Oyuncu`} isLoading={isLoadingTotal} /> 
    </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ComponentCard title="En Yüksek Yatırımlar">
          <BasicTableSmall list={topFiveTotalDeposit} type='deposit' />
        </ComponentCard>

        <ComponentCard title="En Yüksek Toplam Çekim">
          <BasicTableSmall list={topFiveTotalWithdrawal} type='withdrawal'/>
        </ComponentCard>

        <ComponentCard title="En Çok Kazandıran">
          <BasicTableSmall list={topFiveNetContribution} type='contribution'/>
        </ComponentCard>
      </div>
    </>
  );
}
