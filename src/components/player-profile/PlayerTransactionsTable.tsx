"use client"
import React, { useEffect, useRef, useState } from 'react'
import { usePlayerTransactions } from '../hooks/usePlayerTransactions';
import { PlayerTransactionFilter } from '../constants/types';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../ui/table';
import { formatDateToDDMMYYYYHHMMSS } from '@/utils/utils';
import DateRangePickerWithTime from './DateRangePickerWithTime';

const PlayerTransactionsTable = ({ playerId }: { playerId: string }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  // ✅ Set default date range to today
  const today = new Date();
  const startOfToday = new Date(today.setHours(0, 0, 0, 0)).toISOString();
  const endOfToday = new Date(today.setHours(23, 59, 59, 999)).toISOString();

  const [dateFrom, setDateFrom] = useState<string | undefined>(startOfToday);
  const [dateTo, setDateTo] = useState<string | undefined>(endOfToday);
  const [isDateModified, setIsDateModified] = useState(true);

  const [type, setType] = useState<string | undefined>(undefined);
  const [eventType, setEventType] = useState<string | undefined>(undefined);
  const [isFilterOn, setIsFilterOn] = useState(false);

  const { transactions, loading, error, pagination, filter, setFilter } = usePlayerTransactions({
    pageNumber: currentPage,
    pageSize: rowsPerPage,
    playerId,
    timeStampFrom: dateFrom, // ✅ default today
    timeStampTo: dateTo      // ✅ default today
  });

  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setCurrentPage(newPage);
      setFilter({ ...filter, pageNumber: newPage });
    }
  };

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRowsPerPage = Number(e.target.value);
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1);
    setFilter({ ...filter, pageSize: newRowsPerPage, pageNumber: 1 });
  };

  const handleSort = (column: string) => {
    setFilter(prev => ({
      ...prev,
      sortBy: column,
      sortDirection: prev.sortBy === column
        ? prev.sortDirection === 'asc' ? 'desc' : 'asc'
        : 'asc',
      pageNumber: 1,
    }));
  };

  const handleRefetch = () => {
    setCurrentPage(1);

    const newFilter: PlayerTransactionFilter = {
      pageNumber: 1,
      pageSize: rowsPerPage,
      playerId,
      type: type || undefined,
      eventType: eventType || undefined,
      timeStampFrom: dateFrom,
      timeStampTo: dateTo,
    };

    const isAnyFilterActive =
      Boolean(type) ||
      Boolean(eventType) ||
      isDateModified

    setIsFilterOn(isAnyFilterActive);
    setFilter(newFilter);
  };

  // ✅ Apply default filter on mount
  useEffect(() => {
    handleRefetch();
  }, []);

  const removeFilter = () => {
    setType('');
    setEventType('');
    setDateFrom(startOfToday);
    setDateTo(endOfToday);
    setIsDateModified(true);

    setCurrentPage(1);
    const defaultFilter = {
      pageNumber: 1,
      pageSize: rowsPerPage,
      playerId,
      timeStampFrom: startOfToday,
      timeStampTo: endOfToday
    };
    setFilter(defaultFilter);
    setIsFilterOn(false);
  };

  const SkeletonRow = ({ columns }: { columns: number }) => (
    <TableRow>
      {Array.from({ length: columns }).map((_, index) => (
        <TableCell key={index} className="px-5 py-4">
          <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
        </TableCell>
      ))}
    </TableRow>
  );

  if (error) {
    console.log(error)
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="relative" ref={dropdownRef}>
          {/* Toggle button */}
          <button
            onClick={() => setOpen(!open)}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-tl-md hover:bg-blue-700 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18M3 12h18M3 20h18" />
            </svg>
            Filters
          </button>
    
          {/* Dropdown panel */}
          {open && (
  <div
    className="absolute mt-2 w-full md:w-[80vw] max-w-4xl right-0 
               bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 
               rounded-lg shadow-lg z-50 p-4"
  >
    {/* Filter row */}
    <div className="flex flex-col md:flex-row gap-4 mb-4">
      {/* Direction Select */}
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="flex-1 min-w-[200px] rounded-md border border-gray-300 dark:border-gray-600 
                  bg-white dark:bg-gray-700 text-sm text-gray-700 dark:text-gray-200 
                  px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Select Direction</option>
        <option value="Inc">Üst</option>
        <option value="Dec">Alt</option>
      </select>

      {/* Event Type Select */}
      <select
        value={eventType}
        onChange={(e) => setEventType(e.target.value)}
        className="flex-1 min-w-[200px] rounded-md border border-gray-300 dark:border-gray-600 
                  bg-white dark:bg-gray-700 text-sm text-gray-700 dark:text-gray-200 
                  px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Select Event</option>
        <option value="Deposit">Deposit</option>
        <option value="Withdrawal">Withdrawal</option>
        <option value="Withdrawal Cancel">Withdrawal Cancel</option>
        <option value="Bonus">Bonus</option>
        <option value="Win">Win</option>
        {/* <option value="Lose">Lose</option> */}
        <option value="BetPlacing">Bet</option>
        <option value="BetPayedAbort">BetPayedAbort</option>
        <option value="BetPlacingAbort">BetPlacingAbort</option>
        <option value="PromoWin">PromoWin</option>
        <option value="DropAndWin">DropAndWin</option>
        <option value="FreeBet">FreeBet</option>
      </select>

      {/* Date Picker */}
      <div className="flex-1 min-w-[250px]">
        <DateRangePickerWithTime
          onChange={({ MinCreatedLocal, MaxCreatedLocal }) => {
            setDateFrom(MinCreatedLocal)
            setDateTo(MaxCreatedLocal)
          }}
          onModifiedChange={(modified) => setIsDateModified(modified)}
          isChanged={isDateModified}
        />
      </div>
    </div>

    {/* Footer Buttons */}
    <div className="flex justify-end gap-3">
      {isFilterOn && (
        <button
          onClick={removeFilter}
          className="px-4 py-2 bg-red-600 text-white text-sm rounded 
                    hover:bg-red-700 transition-colors"
        >
          Filtreleri Kaldır
        </button>
      )}
      <button
        onClick={() => {
          handleRefetch()
          setOpen(false)
        }}
        className="px-4 py-2 bg-blue-600 text-white text-sm rounded 
                  hover:bg-blue-700 transition-colors"
      >
        Filtreleri Uygula
      </button>
    </div>
  </div>
)}



        </div>

      <div className="w-full overflow-x-auto">
        <div className="min-w-[1102px] min-h-[600px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell 
                  isHeader 
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer" 
                  onClick={() => handleSort("transactionId")}
                >
                  ID
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Tür
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  İşlem Tipi
                </TableCell>
                <TableCell 
                  isHeader 
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer" 
                  onClick={() => handleSort("amount")}
                >
                  İşlem Miktar
                </TableCell>
                <TableCell 
                  isHeader 
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer" 
                  onClick={() => handleSort("amount")}
                >
                  Yeni Bakiye
                </TableCell>
                <TableCell 
                  isHeader 
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer" 
                >
                  İsim
                </TableCell>
                <TableCell 
                  isHeader 
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer" 
                  onClick={() => handleSort("status")}
                >
                  Durum
                </TableCell>
                  <TableCell 
                    isHeader 
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer" 
                    onClick={() => handleSort("timestamp")}
                  >
                    Zaman
                  </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className={`divide-y divide-gray-100 dark:divide-white/[0.05] transition-opacity duration-300 ${loading ? 'opacity-50' : 'opacity-100'}`}>
              {loading ? (
                <>
                  {Array.from({ length: rowsPerPage }).map((_, i) => (
                    <SkeletonRow key={i} columns={8} />
                  ))}
                </>
              ) : (
                transactions.map((t) => (
                  <TableRow key={t.transactionId}>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <div>
                          <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                            {t.transactionId}
                          </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-700 text-start text-theme-sm dark:text-gray-400">
  {t.type === "Inc" ? (
    <span className="text-green-600">Üst</span>
  ) : (
    <span className="text-red-600">Alt</span>
  )}
</TableCell>

                    <TableCell className="px-4 py-3 text-gray-900 text-start text-theme-sm dark:text-gray-400">
                      {t.eventType}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-900 text-start text-theme-sm dark:text-gray-400">
                        ₺{t.amount.toLocaleString()}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-900 text-start text-theme-sm dark:text-gray-400">
                        ₺{t.balanceAfter.toLocaleString()}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {t.name}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {t.status}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {formatDateToDDMMYYYYHHMMSS(t.timestamp)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

{/* Pagination Controls */}
<div className="flex items-center justify-end w-full px-4 py-2 space-x-3 border-t border-[#c8c9cb]">
  <div className="text-sm text-gray-700 dark:text-gray-300 px-2 border-r border-[#c8c9cb]">
          Showing {transactions.length} of {pagination.totalCount} transactions
        </div>
    <div className="flex items-center gap-2">
          <label htmlFor="rowsPerPage" className="text-sm text-gray-700 dark:text-gray-300">
            Rows per page:
          </label>
          <select
            id="rowsPerPage"
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
            className="text-sm rounded-md border border-gray-300 px-2 py-1 dark:bg-gray-700 dark:text-white "
          >
            {[25, 50, 75, 100].map((val) => (
              <option key={val} value={val}>{val}</option>
            ))}
          </select>
        </div>
      <span className="text-sm text-gray-700 dark:text-gray-300 px-2 border-l border-[#c8c9cb]">
    Page {currentPage} of {pagination.totalPages}
  </span>

  {/* Buttons */}
  <div className="flex items-center space-x-2">
    <button
      onClick={() => handlePageChange(currentPage - 1)}
      disabled={currentPage === 1}
      className="text-sm px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 dark:text-white disabled:opacity-50"
    >
      Previous
    </button>
    <button
      onClick={() => handlePageChange(currentPage + 1)}
      disabled={currentPage === pagination.totalPages}
      className="text-sm px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 dark:text-white disabled:opacity-50"
    >
      Next
    </button>
    </div>
  </div>
</div>
    
  )
}

export default PlayerTransactionsTable