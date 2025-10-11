"use client"
import React, { useEffect, useRef, useState } from 'react'
import { useFinancialTransactions } from '../hooks/useFinancialTransactions';
import { PlayerFinancialFilter } from '../constants/types';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../ui/table';
import { formatDateToDDMMYYYYHHMMSS } from '@/utils/utils';
import DateRangePickerWithTime from '../player-profile/DateRangePickerWithTime';
import { cancelOrValidateWithdrawal, managePendingFinancialRequest } from '../lib/api';
import { showToast } from '@/utils/toastUtil';
import ConfirmationModal from './ConfirmationModal';
import Link from 'next/link';
import NoteCell from './NoteCell';

const BasicTablePendingWithdrawals = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const today = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    const startOfToday = `${today.getFullYear()}-${pad(today.getMonth()+1)}-${pad(today.getDate())} 00:00:00`;
    const endOfToday = `${today.getFullYear()}-${pad(today.getMonth()+1)}-${pad(today.getDate())} 23:59:59`;
    const [dateFrom, setDateFrom] = useState<string | undefined>(startOfToday);
    const [dateTo, setDateTo] = useState<string | undefined>(endOfToday);
    const [isDateModified, setIsDateModified] = useState(true)
    const [playerFullName, setPlayerFullName] = useState<string | undefined>(undefined)
    const [playerId, setPlayerId] = useState<string | undefined>(undefined)
    const [amountFrom, setAmountFrom] = useState<string | undefined>(undefined)
    const [amountTo, setAmountTo] = useState<string | undefined>(undefined)
    const [status, setStatus] = useState<string | undefined>(undefined)
    const [paymentName, setPaymentName] = useState<string | undefined>(undefined)
    const [accountNumber, setAccountNumber] = useState<string | undefined>(undefined)
    const [cryptoType, setCryptoType] = useState<string | undefined>(undefined)
    const [playerUsername, setPlayerUsername] = useState<string | undefined>(undefined)
     const [isAction, setIsAction] = useState(false)

    const [modalState, setModalState] = useState<{
    isOpen: boolean;
    id: number | null;
    playerId: string | null;
    action: 'accept' | 'reject' | null;
  }>({
    isOpen: false,
    id: null,
    playerId: null,
    action: null
  });

    const [modalStateForCancel, setModalStateForCancel] = useState<{
    isOpen: boolean;
    id: number | null;
    playerId: string | null;
    action: 'onay' | 'red' | null;
  }>({
    isOpen: false,
    id: null,
    playerId: null,
    action: null
  });

    const [isSendingResponse, setIsSendingResponse] = useState(false);


    const [isFilterOn, setIsFilterOn] = useState(true);

    const { financialTransactions, loading, error, pagination, filter, setFilter } = useFinancialTransactions(
        {
          pageNumber: currentPage,
          pageSize: rowsPerPage,
          typeName: 'withdraw',
          timeStampFrom: dateFrom,
          timeStampTo: dateTo
        }
      );

    const [open, setOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)
    
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
          pageNumber: 1, // Reset to first page when sorting
        }));
      };

    const handleRefetch = () => {
      setCurrentPage(1);
      
      const newFilter:PlayerFinancialFilter  = {
        pageNumber: 1,
        pageSize: rowsPerPage,
        playerId: playerId || undefined,
        typeName: 'withdraw',
        accountNumber: accountNumber || undefined,
        amountFrom: amountFrom || undefined,
        amountTo: amountTo || undefined,
        cryptoType: cryptoType || undefined,
        paymentName: paymentName || undefined,
        playerFullName: playerFullName || undefined,
        playerUsername: playerUsername || undefined,
        status: status || undefined
      };
    
      // Only include dates that were modified
      if (isDateModified) {
        newFilter.timeStampFrom = dateFrom;
        newFilter.timeStampTo = dateTo;
      }
    
      const isAnyFilterActive = 
        Boolean(playerId) ||
        Boolean(playerFullName) ||
        Boolean(accountNumber) ||
        Boolean(amountFrom) ||
        Boolean(amountTo) ||
        Boolean(cryptoType) ||
        Boolean(paymentName) ||
        Boolean(playerUsername) ||
        Boolean(status) ||
        isDateModified
    
      setIsFilterOn(isAnyFilterActive);
    
      setFilter(newFilter);
    };
    
    const removeFilter = () => {
      // Reset all input states
      setPlayerId(undefined);
      setPlayerUsername(undefined)
      setPlayerFullName(undefined)
      setAmountFrom(undefined)
      setAmountTo(undefined)
      setPaymentName(undefined)
      setCryptoType(undefined)
      setAccountNumber(undefined)
      setDateFrom(undefined)
      setDateTo(undefined)
      setStatus(undefined)
      setIsDateModified(false)
      
      // Reset to first page
      setCurrentPage(1);
      
      // Create default filter with only contentType-specific filters
      const defaultFilter = {
        pageNumber: 1,
        pageSize: rowsPerPage,
        typeName: 'withdraw'
      };
      
      // Apply the default filter
      setFilter(defaultFilter);
      setIsFilterOn(false);
    };

    // Modify manageRequest to open confirmation modal
  const handleActionClick = (id: number, playerId: string, action: 'accept' | 'reject') => {
    setModalState({
      isOpen: true,
      id,
      playerId,
      action
    });
  };

  // Create function to handle confirmed action
  const handleConfirmedAction = async () => {
    if (modalState.id && modalState.playerId && modalState.action) {
      setIsSendingResponse(true);
      const result = await managePendingFinancialRequest(
        modalState.id, 
        modalState.playerId, 
        'withdraw', 
        modalState.action === 'accept'
      );
      
      if (result.hasError) {
        showToast(result.description, "error");
      } else {
        showToast(result.description, "success");
        handleRefetch();
      }
      
      setIsSendingResponse(false);
      setModalState({ isOpen: false, id: null, playerId: null, action: null });
    }
  };

  const handleCancelClick = (id: number, playerId: string, action: 'onay' | 'red') => {
    setModalStateForCancel({
      isOpen: true,
      id,
      playerId,
      action
    });
  };

    const handelCancelAction = async () => {
      if(modalStateForCancel.id === null || modalStateForCancel.playerId === null || modalStateForCancel.action == null){
        showToast("İşlem bilgisi alırken hata lütfen tekrar deneyiniz", "error")
        return;
      }

      setIsAction(true)

      const res = await cancelOrValidateWithdrawal({ id: modalStateForCancel.id, playerId: modalStateForCancel.playerId, result: modalStateForCancel.action === "onay" ? true : false  })

      if(res.hasError){
        showToast(res.description, "error")
      }else{
        showToast(res.description, "success")
        handleRefetch();
      }
      setIsAction(false)
    } 

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
      <ConfirmationModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, id: null, playerId: null, action: null })}
        onConfirm={handleConfirmedAction}
        action={modalState.action || 'accept'}
      />
      <ConfirmationModal
            isOpen={modalStateForCancel.isOpen}
            onClose={() => setModalStateForCancel({ isOpen: false, id: null, playerId: null, action: null })}
            onConfirm={handelCancelAction}
            action={modalStateForCancel.action || 'accept'}
          />
      <div className='relative flex flex-row items-center justify-between' ref={dropdownRef}>
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
            className="absolute w-full md:w-[80vw] max-w-4xl right-0 top-0 
                    bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 
                    rounded-lg shadow-lg z-50 p-4"
        >
            {/* Filter row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Player ID */}
            <input
                type="text"
                value={playerId || ""}
                onChange={(e) => setPlayerId(e.target.value)}
                placeholder="Player ID"
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 
                        bg-white dark:bg-gray-700 text-sm text-gray-700 dark:text-gray-200 
                        px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Username */}
            <input
                type="text"
                value={playerUsername || ""}
                onChange={(e) => setPlayerUsername(e.target.value)}
                placeholder="Username"
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 
                        bg-white dark:bg-gray-700 text-sm text-gray-700 dark:text-gray-200 
                        px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Fullname */}
            <input
                type="text"
                value={playerFullName || ""}
                onChange={(e) => setPlayerFullName(e.target.value)}
                placeholder="Full Name"
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 
                        bg-white dark:bg-gray-700 text-sm text-gray-700 dark:text-gray-200 
                        px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            </div>

            {/* Filter row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Amount From */}
            <input
                type="number"
                value={amountFrom || ""}
                onChange={(e) => setAmountFrom(e.target.value)}
                placeholder="Amount From"
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 
                        bg-white dark:bg-gray-700 text-sm text-gray-700 dark:text-gray-200 
                        px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Amount To */}
            <input
                type="number"
                value={amountTo || ""}
                onChange={(e) => setAmountTo(e.target.value)}
                placeholder="Amount To"
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 
                        bg-white dark:bg-gray-700 text-sm text-gray-700 dark:text-gray-200 
                        px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Account Number */}
            <input
                type="text"
                value={accountNumber || ""}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="Account Number"
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 
                        bg-white dark:bg-gray-700 text-sm text-gray-700 dark:text-gray-200 
                        px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            </div>

            {/* Filter row 3 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Crypto Type */}
            <select
                value={cryptoType || ""}
                onChange={(e) => setCryptoType(e.target.value)}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 
                        bg-white dark:bg-gray-700 text-sm text-gray-700 dark:text-gray-200 
                        px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <option value="">Select Crypto Type</option>
                <option value="BTC">BTC</option>
                <option value="TRC20">TRC20</option>
            </select>

            {/* Status */}
                <select
                  value={status || ""}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 
                            bg-white dark:bg-gray-700 text-sm text-gray-700 dark:text-gray-200 
                            px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Success">Success</option>
                  <option value="Failed">Failed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>

            {/* Date Picker */}
            <div className="w-full">
        <div className="rounded-md border border-gray-300 dark:border-gray-600 
                        px-2 py-1 bg-white dark:bg-gray-700">
          <DateRangePickerWithTime
            initialStartDate={dateFrom ? new Date(dateFrom) : undefined}
            initialEndDate={dateTo ? new Date(dateTo) : undefined}
            onChange={({ MinCreatedLocal, MaxCreatedLocal }) => {
              const formatLocal = (d?: string | Date) => {
                if (!d) return undefined;
                const date = d instanceof Date ? d : new Date(d);
                if (isNaN(date.getTime())) return undefined; // handle invalid strings

                const pad = (n: number) => n.toString().padStart(2, "0");

                return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
              };
            
              setDateFrom(formatLocal(MinCreatedLocal));
              setDateTo(formatLocal(MaxCreatedLocal));
              setIsDateModified(true);
            }}
            
            onModifiedChange={(modified) => setIsDateModified(modified)}
            isChanged={isDateModified}
          />

        </div>
        </div>
    </div>

    {/* Existing Payment + Event selectors can stay above or below as you want */}

    {/* Footer Buttons */}
    <div className="flex justify-end gap-3">
      {isFilterOn && (
        <button
          onClick={removeFilter}
          className="px-4 py-2 bg-red-600 text-white text-sm rounded 
                    hover:bg-red-700 transition-colors"
        >
          Clear Filters
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
        Apply Filters
      </button>
    </div>
  </div>
        )}
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
      <div className='w-full h-[1px] bg-gray-100 dark:bg-gray-800' />

      <div className="w-full overflow-x-auto">
        <div className="min-w-[1102px] min-h-[600px] h-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell 
                  isHeader 
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer" 
                  onClick={() => handleSort("id")}
                >
                  ID
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Player ID
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Username
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Oyuncu Tam İsim
                </TableCell>
                <TableCell 
                  isHeader 
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer" 
                  onClick={() => handleSort("typeName")}
                >
                  Ödeme Yöntemi
                </TableCell>
                <TableCell 
                  isHeader 
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer" 
                  onClick={() => handleSort("amount")}
                >
                  Miktar
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Hesap Numarası
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Not
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
                  <TableCell 
                    isHeader 
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer" 
                    onClick={() => handleSort("timestamp")}
                  >
                    Aksiyonlar
                  </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className={`divide-y divide-gray-100 dark:divide-white/[0.05] transition-opacity duration-300 ${loading ? 'opacity-50' : 'opacity-100'}`}>
              {loading ? (
                <>
                  {Array.from({ length: rowsPerPage }).map((_, i) => (
                    <SkeletonRow key={i} columns={10} />
                  ))}
                </>
              ) : (
                financialTransactions.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <div>
                          <span className="cursor-pointer block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                            {t.id}
                          </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-900 text-start text-theme-sm dark:text-gray-400">
                      <Link href={`/player/${t.playerID}`}>
                        <span className="cursor-pointer block font-medium text-blue-900 hover:underline text-theme-sm dark:text-white/90">
                          {t.playerID}
                        </span>
                      </Link>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-900 text-start text-theme-sm dark:text-gray-400">
                      {t.playerUsername}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-900 text-start text-theme-sm dark:text-gray-400">
                      {t.playerFullName}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-900 text-start text-theme-sm dark:text-gray-400">
                      {t.paymentName}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-900 text-start text-theme-sm dark:text-gray-400">
                        ₺{t.amount.toLocaleString()}
                    </TableCell>
                      <TableCell className="px-4 py-3 text-start text-theme-sm">
                      <div className="flex flex-col items-start gap-1">
                        <span className="text-gray-900 dark:text-gray-300 font-medium">
                          {t.accountNumber ? t.accountNumber : '-'}
                        </span>
                        {t.cryptoType || t.bankID && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {t.cryptoType ? t.cryptoType : t.bankID}
                        </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-900 text-start text-theme-sm dark:text-gray-400">
                      {t.note ? (<NoteCell note={t.note} />) : "-"}
                    </TableCell>
                    <TableCell className={`px-4 py-3 ${t.status === 'Pending' ? 'text-yellow-600' : t.status === 'Success' ? 'text-success-600' : t.status === 'Fail' || t.status === 'Cancel' || t.status === "Rejected" ? 'text-red-600' : 'text-gray-500 dark:text-gray-400'} text-start text-theme-sm`}>
                      {t.status}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {formatDateToDDMMYYYYHHMMSS(t.createdAt)}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {t.status === "Çekim Aktarılıyor" ? (
                          <div className='flex flex-row items-start justify-start gap-2'>
                            <button disabled={isAction} onClick={() => handleCancelClick(t.id, t.playerID, "onay")} className='px-2 py-1 text-green-600 border-[1px] border-green-600 bg-white hover:green-700 hover:bg-gray-200 hover:test-semibold disabled:bg-gray-400 rounded-md'>
                                Onay
                            </button>
                            <button disabled={isAction} onClick={() => handleCancelClick(t.id, t.playerID, "red")} className='px-2 py-1 text-red-600 border-[1px] border-red-600 bg-white hover:green-700 hover:bg-gray-200 hover:test-semibold disabled:bg-gray-400 rounded-md'>
                                Red
                            </button>
                        </div>
                        ) : t.status === "Pending" ? (
                        <div className='flex flex-row items-start justify-start gap-2'>
                            <button disabled={isSendingResponse || t.status !== "Pending"} onClick={() => handleActionClick(t.id, t.playerID, 'accept')} className='px-2 py-1 text-green-600 border-[1px] border-green-600 bg-white hover:green-700 hover:bg-gray-200 hover:test-semibold disabled:bg-gray-200 dark:disabled:bg-gray-700 disabled:border-green-600/25 disabled:text-green-600/25 rounded-md'>
                                Onayla
                            </button>
                            <button disabled={isSendingResponse || t.status !== "Pending"} onClick={() => handleActionClick(t.id, t.playerID, 'reject')} className='px-2 py-1 text-red-600 border-[1px] border-red-600 bg-white hover:green-700 hover:bg-gray-200 hover:test-semibold disabled:bg-gray-200 dark:disabled:bg-gray-700 disabled:border-red-600/25 disabled:text-red-600/25 rounded-md'>
                                Reddet
                            </button>
                        </div>
                        ) : "-"}
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
          Showing {financialTransactions.length} of {pagination.totalCount} withdrawals
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

export default BasicTablePendingWithdrawals