// components/Statistic.tsx

import React from "react";

const Statistic = () => {
  return (
<div className="container mx-auto px-4">
<div className="container mx-auto px-4 mt-15 mb-10">
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-2">

<div className="bg-white dark:bg-gray-dark rounded-md p-4 border border-gray-300 dark:border-gray-700 min-h-[100px] flex flex-col">
      <h4 className="font-semibold text-sm dark:text-gray-200 mb-2">Total Deposit</h4>
      <p className="text-lg text-gray-600 dark:text-gray-400 mt-auto">₺15,000.00</p>
    </div>

    <div className="bg-white dark:bg-gray-dark rounded-md p-4 border border-gray-300 dark:border-gray-700 min-h-[100px] flex flex-col">
      <h4 className="font-semibold text-sm dark:text-gray-200 mb-2">Total Withdrawal</h4>
      <p className="text-lg text-gray-600 dark:text-gray-400 mt-auto">₺5,000.00</p>
    </div>

    <div className="bg-white dark:bg-gray-dark rounded-md p-4 border border-gray-300 dark:border-gray-700 min-h-[100px] flex flex-col">
      <h4 className="font-semibold text-sm dark:text-gray-200 mb-2">Net</h4>
      <p className="text-lg text-gray-600 dark:text-gray-400 mt-auto"> ₺10,000.00</p>
    </div>
    </div>
    </div>
  <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
    Financial Statistics
  </h2>
  <h4 className="text-md font-semibold text-gray-600 dark:text-white mb-3">
    Deposit Statistics
  </h4>
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-2">
    <div className="bg-white dark:bg-gray-dark rounded-md p-4 border border-gray-300 dark:border-gray-700 min-h-[100px] flex flex-col">
      <h4 className="font-semibold text-sm dark:text-gray-200 mb-2">First Deposit Date</h4>
      <p className="text-lg text-gray-600 dark:text-gray-400 mt-auto">01.01.1901</p>
    </div>

    <div className="bg-white dark:bg-gray-dark rounded-md p-4 border border-gray-300 dark:border-gray-700 min-h-[100px] flex flex-col">
      <h4 className="font-semibold text-sm dark:text-gray-200 mb-2">First Deposit Amount</h4>
      <p className="text-lg text-gray-600 dark:text-gray-400 mt-auto">₺500.00</p>
    </div>

    <div className="bg-white dark:bg-gray-dark rounded-md p-4 border border-gray-300 dark:border-gray-700 min-h-[100px] flex flex-col">
      <h4 className="font-semibold text-sm dark:text-gray-200 mb-2">Last Deposit Date</h4>
      <p className="text-lg text-gray-600 dark:text-gray-400 mt-auto">05.05.2025</p>
    </div>

    <div className="bg-white dark:bg-gray-dark rounded-md p-4 border border-gray-300 dark:border-gray-700 min-h-[100px] flex flex-col">
      <h4 className="font-semibold text-sm dark:text-gray-200 mb-2">Last Deposit Amount</h4>
      <p className="text-lg text-gray-600 dark:text-gray-400 mt-auto">₺1,200.00</p>
    </div>

    <div className="bg-white dark:bg-gray-dark rounded-md p-4 border border-gray-300 dark:border-gray-700 min-h-[100px] flex flex-col">
      <h4 className="font-semibold text-sm dark:text-gray-200 mb-2">Total Deposit</h4>
      <p className="text-lg text-gray-600 dark:text-gray-400 mt-auto">₺15,000.00</p>
    </div>

    <div className="bg-white dark:bg-gray-dark rounded-md p-4 border border-gray-300 dark:border-gray-700 min-h-[100px] flex flex-col">
      <h4 className="font-semibold text-sm dark:text-gray-200 mb-2">Total Deposit Count</h4>
      <p className="text-lg text-gray-600 dark:text-gray-400 mt-auto">35</p>
    </div>

    <div className="bg-white dark:bg-gray-dark rounded-md p-4 border border-gray-300 dark:border-gray-700 min-h-[100px] flex flex-col">
      <h4 className="font-semibold text-sm dark:text-gray-200 mb-2">Average Deposit</h4>
      <p className="text-lg text-gray-600 dark:text-gray-400 mt-auto">₺428.57</p>
    </div>
  </div>

  <div className="mt-8">
    <h4 className="text-md font-semibold text-gray-600 dark:text-white mb-3">
      Withdrawal Statistics
    </h4>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-2">
      <div className="bg-white dark:bg-gray-dark rounded-md p-4 border border-gray-300 dark:border-gray-700 min-h-[110px] flex flex-col">
        <h4 className="font-semibold text-sm dark:text-gray-200">First Withdrawal Date</h4>
        <p className="text-lg text-gray-600 dark:text-gray-400 mt-auto">01.01.1901</p>
      </div>

      <div className="bg-white dark:bg-gray-dark rounded-md p-4 border border-gray-300 dark:border-gray-700 min-h-[100px] flex flex-col">
        <h4 className="font-semibold text-sm dark:text-gray-200">First Withdrawal Amount</h4>
        <p className="text-lg text-gray-600 dark:text-gray-400 mt-auto">₺500.00</p>
      </div>

      <div className="bg-white dark:bg-gray-dark rounded-md p-4 border border-gray-300 dark:border-gray-700 min-h-[100px] flex flex-col">
        <h4 className="font-semibold text-sm dark:text-gray-200">Last Withdrawal Date</h4>
        <p className="text-lg text-gray-600 dark:text-gray-400 mt-auto">05.05.2025</p>
      </div>

      <div className="bg-white dark:bg-gray-dark rounded-md p-4 border border-gray-300 dark:border-gray-700 min-h-[100px] flex flex-col">
        <h4 className="font-semibold text-sm dark:text-gray-200">Last Withdrawal Amount</h4>
        <p className="text-lg text-gray-600 dark:text-gray-400 mt-auto">₺2,100.00</p>
      </div>

      <div className="bg-white dark:bg-gray-dark rounded-md p-4 border border-gray-300 dark:border-gray-700 min-h-[100px] flex flex-col">
        <h4 className="font-semibold text-sm dark:text-gray-200">Total Withdrawal</h4>
        <p className="text-lg text-gray-600 dark:text-gray-400 mt-auto">₺5,450.00</p>
      </div>

      <div className="bg-white dark:bg-gray-dark rounded-md p-4 border border-gray-300 dark:border-gray-700 min-h-[100px] flex flex-col">
        <h4 className="font-semibold text-sm dark:text-gray-200">Total Withdrawal Count</h4>
        <p className="text-lg text-gray-600 dark:text-gray-400 mt-auto">12</p>
      </div>

      <div className="bg-white dark:bg-gray-dark rounded-md p-4 border border-gray-300 dark:border-gray-700 min-h-[100px] flex flex-col">
        <h4 className="font-semibold text-sm dark:text-gray-200">Average Withdrawal</h4>
        <p className="text-lg text-gray-600 dark:text-gray-400 mt-auto">₺121.12</p>
      </div>
    </div>
  </div>

  <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 mt-6">
    Gaming Statistics
  </h2>
  <h4 className="text-md font-semibold text-gray-600 dark:text-white mb-3 mt-6">
  Casino Statistics
  </h4>
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-2">
    <div className="bg-white dark:bg-gray-dark rounded-md p-4 border border-gray-300 dark:border-gray-700 min-h-[100px] flex flex-col">
      <h4 className="font-semibold text-sm dark:text-gray-200">Total Casino Bet</h4>
      <p className="text-lg text-gray-600 dark:text-gray-400 mt-auto">₺12,000.00</p>
    </div>

    <div className="bg-white dark:bg-gray-dark rounded-md p-4 border border-gray-300 dark:border-gray-700 min-h-[100px] flex flex-col">
      <h4 className="font-semibold text-sm dark:text-gray-200">Total Casino Winning</h4>
      <p className="text-lg text-gray-600 dark:text-gray-400 mt-auto">₺8,500.00</p>
    </div>

    <div className="bg-white dark:bg-gray-dark rounded-md p-4 border border-gray-300 dark:border-gray-700 min-h-[100px] flex flex-col">
      <h4 className="font-semibold text-sm dark:text-gray-200">Casino Net Profit</h4>
      <p className="text-lg text-gray-600 dark:text-gray-400 mt-auto">₺3,500.00</p>
    </div>

    <div className="bg-white dark:bg-gray-dark rounded-md p-4 border border-gray-300 dark:border-gray-700 min-h-[100px] flex flex-col">
      <h4 className="font-semibold text-sm dark:text-gray-200">Casino Profit %</h4>
      <p className="text-lg text-gray-600 dark:text-gray-400 mt-auto">29.17%</p>
    </div>

    <div className="bg-white dark:bg-gray-dark rounded-md p-4 border border-gray-300 dark:border-gray-700 min-h-[100px] flex flex-col">
      <h4 className="font-semibold text-sm dark:text-gray-200">Last Casino Bet Date</h4>
      <p className="text-lg text-gray-600 dark:text-gray-400 mt-auto">06.08.2025</p>
    </div>

    <div className="bg-white dark:bg-gray-dark rounded-md p-4 border border-gray-300 dark:border-gray-700 min-h-[100px] flex flex-col">
      <h4 className="font-semibold text-sm dark:text-gray-200">First Casino Bet Date</h4>
      <p className="text-lg text-gray-600 dark:text-gray-400 mt-auto">01.01.2020</p>
    </div>
    <div className="bg-white dark:bg-gray-dark rounded-md p-4 border border-gray-300 dark:border-gray-700 min-h-[100px] flex flex-col">
      <h4 className="font-semibold text-sm dark:text-gray-200">First Casino Bet Date</h4>
      <p className="text-lg text-gray-600 dark:text-gray-400 mt-auto">01.01.2020</p>
    </div>
  </div>

<h4 className="text-md font-semibold text-gray-600 dark:text-white mb-3 mt-6">
    Sport Statistics
  </h4>
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-2">
    <div className="bg-white dark:bg-gray-dark rounded-md p-4 border border-gray-300 dark:border-gray-700 min-h-[100px] flex flex-col">
      <h4 className="font-semibold text-sm dark:text-gray-200">Total Sport Bet</h4>
      <p className="text-lg text-gray-600 dark:text-gray-400 mt-auto">₺20,000.00</p>
    </div>

    <div className="bg-white dark:bg-gray-dark rounded-md p-4 border border-gray-300 dark:border-gray-700 min-h-[100px] flex flex-col">
      <h4 className="font-semibold text-sm dark:text-gray-200">Total Sport Winning</h4>
      <p className="text-lg text-gray-600 dark:text-gray-400 mt-auto">₺14,000.00</p>
    </div>

    <div className="bg-white dark:bg-gray-dark rounded-md p-4 border border-gray-300 dark:border-gray-700 min-h-[100px] flex flex-col">
      <h4 className="font-semibold text-sm dark:text-gray-200">Sport Net Profit</h4>
      <p className="text-lg text-gray-600 dark:text-gray-400 mt-auto">₺6,000.00</p>
    </div>

    <div className="bg-white dark:bg-gray-dark rounded-md p-4 border border-gray-300 dark:border-gray-700 min-h-[100px] flex flex-col">
      <h4 className="font-semibold text-sm dark:text-gray-200">Sport Profit %</h4>
      <p className="text-lg text-gray-600 dark:text-gray-400 mt-auto">30%</p>
    </div>

    <div className="bg-white dark:bg-gray-dark rounded-md p-4 border border-gray-300 dark:border-gray-700 min-h-[100px] flex flex-col">
      <h4 className="font-semibold text-sm dark:text-gray-200">Last Sport Bet Date</h4>
      <p className="text-lg text-gray-600 dark:text-gray-400 mt-auto">07.08.2025</p>
    </div>

    <div className="bg-white dark:bg-gray-dark rounded-md p-4 border border-gray-300 dark:border-gray-700 min-h-[100px] flex flex-col">
      <h4 className="font-semibold text-sm dark:text-gray-200">First Sport Bet Date</h4>
      <p className="text-lg text-gray-600 dark:text-gray-400 mt-auto">01.01.2021</p>
    </div>

    <div className="bg-white dark:bg-gray-dark rounded-md p-4 border border-gray-300 dark:border-gray-700 min-h-[100px] flex flex-col">
      <h4 className="font-semibold text-sm dark:text-gray-200">First Sport Bet Date</h4>
      <p className="text-lg text-gray-600 dark:text-gray-400 mt-auto">01.01.2021</p>
    </div>
</div>
<div className="container mx-auto px-4 mt-10">
{/* Row 1: Two Boxes */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
  {[1, 2].map((num) => (
    <div
      key={num}
      className="relative bg-white dark:bg-gray-dark rounded-md p-4 border border-gray-300 dark:border-gray-700"
    >
      {/* Tooltip */}
      <div className="absolute top-2 right-2 group cursor-pointer">
        <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 text-xs text-white rounded-full flex items-center justify-center">
          ?
        </div>
        <div className="absolute z-10 hidden group-hover:block bg-black text-white text-xs rounded py-1 px-2 mt-1 right-0 w-48">
          Bu kutu hakkında bilgi metni burada olacak.
        </div>
      </div>

      <h3 className="font-semibold text-sm dark:text-gray-200 mb-2">
        Başlık {num}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400">Etiket 1: Dummy Veri</p>
      <p className="text-sm text-gray-500 dark:text-gray-400">Etiket 2: Dummy Veri</p>
    </div>
  ))}
</div>

{/* Row 2: Three Boxes */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
  {Array.from({ length: 3 }).map((_, i) => (
    <div
      key={i}
      className="bg-white dark:bg-gray-dark rounded-md p-4 border border-gray-300 dark:border-gray-700"
    >
      <h3 className="font-semibold text-sm dark:text-gray-200 mb-2">
        2. Satır Başlık
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400">Etiket A: Dummy</p>
      <p className="text-sm text-gray-500 dark:text-gray-400">Etiket B: Dummy</p>
    </div>
  ))}
</div>

{/* Row 3: Two Boxes */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
  {Array.from({ length: 2 }).map((_, i) => (
    <div
      key={i}
      className="bg-white dark:bg-gray-dark rounded-md p-4 border border-gray-300 dark:border-gray-700"
    >
      <h3 className="font-semibold text-sm dark:text-gray-200 mb-2">
        3. Satır Başlık {i + 1}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400">Etiket X: Dummy</p>
      <p className="text-sm text-gray-500 dark:text-gray-400">Etiket Y: Dummy</p>
    </div>
  ))}
</div>
</div>
</div>
 );
};

export default Statistic;
