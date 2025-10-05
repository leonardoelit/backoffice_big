"use client"
import React, { useEffect, useRef, useState } from 'react'
import { BonusData, ManageBonusRequest, PlayerBonusRequestFilter } from '../constants/types';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../ui/table';
import { formatDateToDDMMYYYYHHMMSS } from '@/utils/utils';
import DateRangePickerWithTime from '../player-profile/DateRangePickerWithTime';
import { manageBonus } from '../lib/api';
import { showToast } from '@/utils/toastUtil';
import { bonusRequestStatusEnum } from '@/components/constants/index'
import Link from 'next/link';
import { bonusTypes } from './BasicTableBonuses';
import { useBonusRequests } from '../hooks/useBonusRequests';
import BonusConfirmationModal from './BonusConfirmationModal';



const BasicTablePendingBonusRequests = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(25);

  const [isDateModified, setIsDateModified] = useState(false)
    const [updatedAtFrom, setUpdatedAtFrom] = useState<string | undefined>(undefined);
    const [updatedAtTo, setUpdatedAtTo] = useState<string | undefined>(undefined);
    const [username, setUsername] = useState<string | undefined>(undefined)
    const [playerId, setPlayerId] = useState<string | undefined>(undefined)
    const [bonusName, setBonusName] = useState<string | undefined>(undefined)
    const [type, setType] = useState<number | undefined>(undefined)
    const [defId, setDefId] = useState<string | undefined>(undefined)

    const [modalState, setModalState] = useState<{
    isOpen: boolean;
    id: number | null;
    type: number | null;
    playerId: string | null;
    action: 'accept' | 'reject' | null;
  }>({
    isOpen: false,
    id: null,
    type: null,
    playerId: null,
    action: null
  });

    const [isSendingResponse, setIsSendingResponse] = useState(false);


    const [isFilterOn, setIsFilterOn] = useState(false);

    const { bonusRequests, loading, error, pagination, filter, setFilter } = useBonusRequests({
      pageNumber: currentPage,
      pageSize: rowsPerPage,
      status: 0,
    });


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

    const handleRefetch = () => {
      setCurrentPage(1);
      
      const newFilter:PlayerBonusRequestFilter  = {
        pageNumber: 1,
        pageSize: rowsPerPage,
        playerId: playerId || undefined,
        bonusName: bonusName || undefined,
        type: type || undefined,
        defId: defId || undefined,
        username: username || undefined,
        status: 0
      };
    
      // Only include dates that were modified
      if (isDateModified) {
        newFilter.updatedAtFrom = updatedAtFrom;
        newFilter.updatedAtTo = updatedAtTo;
      }
    
      const isAnyFilterActive = 
        Boolean(playerId) ||
        Boolean(username) ||
        Boolean(type) ||
        Boolean(defId) ||
        Boolean(bonusName) ||
        isDateModified
    
      setIsFilterOn(isAnyFilterActive);
    
      setFilter(newFilter);
    };
    
    const removeFilter = () => {
      // Reset all input states
      setPlayerId('');
      setUsername('')
      setDefId('')
      setBonusName('')
      setType(undefined)
      setIsDateModified(false)
      
      // Reset to first page
      setCurrentPage(1);
      
      // Create default filter with only contentType-specific filters
      const defaultFilter = {
        pageNumber: 1,
        pageSize: rowsPerPage,
        status: 0
      };
      
      // Apply the default filter
      setFilter(defaultFilter);
      setIsFilterOn(false);
    };

    // Modify manageRequest to open confirmation modal
  const handleActionClick = (id: number, playerId: string, type: number, action: 'accept' | 'reject') => {
    setModalState({
      isOpen: true,
      id,
      type,
      playerId,
      action
    });
  };

  // Create function to handle confirmed action
  const handleConfirmedAction = async (amount:number, note:string) => {
    if (modalState.id && modalState.playerId && modalState.action) {
      setIsSendingResponse(true);
      const requestBody:ManageBonusRequest = {
        direction: "Inc",
        result: modalState.action === "accept",
        playerId: modalState.playerId,
        isChangedFreespinRounds: amount === 14821748325 ? false : true,
        bonusRequestId: modalState.id,
        amount: amount === 14821748325 ? 123 : amount,
        note: note
      }
      const result = await manageBonus(
        requestBody
      );
      
      if (!result.isSuccess) {
        showToast(result.message ? result.message : "Bonus sonuçlanırken hata", "error");
      } else {
        showToast(result.message ? result.message : `Bonus ${requestBody.result ? "onaylandı, oyuncunun bakiyesi güncellendi" : "reddedildi"}`, "success");
        handleRefetch();
      }
      
      setIsSendingResponse(false);
      setModalState({ isOpen: false, id: null, type: null, playerId: null, action: null });
    }
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
          <BonusConfirmationModal
            isOpen={modalState.isOpen}
            onClose={() => setModalState({ isOpen: false, id: null, type: null, playerId: null, action: null })}
            type={modalState.type!}
            onConfirm={(amount, note) => handleConfirmedAction(amount, note)}
            isSubmitting={isSendingResponse}
            action={modalState.action}
          />
          <div className='relative flex flex-row items-center justify-end' ref={dropdownRef}>
          {/* <button
            onClick={() => setOpen(!open)}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-tl-md hover:bg-blue-700 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18M3 12h18M3 20h18" />
            </svg>
            Filters
          </button> */}
    
          {/* Dropdown panel */}
        {open && (
        <div
            className="absolute mt-2 w-full md:w-[80vw] max-w-4xl right-0 
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
                value={username || ""}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 
                        bg-white dark:bg-gray-700 text-sm text-gray-700 dark:text-gray-200 
                        px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Fullname */}
            <input
                type="text"
                value={bonusName || ""}
                onChange={(e) => setBonusName(e.target.value)}
                placeholder="Full Name"
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 
                        bg-white dark:bg-gray-700 text-sm text-gray-700 dark:text-gray-200 
                        px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
                type="text"
                value={defId || ""}
                onChange={(e) => setDefId(e.target.value)}
                placeholder="DefId"
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 
                        bg-white dark:bg-gray-700 text-sm text-gray-700 dark:text-gray-200 
                        px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <select
              value={type}
              onChange={(e) => setType(Number(e.target.value))}
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 
                        bg-white dark:bg-gray-700 text-sm text-gray-700 dark:text-gray-200 
                        px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Type</option>
              {bonusTypes.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
            <div className="rounded-md border border-gray-300 dark:border-gray-600 
                        px-2 py-1 bg-white dark:bg-gray-700">
          <DateRangePickerWithTime
            initialStartDate={new Date(updatedAtFrom!)}
            initialEndDate={new Date(updatedAtTo!)}
            onChange={({ MinCreatedLocal, MaxCreatedLocal }) => {
              setUpdatedAtFrom(MinCreatedLocal)
              setUpdatedAtTo(MaxCreatedLocal)
              setIsDateModified(true)
            }}
            onModifiedChange={(modified) => setIsDateModified(modified)}
            isChanged={isDateModified}
          />
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

      <div className="w-full overflow-x-auto">
        <div className="min-w-[1102px] min-h-[600px] h-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell 
                  isHeader 
                  className="px-3 py-2 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer"
                >
                  ID
                </TableCell>
                <TableCell 
                  isHeader 
                  className="px-3 py-2 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer"
                >
                  Player ID
                </TableCell>
                <TableCell 
                  isHeader 
                  className="px-3 py-2 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer"
                >
                  Username
                </TableCell>
                <TableCell 
                  isHeader 
                  className="px-3 py-2 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer"
                >
                  Tip
                </TableCell>
                <TableCell 
                  isHeader 
                  className="px-3 py-2 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer"
                >
                  Bonus Adı
                </TableCell>
                <TableCell 
                  isHeader 
                  className="px-3 py-2 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer"
                >
                  Son Yatırım Miktarı
                </TableCell>
                <TableCell 
                  isHeader 
                  className="px-3 py-2 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer"
                >
                  Son Yatırım Zamanı
                </TableCell>
                <TableCell 
                  isHeader 
                  className="px-3 py-2 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer"
                >
                  Son Çekim Zamanı
                </TableCell>
                  <TableCell 
                  isHeader 
                  className="px-3 py-2 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer"
                >
                    Son Bonus Zamanı
                  </TableCell>
                  <TableCell 
                  isHeader 
                  className="px-3 py-2 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer"
                >
                  Durum
                  </TableCell>
                  <TableCell 
                  isHeader 
                  className="px-3 py-2 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer"
                >
                  Zaman
                  </TableCell>
                  <TableCell 
                  isHeader 
                  className="px-3 py-2 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer"
                >
                    Aksiyonlar
                  </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className={`divide-y divide-gray-100 dark:divide-white/[0.05] transition-opacity duration-300 ${loading ? 'opacity-50' : 'opacity-100'}`}>
              {loading ? (
                <>
                  {Array.from({ length: rowsPerPage }).map((_, i) => (
                    <SkeletonRow key={i} columns={12} />
                  ))}
                </>
              ) : (
                bonusRequests.map((t:BonusData) => (
                  <TableRow key={t.id}>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <div>
                          <span className="cursor-pointer block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                            {t.id}
                          </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-900 text-start text-theme-sm dark:text-gray-400">
                      <Link href={`/player/${t.playerId}`}>
                        <span className="cursor-pointer block font-medium text-blue-900 hover:underline text-theme-sm dark:text-white/90">
                          {t.playerId}
                        </span>
                      </Link>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-900 text-start text-theme-sm dark:text-gray-400">
                      {t.playerName}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-900 text-start text-theme-sm dark:text-gray-400">
                      {bonusTypes.find((p) => p.id === t.type)?.name}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-900 text-start text-theme-sm dark:text-gray-400">
                        {t.percentage ? `${t.percentage}% ${t.bonusName}` : t.bonusName}
                    </TableCell>
                      <TableCell className="px-4 py-3 text-start text-theme-sm">
                      ₺{t.lastDepositAmount.toLocaleString()}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-900 text-start text-theme-sm dark:text-gray-400">
                      {t.lastDepositTime === null || t.lastDepositTime === undefined ? " - " : formatDateToDDMMYYYYHHMMSS(t.lastDepositTime)}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-900 text-start text-theme-sm dark:text-gray-400">
                      {t.lastWithdrawalTime === null || t.lastWithdrawalTime === undefined ? " - " : formatDateToDDMMYYYYHHMMSS(t.lastWithdrawalTime)}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-900 text-start text-theme-sm dark:text-gray-400">
                      {t.lastTimePlayerTakeBonus === null || t.lastTimePlayerTakeBonus === undefined ? " - " : formatDateToDDMMYYYYHHMMSS(t.lastTimePlayerTakeBonus)}
                    </TableCell>
                    <TableCell className={`px-4 py-3 ${t.status === 0 || t.status === 1 ? 'text-yellow-600' : t.status === 2 ? 'text-success-600' : t.status === 3 ? 'text-red-600' : 'text-gray-500 dark:text-gray-400'} text-start text-theme-sm`}>
                      {bonusRequestStatusEnum.find((p) => p.id === t.status)?.name}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-900 text-start text-theme-sm dark:text-gray-400">
                      {t.updatedAt === undefined ? " - " : formatDateToDDMMYYYYHHMMSS(t.updatedAt)}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        
                        <div className='flex flex-row items-start justify-start gap-2'>
                            <button disabled={isSendingResponse || t.status !== 0} onClick={() => handleActionClick(t.id, t.playerId, t.type, 'accept')} className='px-2 py-1 text-green-600 border-[1px] border-green-600 bg-white hover:green-700 hover:bg-gray-200 hover:test-semibold disabled:bg-gray-300 rounded-md'>
                                Kabul
                            </button>
                            <button disabled={isSendingResponse || t.status !== 0} onClick={() => handleActionClick(t.id, t.playerId, t.type, 'reject')} className='px-2 py-1 text-red-600 border-[1px] border-red-600 bg-white hover:green-700 hover:bg-gray-200 hover:test-semibold disabled:bg-gray-300 rounded-md'>
                                Reddet
                            </button>
                        </div>
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
          Showing {bonusRequests.length} of {pagination.totalCount} transactions
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

export default BasicTablePendingBonusRequests