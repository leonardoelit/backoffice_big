"use client"
import { useEffect, useRef, useState } from 'react'
import { useTaggedPlayers } from '../hooks/useTaggedPlayers';
import { GetTaggedPlayersRequest } from '../constants/types';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../ui/table';
import Link from 'next/link';
import { formatDateToDDMMYYYY, formatDateToDDMMYYYYHHMMSS } from '@/utils/utils';
import { removePlayerMark } from '../lib/api';
import { showToast } from '@/utils/toastUtil';
import { TrashBinIcon } from '@/icons';

const BasicRiskTable = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(25);

    const [playerId, setPlayerId] = useState<string | undefined>(undefined);
    const [playerUsername, setPlayerUsername] = useState<string | undefined>(undefined);
    const [whoMarked, setWhoMarked] = useState<string | undefined>(undefined);
    const [isFilterOn, setIsFilterOn] = useState(false);

    const [isRemoving, setIsRemoving] = useState(false);

    const { data, loading, error, pagination, filter, setFilter } = useTaggedPlayers(
            {
              pageNumber: currentPage,
              pageSize: rowsPerPage,
              type: 0
            }
          );
    const [open, setOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (open && dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
        }, [open]);

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
      
      const newFilter:GetTaggedPlayersRequest  = {
        pageNumber: 1,
        pageSize: rowsPerPage,
        playerId: playerId || undefined,
        type: 0,
        playerUsername: playerUsername || undefined,
        whoMarked: whoMarked || undefined,
      };
    
      const isAnyFilterActive = 
        Boolean(playerId) ||
        Boolean(playerUsername) ||
        Boolean(whoMarked)
    
      setIsFilterOn(isAnyFilterActive);
    
      setFilter(newFilter);
    };

const removeFilter = () => {
      // Reset all input states
      setPlayerId('');
      setPlayerUsername('')
      setWhoMarked('')
      
      // Reset to first page
      setCurrentPage(1);
      
      // Create default filter with only contentType-specific filters
      const defaultFilter = {
        pageNumber: 1,
        pageSize: rowsPerPage,
        type: 0
      };
  
      // Apply the default filter
      setFilter(defaultFilter);
      setIsFilterOn(false);
    };

    useEffect(() => {
      handleRefetch();
    }, []);

        const [confirmOpen, setConfirmOpen] = useState(false);
const [selectedId, setSelectedId] = useState<number | null>(null);

const openConfirm = (id: number) => {
  setSelectedId(id);
  setConfirmOpen(true);
};

const confirmRemove = async () => {
  if (!selectedId) return;
  setIsRemoving(true);

  try {
    const res = await removePlayerMark(selectedId);
    if(res.isSuccess){
      showToast("Oyuncu risk listesinden kaldırıldı", "success");
      handleRefetch();
    } else {
      showToast(res.message ?? "Oyuncuyu risk listesinden kaldırırken hata", "error");
    }
  } catch (error) {
    console.log(error);
    showToast("Oyuncuyu risk listesinden kaldırırken hata", "error");
  }
  setIsRemoving(false);
  setConfirmOpen(false);
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
          {/* Dropdown panel */}
{open && (
  <div
    className="absolute mt-2 w-full md:w-[70vw] max-w-4xl right-0 
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
      <input
        type="text"
        value={playerUsername || ""}
        onChange={(e) => setPlayerUsername(e.target.value)}
        placeholder="Username"
        className="w-full rounded-md border border-gray-300 dark:border-gray-600 
                   bg-white dark:bg-gray-700 text-sm text-gray-700 dark:text-gray-200 
                   px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="text"
        value={whoMarked || ""}
        onChange={(e) => setWhoMarked(e.target.value)}
        placeholder="Çalışan İsmi"
        className="w-full rounded-md border border-gray-300 dark:border-gray-600 
                   bg-white dark:bg-gray-700 text-sm text-gray-700 dark:text-gray-200 
                   px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
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

        </div>
      <div className="w-full overflow-x-auto">
        <div className="min-w-[1102px] min-h-[600px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell 
                  isHeader 
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer" 
                  onClick={() => handleSort("id")}
                >
                  Player Info
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Çalışan İsmi
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Toplam Yatırım Miktarı
                </TableCell>
                <TableCell 
                  isHeader 
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer" 
                >
                  Toplam Çekim Miktarı
                </TableCell>
                <TableCell 
                  isHeader 
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer" 
                >
                  Son Yatırım Miktarı
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Son Yatırım Zamanı
                </TableCell>
                <TableCell 
                  isHeader 
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer" 
                >
                  Son Çekim Miktarı
                </TableCell>
                  <TableCell 
                    isHeader 
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer" 
                  >
                    Son Çekim Zamanı
                  </TableCell>
                  <TableCell 
                    isHeader 
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer" 
                  >
                    Not
                  </TableCell>
                  <TableCell 
                    isHeader 
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer" 
                  >
                    Tarih
                  </TableCell>
                  <TableCell 
                    isHeader 
                    className="px-3 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer" 
                  >
                    Aksiyon
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
                data.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="px-4 py-3 text-gray-900 text-start text-theme-sm dark:text-gray-400">
                      <div className="flex flex-col items-start gap-[1px]">
                      <Link href={`/player/${t.playerId}`}>
                        <span className="cursor-pointer block font-medium text-blue-900 hover:underline text-theme-sm dark:text-white/90">
                          {t.playerId}
                        </span>
                      </Link>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            {t.playerUsername}
                        </span>
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                            {t.playerFullName}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-900 text-start text-theme-sm dark:text-gray-400">
                      {t.whoMarked}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-900 text-start text-theme-sm dark:text-gray-400">
                      ₺{t.totalDepositAmount.toLocaleString()}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-900 text-start text-theme-sm dark:text-gray-400">
                      ₺{t.totalWithdrawalAmount.toLocaleString()}
                    </TableCell>

                    <TableCell className="px-4 py-3 text-gray-900 text-start text-theme-sm dark:text-gray-400">
                      ₺{t.lastDepositAmount ? t.lastDepositAmount.toLocaleString() : "-"}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-900 text-start text-theme-sm dark:text-gray-400">
                        {t.lastDepositDate ? formatDateToDDMMYYYY(t.lastDepositDate) : "-"}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-900 text-start text-theme-sm dark:text-gray-400">
                      ₺{t.lastWithdrawalAmount ? t.lastWithdrawalAmount.toLocaleString() : "-"}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-900 text-start text-theme-sm dark:text-gray-400">
                        {t.lastWithdrawalDate ? formatDateToDDMMYYYY(t.lastWithdrawalDate) : "-"}
                    </TableCell>
                    <TableCell title={t.note} className="px-4 py-3 text-gray-900 text-start text-theme-sm dark:text-gray-400 truncate">
                      {t.note}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {formatDateToDDMMYYYYHHMMSS(t.createdAt)}
                    </TableCell>
                    <TableCell className="px-4 py-3 font-semibold text-red-500 text-start text-theme-sm dark:text-red-400">
                        <button disabled={isRemoving} onClick={() => openConfirm(t.id)}>
                          <TrashBinIcon />
                        </button>
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
          Showing {data.length} of {pagination.totalCount} transactions
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
  {confirmOpen && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[999999]">
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-sm">
      <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
        Risk listesinden kaldırmak istediğinize emin misiniz ?
      </h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
        Bu aksiyon geri alınamaz
      </p>
      <div className="flex justify-end gap-3">
        <button
          onClick={() => setConfirmOpen(false)}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          İptal
        </button>
        <button
          disabled={isRemoving}
          onClick={confirmRemove}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
        >
          {isRemoving ? (<span className='loading-dots'>Kaldırılıyor</span>) : "Kaldır"}
        </button>
      </div>
    </div>
  </div>
)}

</div>
  )
}

export default BasicRiskTable