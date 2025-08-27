"use client";

import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import React, { useEffect, useState } from "react";
import { PlayerBalanceList, useAuth } from "@/context/AuthContext";
import DateRangePicker from "@/components/DateRangePicker";
import { format } from "date-fns";
import ComponentCard from "@/components/common/ComponentCard";
import BasicTableSmall from "@/components/tables/BasicTableSmall";
import CountUp from "react-countup";
import { EnrichedClientData } from "@/components/constants/types"; // ✅ Import the type

// --- Dummy fallback data ---
const dummyClients: EnrichedClientData[] = [
  {
    ClientId: 101,
    Login: "alice01",
    Name: "Alice Johnson",
    BTag: "AFF123",
    DepositAmount: 1500.75,
    DepositCount: 5,
    WithdrawalAmount: 600.25,
    WithdrawalCount: 2,
    dateLocal: "2025-08-01T14:32:00",
  },
  {
    ClientId: 102,
    Login: "bobking",
    Name: "Bob King",
    BTag: "BET456",
    DepositAmount: 3200.0,
    DepositCount: 12,
    WithdrawalAmount: 1250.5,
    WithdrawalCount: 4,
    dateLocal: "2025-08-02T10:15:00",
  },
  {
    ClientId: 103,
    Login: "charlie_x",
    Name: "Charlie Xavier",
    BTag: "VIP789",
    DepositAmount: 980.0,
    DepositCount: 3,
    WithdrawalAmount: 200.0,
    WithdrawalCount: 1,
    dateLocal: "2025-08-03T18:45:00",
  },
  {
    ClientId: 104,
    Login: "diana88",
    Name: "Diana Prince",
    BTag: "PROMO321",
    DepositAmount: 5000.5,
    DepositCount: 20,
    WithdrawalAmount: 3000.0,
    WithdrawalCount: 10,
    dateLocal: "2025-08-04T09:05:00",
  },
];

const dummyBalances: PlayerBalanceList[] = [
  { playerId: 1, playerName: "Alice", playerBalance: 1200.5 },
  { playerId: 2, playerName: "Bob", playerBalance: 875.0 },
  { playerId: 3, playerName: "Charlie", playerBalance: 452.75 },
  { playerId: 4, playerName: "Diana", playerBalance: 3000.1 },
];

export default function Ecommerce() {
  const { userInfo, playerBalanceData } = useAuth();

  // 🔑 Fallback to dummy if context is empty
  const safeUserInfo = userInfo || { pct: 20 };
  const safePlayerData = playerBalanceData || {
    enrichedClients: dummyClients,
    playerBalances: dummyBalances,
  };

  const [profit, setProfit] = useState<number | undefined>();
  const [prevProfit, setPrevProfit] = useState(0);
  const [userCount, setUserCount] = useState<number | undefined>();
  const [pendingCommision, setPendingCommision] = useState<number | undefined>();
  const [currentTotalDeposit, setCurrentTotalDeposit] = useState(0.0);
  const [currentTotalDepositCount, setCurrentTotalDepositCount] = useState(0);
  const [topFiveTotalDeposit, setTopFiveTotalDeposit] = useState<EnrichedClientData[]>([]);
  const [currentTotalWithdrawal, setCurrentTotalWithdrawal] = useState(0.0);
  const [currentTotalWithdrawalCount, setCurrentTotalWithdrawalCount] = useState(0);
  const [topFiveTotalWithdrawal, setTopFiveTotalWithdrawal] = useState<EnrichedClientData[]>([]);
  const [topFiveNetContribution, setTopFiveNetContribution] = useState<EnrichedClientData[]>([]);
  const [currentTotalCommisionAmount, setCurrentTotalCommisionAmount] = useState(0.0);
  const [currentTotalBalance, setCurrentTotalBalance] = useState(0.0);
  const [currentBalanceUserCount, setCurrentBalanceUserCount] = useState(0);
  const [isLoadingTotal, setIsLoadingTotal] = useState(true);

  const formatDate = (date: Date) => format(date, "dd-MM-yy");
  const today = new Date();
  const formattedToday = formatDate(today);

  const [range, setRange] = useState<{ MinCreatedLocal: string; MaxCreatedLocal: string }>({
    MinCreatedLocal: formattedToday,
    MaxCreatedLocal: formattedToday,
  });

  // --- Calculation helpers ---
  const calculatePercentageProfit = (clients: EnrichedClientData[]): number => {
    const totalDeposit = clients.reduce((sum, c) => sum + c.DepositAmount, 0);
    const totalWithdrawal = clients.reduce((sum, c) => sum + c.WithdrawalAmount, 0);
    const profit = totalDeposit - totalWithdrawal;
    if (totalDeposit === 0) return 0;
    return parseFloat(((profit / totalDeposit) * 100).toFixed(2));
  };

  const calculatePendingCommission = (clients: EnrichedClientData[], pct: number): number => {
    const total = clients.reduce((acc, client) => acc + (client.DepositAmount - client.WithdrawalAmount), 0);
    return parseFloat((total * (pct / 100)).toFixed(2));
  };

  const calculateTotalDeposits = (clients: EnrichedClientData[]) => {
    let total = 0,
      count = 0;
    clients.forEach((c) => {
      if (c.DepositAmount > 0) {
        total += c.DepositAmount;
        count += c.DepositCount;
      }
    });
    setTopFiveTotalDeposit(clients.sort((a, b) => b.DepositAmount - a.DepositAmount).slice(0, 5));
    return { total: parseFloat(total.toFixed(2)), count };
  };

  const calculateTotalWithdrawals = (clients: EnrichedClientData[]) => {
    let total = 0,
      count = 0;
    clients.forEach((c) => {
      if (c.WithdrawalAmount > 0) {
        total += c.WithdrawalAmount;
        count += c.WithdrawalCount;
      }
    });
    setTopFiveTotalWithdrawal(clients.sort((a, b) => b.WithdrawalAmount - a.WithdrawalAmount).slice(0, 5));
    return { total: parseFloat(total.toFixed(2)), count };
  };

  const calculateTotalBalance = (clients: PlayerBalanceList[]) => {
    let total = 0,
      count = 0;
    clients.forEach((c) => {
      if (c.playerBalance > 0) {
        total += c.playerBalance;
        count++;
      }
    });
    return { total: parseFloat(total.toFixed(2)), count };
  };

  const getTop5ByNetDeposit = (clients: EnrichedClientData[]): EnrichedClientData[] =>
    clients
      .map((c) => ({ ...c, netDeposit: c.DepositAmount - c.WithdrawalAmount }))
      .sort((a, b) => b.netDeposit - a.netDeposit)
      .slice(0, 5);

  const handleDateChange = (range: { MinCreatedLocal: string; MaxCreatedLocal: string }) => setRange(range);

  // 🔑 Populate metrics
  useEffect(() => {
  const clients = safePlayerData.enrichedClients || [];

  setPrevProfit(profit ?? 0);
  setProfit(calculatePercentageProfit(clients));
  setPendingCommision(calculatePendingCommission(clients, safeUserInfo.pct || 20));

  const { total: depositTotal, count: depositCount } = calculateTotalDeposits(clients);
  setCurrentTotalDeposit(depositTotal);
  setCurrentTotalDepositCount(depositCount);

  const { total: withdrawalTotal, count: withdrawalCount } = calculateTotalWithdrawals(clients);
  setCurrentTotalWithdrawal(withdrawalTotal);
  setCurrentTotalWithdrawalCount(withdrawalCount);

  const { total: balanceTotal, count: balanceCount } = calculateTotalBalance(safePlayerData.playerBalances || []);
  setCurrentTotalBalance(balanceTotal);
  setCurrentBalanceUserCount(balanceCount);

  setCurrentTotalCommisionAmount(calculatePendingCommission(clients, safeUserInfo.pct || 20));
  setUserCount(clients.length);
  setTopFiveNetContribution(getTop5ByNetDeposit(clients));

  setIsLoadingTotal(false);
}, [safePlayerData, safeUserInfo]);


  return (
    <>
      {/* header */}
      <div className="flex flex-col md:flex-row items-center justify-between w-full h-auto py-8">
        <h1 className="font-bold text-xl px-2 mb-2 md:mb-0">Genel</h1>
        <div className="flex flex-col md:flex-row items-center justify-between w-full md:w-[50%]">
          <div className="flex flex-row items-center gap-2 justify-between w-full md:w-[60%] ">
            {/* Profit */}
            <div className="flex flex-col items-center justify-center">
              <h2 className="font-light text-sm text-center">Kar</h2>
              <div className={`font-semibold ${profit && profit >= 0 ? "text-green-700" : "text-red-700"} text-sm`}>
                {profit !== undefined ? <CountUp end={profit} start={prevProfit} duration={1.5} decimals={2} /> : "-"}
              </div>
            </div>
            {/* Pending Commission */}
            <div className="flex flex-col items-center justify-center">
              <h2 className="font-light text-sm text-center">Bekleyen Komisyon</h2>
              <div className="font-semibold text-sm">
                {pendingCommision !== undefined ? <CountUp end={pendingCommision} duration={1.5} decimals={2} /> : "-"}
              </div>
            </div>
            {/* User Count */}
            <div className="flex flex-col items-center justify-center">
              <h2 className="font-light text-sm text-center">Oyuncu Sayısı</h2>
              <div className="font-semibold text-sm">
                {userCount !== undefined ? <CountUp end={userCount} duration={1.5} /> : "-"}
              </div>
            </div>
          </div>
          <div className="w-full md:w-auto flex items-center justify-center mt-5 md:mt-0">
            <DateRangePicker onChange={handleDateChange} />
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full mb-5">
        <EcommerceMetrics name="Yatırım" amount={currentTotalDeposit} count={`${currentTotalDepositCount} Yatırım`} isLoading={isLoadingTotal} />
        <EcommerceMetrics name="Çekim" amount={currentTotalWithdrawal} count={`${currentTotalWithdrawalCount} Çekim`} isLoading={isLoadingTotal} />
        <EcommerceMetrics name="Komisyon" amount={currentTotalCommisionAmount} count={`${safeUserInfo.pct}% Oran`} isLoading={isLoadingTotal} />
        <EcommerceMetrics name="Toplam Bakiye" amount={currentTotalBalance} count={`${currentBalanceUserCount} Oyuncu`} isLoading={isLoadingTotal} />
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ComponentCard title="En Yüksek Yatırımlar">
          <BasicTableSmall list={topFiveTotalDeposit} type="deposit" />
        </ComponentCard>
        <ComponentCard title="En Yüksek Toplam Çekim">
          <BasicTableSmall list={topFiveTotalWithdrawal} type="withdrawal" />
        </ComponentCard>
        <ComponentCard title="En Çok Kazandıran">
          <BasicTableSmall list={topFiveNetContribution} type="contribution" />
        </ComponentCard>
      </div>
    </>
  );
}
