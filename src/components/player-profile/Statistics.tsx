import React from "react";
import { Player } from "../constants/types";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Wallet,
  Gamepad2,
  TrendingUp,
  TrendingDown,
  Calendar,
  Trophy,
} from "lucide-react";

interface StatisticProps {
  playerData?: Player;
  isLoadingData: boolean;
}

const Statistic = ({ playerData, isLoadingData }: StatisticProps) => {
  const formatCurrency = (amount: number | undefined | null) => {
    if (amount == null || isNaN(amount)) return "₺0.00";
    return `₺${amount.toLocaleString("tr-TR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("tr-TR");
  };

  const SkeletonLoader = ({ className = "" }: { className?: string }) => (
    <div
      className={`bg-gray-200 dark:bg-gray-700 animate-pulse rounded ${className}`}
    ></div>
  );

  const calculatePercentage = (stakes: number, win: number) => {
    if (stakes === 0) return "0%";
    const profit = win - stakes;
    const percentage = (profit / stakes) * 100;
    return `${parseFloat(percentage.toFixed(2))}%`;
  };

  const Card = ({
    title,
    value,
    icon: Icon,
    iconColor,
    isLoading,
  }: {
    title: string;
    value: string;
    icon: React.ElementType;
    iconColor: string;
    isLoading: boolean;
  }) => (
    <div className="bg-white/90 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 min-h-[110px] flex flex-col shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-center gap-2 mb-1">
        <Icon className={`w-5 h-5 ${iconColor}`} />
        <h4 className="font-medium text-sm text-gray-800 dark:text-gray-200">
          {title}
        </h4>
      </div>
      {isLoading ? (
        <SkeletonLoader className="h-6 w-24 mt-auto" />
      ) : (
        <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 mt-auto">
          {value}
        </p>
      )}
    </div>
  );

  return (
    <div className="container mx-auto px-4">
      {/* === Top Summary Row === */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3 mt-8 mb-10">
        <Card
          title="Total Deposit"
          value={formatCurrency(playerData?.totalDepositAmount)}
          icon={ArrowDownCircle}
          iconColor="text-emerald-500"
          isLoading={isLoadingData}
        />
        <Card
          title="Total Withdrawal"
          value={formatCurrency(playerData?.totalWithdrawalAmount)}
          icon={ArrowUpCircle}
          iconColor="text-rose-500"
          isLoading={isLoadingData}
        />
        <Card
          title="Net Balance"
          value={formatCurrency(
            (playerData?.totalDepositAmount || 0) -
              (playerData?.totalWithdrawalAmount || 0)
          )}
          icon={Wallet}
          iconColor="text-indigo-500"
          isLoading={isLoadingData}
        />
      </div>

      {/* === Deposit Section === */}
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
        Financial Statistics
      </h2>

      <h4 className="text-md font-semibold text-gray-700 dark:text-gray-200 mb-3 flex items-center gap-2">
        <ArrowDownCircle className="w-5 h-5 text-emerald-500" />
        Deposit Statistics
      </h4>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3">
        {[
          { title: "First Deposit Date", value: formatDate(playerData?.firstDepositDate), icon: Calendar },
          { title: "First Deposit Amount", value: formatCurrency(playerData?.firstDepositAmount), icon: TrendingUp },
          { title: "Last Deposit Date", value: formatDate(playerData?.lastDepositDate), icon: Calendar },
          { title: "Last Deposit Amount", value: formatCurrency(playerData?.lastDepositAmount), icon: TrendingUp },
          { title: "Total Deposit", value: formatCurrency(playerData?.totalDepositAmount), icon: Wallet },
          { title: "Total Deposit Count", value: playerData?.depositCount?.toString() || "0", icon: TrendingUp },
          {
            title: "Average Deposit",
            value: formatCurrency(
              playerData?.totalDepositAmount && playerData?.depositCount
                ? playerData.totalDepositAmount / playerData.depositCount
                : 0
            ),
            icon: Wallet,
          },
        ].map((stat, i) => (
          <Card
            key={i}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            iconColor="text-emerald-500"
            isLoading={isLoadingData}
          />
        ))}
      </div>

      {/* === Withdrawal Section === */}
      <h4 className="text-md font-semibold text-gray-700 dark:text-gray-200 mb-3 mt-8 flex items-center gap-2">
        <ArrowUpCircle className="w-5 h-5 text-rose-500" />
        Withdrawal Statistics
      </h4>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3">
        {[
          { title: "First Withdrawal Date", value: formatDate(playerData?.firstWithdrawalDate), icon: Calendar },
          { title: "First Withdrawal Amount", value: formatCurrency(playerData?.firstWithdrawalAmount), icon: TrendingDown },
          { title: "Last Withdrawal Date", value: formatDate(playerData?.lastWithdrawalDate), icon: Calendar },
          { title: "Last Withdrawal Amount", value: formatCurrency(playerData?.lastWithdrawalAmount), icon: TrendingDown },
          { title: "Total Withdrawal", value: formatCurrency(playerData?.totalWithdrawalAmount), icon: Wallet },
          { title: "Total Withdrawal Count", value: playerData?.withdrawalCount?.toString() || "0", icon: TrendingDown },
          {
            title: "Average Withdrawal",
            value: formatCurrency(
              playerData?.totalWithdrawalAmount && playerData?.withdrawalCount
                ? playerData.totalWithdrawalAmount / playerData.withdrawalCount
                : 0
            ),
            icon: Wallet,
          },
        ].map((stat, i) => (
          <Card
            key={i}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            iconColor="text-rose-500"
            isLoading={isLoadingData}
          />
        ))}
      </div>

      {/* === Casino Section === */}
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 mt-8">
        Gaming Statistics
      </h2>

      <h4 className="text-md font-semibold text-gray-700 dark:text-gray-200 mb-3 flex items-center gap-2">
        <Gamepad2 className="w-5 h-5 text-blue-500" />
        Casino Statistics
      </h4>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3">
        {[
          { title: "Total Casino Bet", value: formatCurrency(playerData?.totalCasinoStakes), icon: TrendingUp },
          { title: "Total Casino Win", value: formatCurrency(playerData?.totalCasinoWin), icon: TrendingDown },
          {
            title: "Casino Net Profit",
            value: formatCurrency((playerData?.totalCasinoStakes || 0) - (playerData?.totalCasinoWin || 0)),
            icon: Wallet,
          },
          {
            title: "Casino Profit %",
            value: calculatePercentage(playerData?.totalCasinoStakes || 0, playerData?.totalCasinoWin || 0),
            icon: TrendingUp,
          },
          { title: "Last Casino Bet Date", value: formatDate(playerData?.lastCasinoBetDate), icon: Calendar },
          { title: "First Casino Bet Date", value: formatDate(playerData?.firstCasinoBetDate), icon: Calendar },
        ].map((stat, i) => (
          <Card
            key={i}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            iconColor="text-blue-500"
            isLoading={isLoadingData}
          />
        ))}
      </div>

      {/* === Sport Section === */}
      <h4 className="text-md font-semibold text-gray-700 dark:text-gray-200 mb-3 mt-8 flex items-center gap-2">
        <Trophy className="w-5 h-5 text-orange-500" />
        Sport Statistics
      </h4>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3">
        {[
          { title: "Total Sport Bet", value: formatCurrency(playerData?.totalSportStakes), icon: TrendingUp },
          { title: "Total Sport Winning", value: formatCurrency(playerData?.totalSportWin), icon: TrendingDown },
          {
            title: "Sport Net Profit",
            value: formatCurrency((playerData?.totalSportStakes || 0) - (playerData?.totalSportWin || 0)),
            icon: Wallet,
          },
          {
            title: "Sport Profit %",
            value: calculatePercentage(playerData?.totalSportStakes || 0, playerData?.totalSportWin || 0),
            icon: TrendingUp,
          },
          { title: "Last Sport Bet Date", value: formatDate(playerData?.lastSportBetDate), icon: Calendar },
          { title: "First Sport Bet Date", value: formatDate(playerData?.firstSportBetDate), icon: Calendar },
        ].map((stat, i) => (
          <Card
            key={i}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            iconColor="text-orange-500"
            isLoading={isLoadingData}
          />
        ))}
      </div>
    </div>
  );
};

export default Statistic;
