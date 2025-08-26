"use client"
import React, { useEffect, useRef, useState } from 'react'
import { usePlayerTransactions } from '../hooks/usePlayerTransactions';
import { Bonus, ManageBonusRequest, PlayerTransactionFilter } from '../constants/types';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../ui/table';
import { formatDateToDDMMYYYYHHMMSS } from '@/utils/utils';
import DateRangePickerWithTime from './DateRangePickerWithTime';
import { getBonuses, manageBonus } from '../lib/api';
import { showToast } from '@/utils/toastUtil';

const PlayerBonusTable = ({ playerId }: { playerId:string }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(25);

    const [dateFrom, setDateFrom] = useState<string | undefined>(undefined);
    const [dateTo, setDateTo] = useState<string | undefined>(undefined);
    const [isDateModified, setIsDateModified] = useState(false)
    const [type, setType] = useState<string | undefined>(undefined);
    const [showPopup, setShowPopup] = useState(false);
    

    const [isFilterOn, setIsFilterOn] = useState(false);

    const [bonusList, setBonusList] = useState<Bonus[]>([])
    const popupRef = useRef<HTMLDivElement>(null);

    // close popup if clicked outside
      useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
          if (
            showPopup &&
            popupRef.current &&
            !popupRef.current.contains(event.target as Node)
          ) {
            setShowPopup(false);
          }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }, [showPopup]);

    const { transactions, loading, error, pagination, filter, setFilter } = usePlayerTransactions(
        {
          pageNumber: currentPage,
          pageSize: rowsPerPage,
          playerId,
          eventType: 'Bonus'
        }
      );

    const [open, setOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const [formData, setFormData] = useState<ManageBonusRequest & { amount: string }>({
        direction: "Inc",
        defId: "",
        amount: "", // <-- empty string instead of 0
        playerId: playerId,
        });
      const [isSubmitting, setIsSubmitting] = useState(false)
    
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

      useEffect(() => {
          getBonusesList();
        }, []);
      
    const getBonusesList = async () => {
      const bonusesResponse = await getBonuses();
      if (!bonusesResponse.isSuccess) {
        showToast(
          bonusesResponse.message ??
            "Something went wrong while getting bonus list",
          "error"
        );
      } else {
        setBonusList(bonusesResponse.bonuses ?? []);
      }
    };
      
    
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
        
        const newFilter:PlayerTransactionFilter  = {
          pageNumber: 1,
          pageSize: rowsPerPage,
          playerId: playerId,
          eventType: "Bonus",
          type: type || undefined
        };
      
        // Only include dates that were modified
        if (isDateModified) {
          newFilter.timeStampFrom = dateFrom;
          newFilter.timeStampTo = dateTo;
        }
      
        const isAnyFilterActive = 
          Boolean(type) ||
          isDateModified
      
        setIsFilterOn(isAnyFilterActive);
      
        setFilter(newFilter);
      };
      
      const removeFilter = () => {
        // Reset all input states
        setType('');
        setDateFrom('')
        setDateTo('')
        setIsDateModified(false)
        
        // Reset to first page
        setCurrentPage(1);
        
        // Create default filter with only contentType-specific filters
        const defaultFilter = {
          pageNumber: 1,
          pageSize: rowsPerPage,
          playerId: playerId
        };
        
        // Apply the default filter
        setFilter(defaultFilter);
        setIsFilterOn(false);
      };

      const handleManageBonus = async () => {
        setIsSubmitting(true)
        if(formData.amount === ""){
            showToast("Declare amount before submitting", "info");
         setIsSubmitting(false)
            return;
        }
        const bonus = bonusList.find((b) => b.defId === formData.defId);
        if (bonus && (bonus.min > formData.amount || bonus.max < formData.amount)) {
        showToast("Amount less than min or more than max", "info");
         setIsSubmitting(false)
        return;
        }
        try {
           const res = await manageBonus(formData);
           if (res.isSuccess) {
             showToast("Bonus credited", "success");
             handleRefetch();
             setShowPopup(false);
           } else {
             showToast(res.message ?? "Failed to add bonus", "error");
           }
         } catch (err) {
           showToast("An error occurred while managing bonus", "error");
           console.error(err);
         }
         setIsSubmitting(false)
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
          {/* Popup modal */}
      {showPopup && (
  <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-[9999999]">
    <div
      ref={popupRef}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-96"
    >
      <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
        Manage Bonus
      </h2>

      {/* Direction Select */}
      <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">
        Direction
      </label>
      <select
        value={formData.direction}
        onChange={(e) =>
          setFormData({ ...formData, direction: e.target.value as "Inc" | "Dec" })
        }
        className="w-full mb-3 rounded-md border border-gray-300 dark:border-gray-600 
                   bg-white dark:bg-gray-700 text-sm text-gray-700 dark:text-gray-200 
                   px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="Inc">Üst</option>
        <option value="Dec">Alt</option>
      </select>

      {/* Bonus Select */}
      <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">
        Bonus
      </label>
      <select
        value={formData.defId}
        onChange={(e) =>
          setFormData({ ...formData, defId: e.target.value })
        }
        className="w-full mb-3 rounded-md border border-gray-300 dark:border-gray-600 
                   bg-white dark:bg-gray-700 text-sm text-gray-700 dark:text-gray-200 
                   px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Select Bonus</option>
        {bonusList.map((b) => (
          <option key={b.defId} value={b.defId}>
            {b.name}
          </option>
        ))}
      </select>

      {/* Amount Input */}
      <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">
        Amount
      </label>
      <input
        type="number"
        value={formData.amount}
        onChange={(e) =>
          setFormData({ ...formData, amount: parseInt(e.target.value, 10) || 0 })
        }
        className="w-full mb-4 rounded-md border border-gray-300 dark:border-gray-600 
                   bg-white dark:bg-gray-700 text-sm text-gray-700 dark:text-gray-200 
                   px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Buttons */}
      <div className="flex justify-end gap-3">
        <button
        disabled={isSubmitting}
          onClick={() => setShowPopup(false)}
          className="px-4 py-2 bg-gray-300 text-gray-800 dark:bg-gray-600 dark:text-gray-200 text-sm rounded hover:bg-gray-400 disabled:bg-gray-400"
        >
          Back
        </button>
        <button
        disabled={isSubmitting}
          onClick={() => handleManageBonus()}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:bg-blue-800"
        >
          Submit
        </button>
      </div>
    </div>
  </div>
)}

          <div className="relative flex flex-row items-center justify-between" ref={dropdownRef}>
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

           <button
            onClick={() => setShowPopup(true)}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-tr-md hover:bg-blue-700 flex items-center gap-2"
          >
            Add Bonus
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
        <option value="Inc">Inc</option>
        <option value="Dec">Dec</option>
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
                        {t.type === "Inc" ? (<span className='text-green-600'>{t.type}</span>) : (<span className='text-red-600'>{t.type}</span>)}
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

export default PlayerBonusTable