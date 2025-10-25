'use client'

import React, { startTransition, useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../ui/table';
import { showToast } from '@/utils/toastUtil';
import { useAuth } from '@/context/AuthContext';
import { ProviderStat } from '../constants/types';
import { getProviderStats } from '../lib/api';
import DateRangePicker from '../DateRangePicker';

const SortIcon = ({ direction }: { direction: 'asc' | 'desc' | 'none' }) => {
  if (direction === 'asc') {
    return <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6-6 6 6M12 3v18"/></svg>;
  }
  if (direction === 'desc') {
    return <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 15 6 6 6-6M12 9v12"/></svg>;
  }
  return <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 dark:text-gray-600 opacity-50"><path d="m8 9 4-4 4 4M16 15l-4 4-4-4"/></svg>;
};

const ProviderReportsTable = () => {
  const { isAuthenticated, token } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<ProviderStat[]>([]);

  const today = new Date();
  const [range, setRange] = useState<{ MinCreatedLocal: string; MaxCreatedLocal: string }>({
    MinCreatedLocal: new Date(today.setHours(0,0,0,0)).toISOString(),
    MaxCreatedLocal: new Date(today.setHours(23,59,59,999)).toISOString(),
  });

  const handleDateChange = (range: { MinCreatedLocal: string; MaxCreatedLocal: string }) => {
    const toIsoLocal = (localStr: string, isEnd = false) => {
      const [datePart, timePart] = localStr.split(' ')
      const [year, month, day] = datePart.split('-').map(Number)
      const [hour, minute, second] = timePart.split(':').map(Number)

      const localDate = new Date(year, month - 1, day, hour, minute, second)

      if (isEnd) {
        return localDate.toISOString()
      } else {
        const tzOffsetMs = localDate.getTimezoneOffset() * 60000
        const corrected = new Date(localDate.getTime() - tzOffsetMs)
        return corrected.toISOString()
      }
    }

    setRange({
      MinCreatedLocal: toIsoLocal(range.MinCreatedLocal, false),
      MaxCreatedLocal: toIsoLocal(range.MaxCreatedLocal, true),
    })
  }

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
        <TableCell key={index} className="px-5 py-4"> {/* Standardized padding */}
          <div className="h-4 w-full rounded bg-gray-200 dark:bg-slate-800 animate-pulse" />
        </TableCell>
      ))}
    </TableRow>
  );
  
  // --- Provider Color Logic (Copied from GameReportsTable) ---
  const providerColors = [
    'text-orange-600 dark:text-orange-500',
    'text-cyan-600 dark:text-cyan-500',
    'text-lime-600 dark:text-lime-500',
    'text-gray-800 dark:text-gray-600',
    'text-sky-600 dark:text-sky-500',
    'text-amber-600 dark:text-amber-500',
    'text-fuchsia-600 dark:text-fuchsia-500',
    'text-teal-600 dark:text-teal-500',
    'text-orange-600 dark:text-orange-700',
    'text-cyan-600 dark:text-cyan-700',
  ];

  const getProviderColor = (providerId: number | string) => {
    const idStr = String(providerId);
    const len = idStr.length;
    const lastDigit = parseInt(idStr[len - 1] || '0', 10);
    const secondLastDigit = parseInt(idStr[len - 2] || '0', 10);
    const combined = (lastDigit * 3 + secondLastDigit * 7) % providerColors.length;
    return providerColors[combined];
  };
  // --- End of Provider Color Logic ---


  return (
    <div className="space-y-5 bg-gray-50 dark:bg-gray-950 min-h-screen"> {/* Added page wrapper for context */}
      
      {/* Header: Title and Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-end gap-4">
        <div className="flex items-center gap-2">
          <div className="w-full md:w-auto">
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
            disabled={isLoading} // Disable button while loading
            className="h-9 w-9 flex-shrink-0 flex items-center justify-center rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-wait"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} // Add spin animation on load
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="rounded-lg border border-gray-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900">
        {/* Table */}
        <div className="w-full overflow-x-auto">
          <div className="min-h-[400px]"> {/* Reduced min-height */}
            <Table>
              <TableHeader className="bg-gray-50 dark:bg-slate-800/50">
                <TableRow className="border-b border-gray-200 dark:border-slate-800">
                  
                  {/* --- Header Cells with Sorting --- */}
                  <TableCell
                    isHeader
                    className="px-5 py-3.5 text-left text-sm font-semibold text-gray-600 dark:text-gray-400"
                  >
                    <div 
                      className="flex items-center gap-1.5 cursor-pointer select-none"
                      onClick={() => handleSort('providerId')}
                    >
                      <span>Sağlayıcı ID</span>
                      <SortIcon direction={sortField === 'providerId' ? sortDirection : 'none'} />
                    </div>
                  </TableCell>
                  
                  <TableCell
                    isHeader
                    className="px-5 py-3.5 text-left text-sm font-semibold text-gray-600 dark:text-gray-400"
                  >
                    <div 
                      className="flex items-center gap-1.5 cursor-pointer select-none"
                      onClick={() => handleSort('providerName')}
                    >
                      <span>Sağlayıcı</span>
                      <SortIcon direction={sortField === 'providerName' ? sortDirection : 'none'} />
                    </div>
                  </TableCell>

                  <TableCell
                    isHeader
                    className="px-5 py-3.5 text-left text-sm font-semibold text-gray-600 dark:text-gray-400"
                  >
                    <div 
                      className="flex items-center gap-1.5 cursor-pointer select-none"
                      onClick={() => handleSort('totalBet')}
                    >
                      <span>Toplam Bet</span>
                      <SortIcon direction={sortField === 'totalBet' ? sortDirection : 'none'} />
                    </div>
                  </TableCell>

                  <TableCell
                    isHeader
                    className="px-5 py-3.5 text-left text-sm font-semibold text-gray-600 dark:text-gray-400"
                  >
                    <div 
                      className="flex items-center gap-1.5 cursor-pointer select-none"
                      onClick={() => handleSort('totalWin')}
                    >
                      <span>Toplam Win</span>
                      <SortIcon direction={sortField === 'totalWin' ? sortDirection : 'none'} />
                    </div>
                  </TableCell>

                  <TableCell
                    isHeader
                    className="px-5 py-3.5 text-left text-sm font-semibold text-gray-600 dark:text-gray-400"
                  >
                    <div 
                      className="flex items-center gap-1.5 cursor-pointer select-none"
                      onClick={() => handleSort('profit')}
                    >
                      <span>GGR</span>
                      <SortIcon direction={sortField === 'profit' ? sortDirection : 'none'} />
                    </div>
                  </TableCell>

                </TableRow>
              </TableHeader>

              <TableBody className={`divide-y divide-gray-100 dark:divide-slate-800 transition-opacity duration-300 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} columns={5} />) // Use a fixed number for skeleton
                ) : (
                  paginatedStats.map((t) => (
                    <TableRow key={t.providerId} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/50 transition-colors">
                      <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap" >{t.providerId}</TableCell>
                      <TableCell className={`px-5 py-4 text-sm font-medium capitalize ${getProviderColor(t.providerId)} whitespace-nowrap`}>{t.providerName}</TableCell>
                      <TableCell className="px-5 py-4 text-sm text-red-600 dark:text-red-400 whitespace-nowrap">₺{t.totalBet.toLocaleString()}</TableCell>
                      <TableCell className="px-5 py-4 text-sm text-green-600 dark:text-green-400 whitespace-nowrap">₺{t.totalWin.toLocaleString()}</TableCell>
                      <TableCell className={`px-5 py-4 text-sm font-medium ${t.profit < 0 ? "text-red-600 dark:text-red-500" : t.profit > 0 ? "text-green-600 dark:text-green-500" : "text-yellow-600 dark:text-yellow-500"} whitespace-nowrap`}>
                        ₺{t.profit.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))
                )}
                
                {/* Show message if no data and not loading */}
                {!isLoading && stats.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10 text-gray-500 dark:text-gray-400">
                      No provider reports found for the selected date range.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Pagination Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between w-full px-5 py-3 border-t border-gray-200 dark:border-slate-800 gap-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {stats.length > 0
              ? `Showing ${paginatedStats.length} of ${stats.length} results`
              : 'No results'
            }
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label htmlFor="rowsPerPage" className="text-sm text-gray-600 dark:text-gray-400">
                Rows:
              </label>
              <select
                id="rowsPerPage"
                value={rowsPerPage}
                onChange={handleRowsPerPageChange}
                className="text-sm rounded-md border border-gray-300 px-2 py-1.5 dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                {[25, 50, 75, 100].map(val => <option key={val} value={val}>{val}</option>)}
              </select>
            </div>

            <span className="text-sm text-gray-600 dark:text-gray-400 hidden sm:block">
              Page {currentPage} of {totalPages > 0 ? totalPages : 1}
            </span>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || isLoading}
                className="text-sm px-3 py-1.5 rounded-md bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || isLoading || stats.length === 0}
                className="text-sm px-3 py-1.5 rounded-md bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProviderReportsTable;
