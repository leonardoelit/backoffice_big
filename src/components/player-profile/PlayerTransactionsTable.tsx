"use client"
import React, { useEffect, useRef, useState } from 'react'
import { usePlayerTransactions } from '../hooks/usePlayerTransactions';
import { PlayerTransactionFilter } from '../constants/types';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../ui/table';
import { formatDateToDDMMYYYYHHMMSS } from '@/utils/utils';
import DateRangePickerWithTime from './DateRangePickerWithTime';
import { managePlayerBalance } from '../lib/api';
import { showToast } from '@/utils/toastUtil';
import { useAuth } from '@/context/AuthContext';

const PlayerTransactionsTable = ({ playerId }: { playerId: string }) => {
  const { games } = useAuth();
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
  const [eventType, setEventType] = useState<string[]>([]);
  const [isFilterOn, setIsFilterOn] = useState(false);

  const [showPopup, setShowPopup] = useState(false);
  const [formData, setFormData] = useState<{
    direction: string;
    playerId: string;
    amount: number | '';
  }>({
    direction: 'Inc',
    playerId: playerId,
    amount: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showPopup && popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setShowPopup(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showPopup]);

  const { transactions, loading, error, pagination, filter, setFilter } = usePlayerTransactions({
    pageNumber: currentPage,
    pageSize: rowsPerPage,
    playerId,
    timeStampFrom: dateFrom, // ✅ default today
    timeStampTo: dateTo      // ✅ default today
  });

  const [open, setOpen] = useState(false)
  const [openSelect, setOpenSelect] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const selectRef = useRef<HTMLDivElement>(null)

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
      if (selectRef.current && !selectRef.current.contains(e.target as Node)) {
        setOpenSelect(false)
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
       eventTypes: eventType?.length ? eventType : undefined,
      timeStampFrom: dateFrom,
      timeStampTo: dateTo,
    };

    const isAnyFilterActive =
      Boolean(type) ||
      Boolean(eventType.length > 0) ||
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
    setEventType([]);
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

  const handleManagePlayerBalance = async () => {
  if (formData.amount === '' || formData.amount <= 0) {
    alert('Please enter a valid amount');
    return;
  }

  setIsSubmitting(true);

  try {
    const res = await managePlayerBalance({
      direction: formData.direction,
      playerId: playerId,
      amount: Number(formData.amount),
    });

    if (res.isSuccess) {
      showToast("Oyuncunun bakiyesi güncellendi", "success")
      setShowPopup(false);
      handleRefetch(); // refresh the table
    } else {
      showToast(res.message || 'Failed to update balance', "error")
    }
  } catch (err) {
    console.error(err);
    showToast("Beklenmeyen error, lütfen bekleyiniz", "error")
  }

  setIsSubmitting(false);
};

const providerName = (gameId: number) => {
    const game = games.find(g => g.id === gameId);
    return game ? `${game.name} - ${game.providerName}` : gameId;
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
    <div className="space-y-4">
    {/* Top-right action buttons OUTSIDE the table */}
    <div className="flex justify-end gap-2">
      {/* Add button */}
      <button
        onClick={() => {
          setShowPopup(true);
          setFormData({
            direction: "Inc",
            playerId: playerId,
            amount: "",
          });
        }}
        className="p-2 bg-green-500 text-sm text-white rounded hover:bg-blue-600 flex items-center justify-center"
      >
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 12H20M12 4V20"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Add/Remove Balance
      </button>

      {/* Refresh button */}
      <button
        onClick={handleRefetch}
        title="Refresh Table"
        className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center justify-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 4v5h.582M20 20v-5h-.581M4.582 9a8 8 0 0111.836-1.414M19.418 15a8 8 0 01-11.836 1.414"
          />
        </svg>
      </button>
    </div>

    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      
      <div className="-mt-2 relative flex items-center justify-between" ref={dropdownRef}>
  {/* Filter button */}
  <button
    onClick={() => setOpen(!open)}
    className="px-4 py-2 bg-blue-600 mt-[8px] text-white text-sm rounded-tl-md hover:bg-blue-700 flex items-center gap-2"
  >
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18M3 12h18M3 20h18" />
    </svg>
    Filters
  </button>
          {/* Dropdown panel */}
          {open && (
  <div
  className="absolute mt-52 w-full md:w-[80vw] max-w-4xl right-0 
  bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 
  rounded-lg shadow-lg z-[99999999] p-4"

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

      {/* Event Type Multi-Select */}
      <div className="relative flex-1 min-w-[200px]" ref={selectRef}>
        <button
          type="button"
          onClick={() => setOpenSelect(!openSelect)}
          className="w-full text-left px-3 py-2 border rounded-md 
                    bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600
                    text-sm text-gray-700 dark:text-gray-200
                    flex items-center justify-between
                    h-10"  // ✅ enforce same height as other inputs
        >
          <span className="truncate">
            {eventType.length > 0 ? eventType.join(", ") : "Select Event"}
          </span>
          <svg
            className="w-4 h-4 ml-2 text-gray-500 dark:text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {openSelect && (
          <div className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto">
            {["Deposit", "Withdrawal Request", "Withdrawal","Withdrawal Cancel","Bonus","Win","BetPlacing","BetPayedAbort","BetPlacingAbort","PromoWin","DropAndWin","FreeBet"].map((event) => (
              <label
                key={event}
                className="flex items-center px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 text-sm"
              >
                <input
                  type="checkbox"
                  className="mr-2 h-4 w-4"
                  checked={eventType.includes(event)}
                  onChange={() => {
                    if (eventType.includes(event)) {
                      setEventType(eventType.filter(e => e !== event));
                    } else {
                      setEventType([...eventType, event]);
                    }
                  }}
                />
                {event}
              </label>
            ))}
          </div>
        )}
      </div>




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

        {showPopup && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-[9999999]">
            <div
              ref={popupRef}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-96"
            >
              <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
                Manage Player Balance
              </h2>

              {/* Direction */}
              <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Direction</label>
              <select
                value={formData.direction}
                onChange={e => setFormData({ ...formData, direction: e.target.value })}
                className="w-full mb-3 rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Inc">Inc / Add</option>
                <option value="Dec">Dec / Subtract</option>
              </select>

              {/* Amount */}
              <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Amount</label>
              <input
                type="number"
                value={formData.amount}
                onChange={e => setFormData({ ...formData, amount: parseInt(e.target.value) || 0 })}
                className="w-full mb-4 rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              {/* Buttons */}
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowPopup(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleManagePlayerBalance}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-800"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}


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
                      {/^\d+$/.test(t.name) 
                        ? providerName(Number(t.name)) 
                        : t.name}
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
</div>
  )
}

export default PlayerTransactionsTable