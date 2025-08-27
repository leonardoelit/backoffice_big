"use client"

import React, { useEffect, useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import BasicTableSmallAdmin from "@/components/tables/BasicTableSmallAdmin";
import CountUp from "react-countup";
import DateRangePicker from "@/components/DateRangePicker";
import { format } from 'date-fns';
import { EnrichedClientData } from "@/context/AuthContext";

export interface AdminUserStats {
  id: number;
  username: string;
  fullname: string;
  lastname: string;
  btag: string;
  role: string;
  balance: number;
  pct: number;
  usersTotalDeposit: number;
  usersTotalWithdrawal: number;
  thisMonthsTotalDeposit: number;
  thisMonthsTotalWithdrawal: number;
  userCount: number;
  thisMonthsUserCount: number;
  createdAt: string;
}

export interface AdminUserTableStats {
  id: number;
  username: string;
  fullname: string;
  lastname: string;
  btag: string;
  usersTotalDeposit: number;
  usersTotalWithdrawal: number;
  depositCount: number,
  withdrawalCount: number,
  userCount: number;
  createdAt: string;
}

interface TopStatsResult {
  topByDeposit: AdminUserTableStats[];
  topByWithdrawal: AdminUserTableStats[];
  topByNetDeposit: AdminUserTableStats[];
}

export default function AdminPage() {
    const [profit, setProfit] = useState(Number);
    const [prevProfit, setPrevProfit] = useState(Number);
    const [pendingCommision, setPendingCommision] = useState(0.00);
    const [userCount, setUserCount] = useState(Number);
    const [currentTotalDeposit, setCurrentTotalDeposit] = useState(0.00);
    const [currentTotalDepositCount, setCurrentTotalDepositCount] = useState(0);
    const [totalWithdrawableBalance, settotalWithdrawableBalance] = useState(0.00)
    const [totalWithdrawableUserCount, settotalWithdrawableUserCount] = useState(0)
    const [topFiveTotalDeposit, setTopFiveTotalDeposit] = useState<AdminUserTableStats[]>([])
    const [currentTotalWithdrawal, setCurrentTotalWithdrawal] = useState(0.00);
    const [currentTotalWithdrawalCount, setCurrentTotalWithdrawalCount] = useState(0);
    const [topFiveTotalWithdrawal, setTopFiveTotalWithdrawal] = useState<AdminUserTableStats[]>([])
    const [topFiveNetContribution, setTopFiveNetContribution] = useState<AdminUserTableStats[]>([])
    const [currentTotalCommisionAmount, setCurrentTotalCommisionAmount] = useState(0.00);
    const [currentTotalCommisionCount, setCurrentTotalCommisionCount] = useState(0);
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
  
    const calculatePendingCommission = (users: AdminUserStats[]): number => {
      const totalCommission = users.reduce((acc, client) => {
        const profit = client.thisMonthsTotalDeposit - client.thisMonthsTotalWithdrawal;
        const pctDecimal = client.pct / 100;
        const userCommission = profit * pctDecimal;
        return acc + userCommission;
      }, 0);

      return parseFloat(totalCommission.toFixed(2));
    };

    const calculateTotalPendingCommission = (
      clients: EnrichedClientData[],
      users: AdminUserStats[] | undefined
    ): { totalCommission: number; userCount: number } => {
      if (!users || users.length === 0) return { totalCommission: 0, userCount: 0 };

      const grouped = new Map<string, EnrichedClientData[]>();

      // Group clients by lowercased BTag
      for (const client of clients) {
        const lowerBTag = client.BTag.toLowerCase();
        if (!grouped.has(lowerBTag)) {
          grouped.set(lowerBTag, []);
        }
        grouped.get(lowerBTag)!.push(client);
      }

      let totalCommission = 0;
      let userCount = 0;

      for (const [btag, groupClients] of grouped.entries()) {
        const user = users.find((u) => u.btag.toLowerCase() === btag);
        if (!user) continue;

        const pctDecimal = user.pct / 100;

        const total = groupClients.reduce((acc, client) => {
          return acc + (client.DepositAmount - client.WithdrawalAmount);
        }, 0);

        const commission = total * pctDecimal;

        if (commission !== 0) {
          userCount++;
        }

        totalCommission += commission;
      }

      return {
        totalCommission: parseFloat(totalCommission.toFixed(2)),
        userCount,
      };
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
      })
      return {
        total: parseFloat(total.toFixed(2)),
        count
      };
    };

    const calculateTotalWithdrawableBalance = (users: AdminUserStats[]): { total: number; count: number } => {
      let total = 0;
      let count = 0;
  
      users.forEach(user => {
        if (user.balance !== 0.00) {
          total += Number(user.balance);
          count++;
        }
      });
  
      return {
        total: parseFloat(total.toFixed(2)),
        count
      };
    }

    function getTopBTagStatsWithUsers(
      data: EnrichedClientData[] = [],
      users: AdminUserStats[] = []
    ): TopStatsResult {
      if (!Array.isArray(data)) {
        console.error("Expected EnrichedClientData[] but got:", data);
        return { topByDeposit: [], topByWithdrawal: [], topByNetDeposit: [] };
      }

      const grouped = new Map<string, {
        totalDeposit: number;
        totalWithdrawal: number;
        depositCount: number;
        withdrawalCount: number;
      }>();

      for (const client of data) {
        const btag = client.BTag;
        const current = grouped.get(btag) || {
          totalDeposit: 0,
          totalWithdrawal: 0,
          depositCount: 0,
          withdrawalCount: 0,
        };

        current.totalDeposit += client.DepositAmount;
        current.totalWithdrawal += client.WithdrawalAmount;
        current.depositCount += client.DepositCount;
        current.withdrawalCount += client.WithdrawalCount;

        grouped.set(btag, current);
      }

      const allStats = Array.from(grouped.entries()).map(([btag, stats]) => {
        const user = users.find(u => u.btag === btag);

        if (!user) return null;

        return {
          id: user.id,
          username: user.username,
          fullname: user.fullname,
          lastname: user.lastname,
          btag: user.btag,
          usersTotalDeposit: stats.totalDeposit,
          usersTotalWithdrawal: stats.totalWithdrawal,
          depositCount: stats.depositCount,
          withdrawalCount: stats.withdrawalCount,
          userCount: user.userCount,
          createdAt: user.createdAt,
          netDeposit: stats.totalDeposit - stats.totalWithdrawal, // used for sorting only
        };
      }).filter(Boolean) as (AdminUserTableStats & { netDeposit: number })[];

      return {
        topByDeposit: [...allStats]
          .sort((a, b) => b.usersTotalDeposit - a.usersTotalDeposit)
          .slice(0, 5)
          .map(({ netDeposit: _, ...rest }) => rest),

        topByWithdrawal: [...allStats]
          .sort((a, b) => b.usersTotalWithdrawal - a.usersTotalWithdrawal)
          .slice(0, 5)
          .map(({ netDeposit: _, ...rest }) => rest),

        topByNetDeposit: [...allStats]
          .sort((a, b) => b.netDeposit - a.netDeposit)
          .slice(0, 5)
          .map(({ netDeposit: _, ...rest }) => rest),
      };
    }

    useEffect(() => {
        setIsLoadingTotal(true);
      }, [range])

    const handleDateChange = (range: { MinCreatedLocal: string; MaxCreatedLocal: string }) => {
    setRange(range)
  }
    
  return (
    <>
    <div className="flex flex-col md:flex-row items-center justify-between w-full h-auto py-8">
      <h1 className="font-bold text-xl px-2 mb-2 md:mb-0">Genel ( Bu Ay )</h1>
      <div className="flex flex-col md:flex-row items-center justify-between w-full md:w-[50%]">
        <div className="flex flex-row items-center gap-2 justify-between w-full md:w-[60%]">
        <div className="flex flex-col items-center justify-center">
          <h2 className="font-light text-sm text-center">Kar</h2>
          <div className={`font-semibold ${profit >= 0 ? 'text-green-700' : 'text-red-700'} text-sm text-center min-w-[60px]`}>
            {typeof profit === 'number' ? (
              <span>
                <CountUp end={profit} start={prevProfit} duration={1.5} separator="," decimals={2} />%
              </span>
            ) : (
              <span>0%</span>
            )}
          </div>
          
        </div>
        <div className="flex flex-col items-center justify-center">
          <h2 className="font-light text-sm text-center">Bekleyen Komisyon</h2>
          <div className="font-semibold text-sm text-center">
            {typeof pendingCommision === 'number' ? (
              <span>
                <CountUp end={pendingCommision} duration={1.5} separator="," decimals={2} />{' '}TL
              </span>
            ) : (
              <span>0.00</span>
            )}
          </div>
        </div>
        <div className="flex flex-col items-center justify-center">
          <h2 className="font-light text-sm text-center">Kullanıcı Sayısı</h2>
          <div className="font-semibold text-sm text-center">
            {typeof userCount === 'number' ? (
              <span>
                <CountUp end={userCount} duration={1.5} separator="," />
              </span>
            ) : (
              <span>0</span>
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
      <EcommerceMetrics name="Komisyon" amount={currentTotalCommisionAmount} count={`${currentTotalCommisionCount} Kullanıcı`} isLoading={isLoadingTotal} />
      <EcommerceMetrics name="Çekilebilir Bakiye" amount={totalWithdrawableBalance} count={`${totalWithdrawableUserCount} Kullanıcı`} isLoading={isLoadingTotal} /> 
    </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ComponentCard title="En Yüksek Toplam Yatırım">
          <BasicTableSmallAdmin list={topFiveTotalDeposit} type='deposit' />
        </ComponentCard>

        <ComponentCard title="En Yüksek Toplam Çekim">
          <BasicTableSmallAdmin list={topFiveTotalWithdrawal} type='withdrawal'/>
        </ComponentCard>

        <ComponentCard title="En Yüksek Net Katkı">
          <BasicTableSmallAdmin list={topFiveNetContribution} type='contribution'/>
        </ComponentCard>
      </div>
    </>
  );
}
