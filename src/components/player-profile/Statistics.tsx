// components/Statistic.tsx
import React from "react";
import { Player } from "../constants/types";

interface StatisticProps {
  playerData?: Player;
  isLoadingData: boolean;
}

const Statistic = ({ playerData, isLoadingData }: StatisticProps) => {
  // Helper function to format currency
  const formatCurrency = (amount: number | undefined | null) => {
  if (amount == null || isNaN(amount)) return "₺0.00";
  return `₺${amount.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

  // Helper function to format date
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('tr-TR');
  };

  // Skeleton loader component
  const SkeletonLoader = ({ className = "" }: { className?: string }) => (
    <div className={`bg-gray-200 dark:bg-gray-700 animate-pulse rounded ${className}`}></div>
  );

  const calculatePercentage = (stakes: number, win: number) => {
    if (stakes === 0) return "0%";
    const profit = win - stakes;
    const percentage = (profit / stakes) * 100;
    return `${parseFloat(percentage.toFixed(2))}%`;
  };
  return (
    <div className="container mx-auto px-4">
      {/* Top Summary Row */}
      <div className="container mx-auto px-4 mt-15 mb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-2">
          {/* Total Deposit */}
          <div className="bg-white dark:bg-gray-dark rounded-md p-4 border border-gray-300 dark:border-gray-700 min-h-[100px] flex flex-col">
            <h4 className="font-semibold text-sm dark:text-gray-200 mb-2">Total Deposit</h4>
            {isLoadingData ? (
              <SkeletonLoader className="h-6 w-24 mt-auto" />
            ) : (
              <p className="text-lg text-gray-600 dark:text-gray-400 mt-auto">
                {formatCurrency(playerData?.totalDepositAmount)}
              </p>
            )}
          </div>

          {/* Total Withdrawal */}
          <div className="bg-white dark:bg-gray-dark rounded-md p-4 border border-gray-300 dark:border-gray-700 min-h-[100px] flex flex-col">
            <h4 className="font-semibold text-sm dark:text-gray-200 mb-2">Total Withdrawal</h4>
            {isLoadingData ? (
              <SkeletonLoader className="h-6 w-24 mt-auto" />
            ) : (
              <p className="text-lg text-gray-600 dark:text-gray-400 mt-auto">
                {formatCurrency(playerData?.totalWithdrawalAmount)}
              </p>
            )}
          </div>

          {/* Net */}
          <div className="bg-white dark:bg-gray-dark rounded-md p-4 border border-gray-300 dark:border-gray-700 min-h-[100px] flex flex-col">
            <h4 className="font-semibold text-sm dark:text-gray-200 mb-2">Net</h4>
            {isLoadingData ? (
              <SkeletonLoader className="h-6 w-24 mt-auto" />
            ) : (
              <p className="text-lg text-gray-600 dark:text-gray-400 mt-auto">
                {formatCurrency((playerData?.totalDepositAmount || 0) - (playerData?.totalWithdrawalAmount || 0))}
              </p>
            )}
          </div>
        </div>
      </div>

      <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Financial Statistics</h2>
      
      {/* Deposit Statistics */}
      <h4 className="text-md font-semibold text-gray-600 dark:text-white mb-3">Deposit Statistics</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-2">
        {[
          { title: "First Deposit Date", value: formatDate(playerData?.firstDepositDate), isLoading: isLoadingData },
          { title: "First Deposit Amount", value: formatCurrency(playerData?.firstDepositAmount), isLoading: isLoadingData },
          { title: "Last Deposit Date", value: formatDate(playerData?.lastDepositDate), isLoading: isLoadingData },
          { title: "Last Deposit Amount", value: formatCurrency(playerData?.lastDepositAmount), isLoading: isLoadingData },
          { title: "Total Deposit", value: formatCurrency(playerData?.totalDepositAmount), isLoading: isLoadingData },
          { title: "Total Deposit Count", value: playerData?.depositCount?.toString() || "0", isLoading: isLoadingData },
          { title: "Average Deposit", value: formatCurrency(playerData?.totalDepositAmount && playerData?.depositCount ? playerData.totalDepositAmount / playerData.depositCount : 0), isLoading: isLoadingData },
        ].map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-dark rounded-md p-4 border border-gray-300 dark:border-gray-700 min-h-[100px] flex flex-col">
            <h4 className="font-semibold text-sm dark:text-gray-200 mb-2">{stat.title}</h4>
            {stat.isLoading ? (
              <SkeletonLoader className="h-6 w-20 mt-auto" />
            ) : (
              <p className="text-lg text-gray-600 dark:text-gray-400 mt-auto">{stat.value}</p>
            )}
          </div>
        ))}
      </div>

      {/* Withdrawal Statistics */}
      <div className="mt-8">
        <h4 className="text-md font-semibold text-gray-600 dark:text-white mb-3">Withdrawal Statistics</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-2">
          {[
            { title: "First Withdrawal Date", value: formatDate(playerData?.firstWithdrawalDate), isLoading: isLoadingData },
            { title: "First Withdrawal Amount", value: formatCurrency(playerData?.firstWithdrawalAmount), isLoading: isLoadingData },
            { title: "Last Withdrawal Date", value: formatDate(playerData?.lastWithdrawalDate), isLoading: isLoadingData },
            { title: "Last Withdrawal Amount", value: formatCurrency(playerData?.lastWithdrawalAmount), isLoading: isLoadingData },
            { title: "Total Withdrawal", value: formatCurrency(playerData?.totalWithdrawalAmount), isLoading: isLoadingData },
            { title: "Total Withdrawal Count", value: playerData?.withdrawalCount?.toString() || "0", isLoading: isLoadingData },
            { title: "Average Withdrawal", value: formatCurrency(playerData?.totalWithdrawalAmount && playerData?.withdrawalCount ? playerData.totalWithdrawalAmount / playerData.withdrawalCount : 0), isLoading: isLoadingData },
          ].map((stat, index) => (
            <div key={index} className="bg-white dark:bg-gray-dark rounded-md p-4 border border-gray-300 dark:border-gray-700 min-h-[110px] flex flex-col">
              <h4 className="font-semibold text-sm dark:text-gray-200 mb-2">{stat.title}</h4>
              {stat.isLoading ? (
                <SkeletonLoader className="h-6 w-20 mt-auto" />
              ) : (
                <p className="text-lg text-gray-600 dark:text-gray-400 mt-auto">{stat.value}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Gaming Statistics */}
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 mt-6">Gaming Statistics</h2>
      
      {/* Casino Statistics */}
      <h4 className="text-md font-semibold text-gray-600 dark:text-white mb-3 mt-6">Casino Statistics</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-2">
        {[
          { title: "Total Casino Bet", value: formatCurrency(playerData?.totalCasinoStakes), isLoading: isLoadingData },
          { title: "Total Casino Winning", value: formatCurrency(playerData?.totalCasinoWin), isLoading: isLoadingData },
          { title: "Casino Net Profit", value: formatCurrency((playerData?.totalCasinoStakes || 0) - (playerData?.totalCasinoWin || 0)), isLoading: isLoadingData },
          {
            title: "Casino Profit %",
            value: calculatePercentage(
              playerData?.totalCasinoStakes || 0,
              playerData?.totalCasinoWin || 0
            ),
            isLoading: isLoadingData,
          },
          { title: "Last Casino Bet Date", value: formatDate(playerData?.lastCasinoBetDate), isLoading: isLoadingData },
          { title: "First Casino Bet Date", value: formatDate(playerData?.firstCasinoBetDate), isLoading: isLoadingData },
        ].map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-dark rounded-md p-4 border border-gray-300 dark:border-gray-700 min-h-[100px] flex flex-col">
            <h4 className="font-semibold text-sm dark:text-gray-200 mb-2">{stat.title}</h4>
            {stat.isLoading ? (
              <SkeletonLoader className="h-6 w-20 mt-auto" />
            ) : (
              <p className="text-lg text-gray-600 dark:text-gray-400 mt-auto">{stat.value}</p>
            )}
          </div>
        ))}
      </div>

      {/* Sport Statistics */}
      <h4 className="text-md font-semibold text-gray-600 dark:text-white mb-3 mt-6">Sport Statistics</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-2">
        {[
          { title: "Total Sport Bet", value: formatCurrency(playerData?.totalSportStakes), isLoading: isLoadingData },
          { title: "Total Sport Winning", value: formatCurrency(playerData?.totalSportWin), isLoading: isLoadingData },
          { title: "Sport Net Profit", value: formatCurrency((playerData?.totalSportStakes || 0) - (playerData?.totalSportWin || 0)), isLoading: isLoadingData },
          {
            title: "Sport Profit %",
            value: calculatePercentage(
              playerData?.totalSportStakes || 0,
              playerData?.totalSportWin || 0
            ),
            isLoading: isLoadingData,
          },
          { title: "Last Sport Bet Date", value: formatDate(playerData?.lastSportBetDate), isLoading: isLoadingData },
          { title: "First Sport Bet Date", value: formatDate(playerData?.firstSportBetDate), isLoading: isLoadingData },
        ].map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-dark rounded-md p-4 border border-gray-300 dark:border-gray-700 min-h-[100px] flex flex-col">
            <h4 className="font-semibold text-sm dark:text-gray-200 mb-2">{stat.title}</h4>
            {stat.isLoading ? (
              <SkeletonLoader className="h-6 w-20 mt-auto" />
            ) : (
              <p className="text-lg text-gray-600 dark:text-gray-400 mt-auto">{stat.value}</p>
            )}
          </div>
        ))}
      </div>

      {/* Additional Statistics Sections */}
      {/* <div className="container mx-auto px-4 mt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
          {[1, 2].map((num) => (
            <div key={num} className="relative bg-white dark:bg-gray-dark rounded-md p-4 border border-gray-300 dark:border-gray-700">
              <div className="absolute top-2 right-2 group cursor-pointer">
                <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 text-xs text-white rounded-full flex items-center justify-center">
                  ?
                </div>
                <div className="absolute z-10 hidden group-hover:block bg-black text-white text-xs rounded py-1 px-2 mt-1 right-0 w-48">
                  Bu kutu hakkında bilgi metni burada olacak.
                </div>
              </div>
              <h3 className="font-semibold text-sm dark:text-gray-200 mb-2">Başlık {num}</h3>
              {isLoadingData ? (
                <>
                  <SkeletonLoader className="h-4 w-32 mb-2" />
                  <SkeletonLoader className="h-4 w-28" />
                </>
              ) : (
                <>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Etiket 1: Dummy Veri</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Etiket 2: Dummy Veri</p>
                </>
              )}
            </div>
          ))}
        </div>

        {[2, 3].map((row, rowIndex) => (
          <div key={rowIndex} className={`grid grid-cols-1 ${rowIndex === 1 ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-6 mb-6`}>
            {Array.from({ length: rowIndex === 1 ? 3 : 2 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-dark rounded-md p-4 border border-gray-300 dark:border-gray-700">
                <h3 className="font-semibold text-sm dark:text-gray-200 mb-2">
                  {rowIndex + 1}. Satır Başlık {rowIndex === 1 ? '' : i + 1}
                </h3>
                {isLoadingData ? (
                  <>
                    <SkeletonLoader className="h-4 w-32 mb-2" />
                    <SkeletonLoader className="h-4 w-28" />
                  </>
                ) : (
                  <>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Etiket A: Dummy</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Etiket B: Dummy</p>
                  </>
                )}
              </div>
            ))}
          </div>
        ))}
      </div> */}
    </div>
  );
};

export default Statistic;