'use client'

import React, { startTransition, useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../ui/table';
import { showToast } from '@/utils/toastUtil';
import { useAuth } from '@/context/AuthContext';
import { ProviderStat } from '../constants/types';
import { getProviderStats } from '../lib/api';
import DateRangePicker from '../DateRangePicker';

const ProviderReportsTable = () => {
  const { isAuthenticated, token } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<ProviderStat[]>([]);

  const today = new Date();
  const [range, setRange] = useState<{ MinCreatedLocal: string; MaxCreatedLocal: string }>({
    MinCreatedLocal: new Date(today.setHours(0,0,0,0)).toISOString(),
    MaxCreatedLocal: new Date(today.setHours(23,59,59,999)).toISOString(),
  });

  const handleDateChange = (range: { MinCreatedLocal: string; MaxCreatedLocal: string }) => setRange(range);

  // Pagination & Sorting
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [sortField, setSortField] = useState<keyof ProviderStat | ''>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const totalPages = Math.ceil(stats.length / rowsPerPage);

  const getStats = async (range: { MinCreatedLocal: string; MaxCreatedLocal: string }) => {
    setIsLoading(true);
    const result = await getProviderStats({ timeStampFrom: range.MinCreatedLocal, timeStampTo: range.MaxCreatedLocal });
    
    if (!result.isSuccess) {
      showToast(result.message ?? "Sağlayıcı raporları yüklenirken hata!", "error");
      setIsLoading(false);
      return;
    }

    if (result.providerStats) {
      startTransition(() => {
        setStats(result.providerStats);
        setCurrentPage(1); // Reset page on new data
      });
    } else {
      showToast("Sağlayıcı raporları yüklenirken hata!", "error");
    }
    setIsLoading(false);
  };

  // Fetch stats on range or auth change
  useEffect(() => {
    if (isAuthenticated && token) {
      getStats(range);
    }
  }, [range, isAuthenticated, token]);

  // Sorting handler
  const handleSort = (field: keyof ProviderStat) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Pagination handlers
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const sortedStats = React.useMemo(() => {
    if (!sortField) return stats;
    return [...stats].sort((a, b) => {
      if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
      if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [stats, sortField, sortDirection]);

  const paginatedStats = React.useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return sortedStats.slice(start, end);
  }, [sortedStats, currentPage, rowsPerPage]);

  const SkeletonRow = ({ columns }: { columns: number }) => (
    <TableRow>
      {Array.from({ length: columns }).map((_, index) => (
        <TableCell key={index} className="px-5 py-4">
          <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
        </TableCell>
      ))}
    </TableRow>
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-end gap-2">
        <div className="w-full md:w-auto flex items-center justify-center mt-5 md:mt-0">
          <DateRangePicker
            onChange={handleDateChange}
            isChanged={!!range.MinCreatedLocal && !!range.MaxCreatedLocal}
            initialStartDate={new Date(range.MinCreatedLocal)}
            initialEndDate={new Date(range.MaxCreatedLocal)}
          />
        </div>
        <button
          onClick={() => getStats(range)}
          title="Refresh Table"
          className="py-1 px-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center justify-center"
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
        {/* Table */}
        <div className="w-full overflow-x-auto">
          <div className="min-w-[1102px] min-h-[600px]">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell
                    isHeader
                    className="px-5 py-3 text-sm font-medium text-gray-800 dark:text-gray-200 text-start cursor-pointer"
                    onClick={() => handleSort('providerId')}
                  >
                    Sağlayıcı ID
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 text-sm font-medium text-gray-800 dark:text-gray-200 text-start cursor-pointer"
                    onClick={() => handleSort('providerName')}
                  >
                    Sağlayıcı
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 text-sm font-medium text-gray-800 dark:text-gray-200 text-start cursor-pointer"
                    onClick={() => handleSort('totalBet')}
                  >
                    Toplam Bet
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 text-sm font-medium text-gray-800 dark:text-gray-200  text-start cursor-pointer"
                    onClick={() => handleSort('totalWin')}
                  >
                    Toplam Win
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 text-sm font-medium text-gray-800 dark:text-gray-200  text-start cursor-pointer"
                    onClick={() => handleSort('profit')}
                  >
                    GGR
                  </TableCell>
                </TableRow>
              </TableHeader>

              <TableBody className={`divide-y divide-gray-100 dark:divide-white/[0.05] transition-opacity duration-300 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
                {isLoading ? (
                  Array.from({ length: rowsPerPage }).map((_, i) => <SkeletonRow key={i} columns={5} />)
                ) : (
                  paginatedStats.map((t) => (
                    <TableRow key={t.providerId}>
                      <TableCell className="px-5 py-4 text-md text-gray-800 dark:text-gray-300">{t.providerId}</TableCell>
                      <TableCell className="px-4 py-3 text-md text-gray-800 dark:text-gray-300">{t.providerName}</TableCell>
                      <TableCell className="px-4 py-3 text-md text-gray-800 dark:text-gray-300">₺{t.totalBet.toLocaleString()}</TableCell>
                      <TableCell className="px-4 py-3 text-md text-gray-800 dark:text-gray-300">₺{t.totalWin.toLocaleString()}</TableCell>
                      <TableCell className="px-4 py-3 text-md text-gray-800 dark:text-gray-300">₺{t.profit.toLocaleString()}</TableCell>
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
            Showing {paginatedStats.length} of {stats.length} provider stats
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="rowsPerPage" className="text-sm text-gray-700 dark:text-gray-300">
              Rows per page:
            </label>
            <select
              id="rowsPerPage"
              value={rowsPerPage}
              onChange={handleRowsPerPageChange}
              className="text-sm rounded-md border border-gray-300 px-2 py-1 dark:bg-gray-700 dark:text-white"
            >
              {[25, 50, 75, 100].map(val => <option key={val} value={val}>{val}</option>)}
            </select>
          </div>

          <span className="text-sm text-gray-700 dark:text-gray-300 px-2 border-l border-[#c8c9cb]">
            Page {currentPage} of {totalPages}
          </span>

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
              disabled={currentPage === totalPages}
              className="text-sm px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 dark:text-white disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProviderReportsTable;
