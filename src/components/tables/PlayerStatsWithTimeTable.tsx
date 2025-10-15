// src/components/PlayerStatsWithTimeTable.tsx

import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import "react-datepicker/dist/react-datepicker.css";
import { formatDateToDDMMYYYY } from "@/utils/utils"; // Your date utility
import { PlayerStatsByTimeDto } from "../constants/types";
import { getPlayersStats } from "../lib/api";
import { showToast } from "@/utils/toastUtil";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table";
import DateRangePicker from "../DateRangePicker";

type SortColumn = keyof PlayerStatsByTimeDto;

export default function PlayerStatsWithTimeTable() {
  // --- STATE MANAGEMENT ---

  // Data states
  const [allStats, setAllStats] = useState<PlayerStatsByTimeDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Date range state, matching your DateRangePicker's needs
  const today = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    const startOfToday = `${today.getFullYear()}-${pad(today.getMonth()+1)}-${pad(today.getDate())} 00:00:00`;
    const endOfToday = `${today.getFullYear()}-${pad(today.getMonth()+1)}-${pad(today.getDate())} 23:59:59`;
  const [range, setRange] = useState({
    MinCreatedLocal: startOfToday,
    MaxCreatedLocal: endOfToday,
  });

  // UI and Client-side logic states
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [sortConfig, setSortConfig] = useState<{ key: SortColumn; direction: "asc" | "desc" } | null>(null);
  const [filters, setFilters] = useState({ playerId: "", username: "", fullName: "" });
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // --- DATA FETCHING ---

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      
      const response = await getPlayersStats({
        from: range.MinCreatedLocal,
        to: range.MaxCreatedLocal,
      });

      if (response.isSuccess && response.playersStats) {
        setAllStats(response.playersStats);
      } else {
        showToast(response.message || "An unknown error occurred.", "error")
        setError(response.message || "An unknown error occurred.");
        setAllStats([]); // Clear data on error to avoid showing stale info
      }
      
      setLoading(false);
      setCurrentPage(1); // Reset to page 1 on new data fetch
    };

    fetchStats();
  }, [range]); // Re-fetch only when the date range changes

  // --- CLIENT-SIDE LOGIC (Filtering, Sorting, Pagination) ---

  const displayedStats = useMemo(() => {
    let filteredData = allStats.filter((player) => 
        (filters.playerId === "" || player.playerId.toString().includes(filters.playerId)) &&
        (filters.username === "" || player.playerUsername.toLowerCase().includes(filters.username.toLowerCase())) &&
        (filters.fullName === "" || player.playerFullName.toLowerCase().includes(filters.fullName.toLowerCase()))
    );

    if (sortConfig) {
      filteredData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "asc" ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    
    return filteredData;
  }, [allStats, filters, sortConfig]);

  const paginatedStats = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return displayedStats.slice(startIndex, startIndex + rowsPerPage);
  }, [displayedStats, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(displayedStats.length / rowsPerPage);

  // --- HANDLER FUNCTIONS ---

  const handleDateChange = (newRange: { MinCreatedLocal: string; MaxCreatedLocal: string }) => {
    setRange(newRange);
  };
  
  const handleSort = (key: SortColumn) => {
    const direction = (sortConfig?.key === key && sortConfig.direction === "asc") ? "desc" : "asc";
    setSortConfig({ key, direction });
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setCurrentPage(1);
  };

  const removeFilters = () => {
    setFilters({ playerId: "", username: "", fullName: "" });
    setSortConfig(null);
    setCurrentPage(1);
    setOpen(false);
  };
  
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) setCurrentPage(newPage);
  };

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };
  
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // --- RENDER ---

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
<div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
  <div className="p-4 border-b border-gray-200 dark:border-white/[0.05] flex flex-col md:flex-row md:items-end md:justify-between gap-4">
    
    {/* Left side - Filters Dropdown */}
    <div className="relative w-full md:w-auto order-2 md:order-1" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 flex items-center gap-2 justify-center w-full md:w-auto"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 4h18M3 12h18M3 20h18"
          />
        </svg>
        Filters
      </button>
      {open && (
        <div className="absolute mt-2 w-72 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 p-4">
          <div className="space-y-3">
            <input type="text" name="playerId" placeholder="Player ID" value={filters.playerId} onChange={handleFilterChange} className="w-full border px-3 py-2 rounded text-sm dark:bg-gray-700 dark:text-white" />
            <input type="text" name="username" placeholder="Username" value={filters.username} onChange={handleFilterChange} className="w-full border px-3 py-2 rounded text-sm dark:bg-gray-700 dark:text-white" />
            <input type="text" name="fullName" placeholder="Full Name" value={filters.fullName} onChange={handleFilterChange} className="w-full border px-3 py-2 rounded text-sm dark:bg-gray-700 dark:text-white" />
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button onClick={removeFilters} className="px-4 py-2 bg-error-600 text-white text-sm rounded hover:bg-error-700">
              Remove
            </button>
          </div>
        </div>
      )}
    </div>

    {/* Right side - Report Period */}
    <div className="flex flex-col w-full md:w-auto order-1 md:order-2 md:ml-auto">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-right md:text-left">
        Report Period:
      </label>
      <div className="flex justify-end md:justify-start">
        <DateRangePicker
          onChange={handleDateChange}
          isChanged={!!range.MinCreatedLocal && !!range.MaxCreatedLocal}
          initialStartDate={new Date(range.MinCreatedLocal)}
          initialEndDate={new Date(range.MaxCreatedLocal)}
        />
      </div>

        </div>
  
        {/* Error Display */}
        {error && (
          <div className="p-2 text-sm text-red-500 bg-red-100 dark:bg-red-900/20 rounded-md w-full md:w-auto">
            Error: {error}
          </div>
        )}
      </div>
  

      <div className="w-full overflow-x-auto">
        <div className="min-w-[1200px] min-h-[600px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader onClick={() => handleSort("playerId")} className="px-3 py-2 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer" >ID</TableCell>
                <TableCell isHeader onClick={() => handleSort("playerUsername")} className="px-3 py-2 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer">Username</TableCell>
                <TableCell isHeader onClick={() => handleSort("playerFullName")} className="px-3 py-2 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer">Full Name</TableCell>
                <TableCell isHeader onClick={() => handleSort("playerBalance")} className="px-3 py-2 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer">Balance</TableCell>
                <TableCell isHeader onClick={() => handleSort("depositAmount")} className="px-3 py-2 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer">Deposit</TableCell>
                <TableCell isHeader onClick={() => handleSort("withdrawalAmount")} className="px-3 py-2 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer">Withdrawal</TableCell>
                <TableCell isHeader className="px-3 py-2 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer">Net Profit</TableCell>
                <TableCell isHeader onClick={() => handleSort("totalCasinoStakes")} className="px-3 py-2 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer">Casino Stakes</TableCell>
                <TableCell isHeader onClick={() => handleSort("totalCasinoWin")} className="px-3 py-2 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer">Casino Win</TableCell>
                <TableCell isHeader onClick={() => handleSort("totalCasinoGGR")} className="px-3 py-2 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer">Casino GGR</TableCell>
                <TableCell isHeader onClick={() => handleSort("lastLoginDate")} className="px-3 py-2 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer">Last Login</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className={`divide-y divide-gray-100 dark:divide-white/[0.05] transition-opacity duration-300 ${loading ? 'opacity-50' : 'opacity-100'}`}>
              {loading ? (
                Array.from({ length: rowsPerPage }).map((_, i) => <SkeletonRow key={i} columns={11} />)
              ) : (
                paginatedStats.map((player) => (
                  <TableRow key={player.playerId}>
                    <TableCell className="px-3 py-2 text-start text-theme-sm"><Link href={`/player/${player.playerId}`}><span className="cursor-pointer font-medium text-blue-900 hover:underline dark:text-white/90">{player.playerId}</span></Link></TableCell>
                    <TableCell className="px-3 py-2 text-start text-theme-sm">{player.playerUsername}</TableCell>
                    <TableCell className="px-3 py-2 text-start text-theme-sm">{player.playerFullName}</TableCell>
                    <TableCell className="px-3 py-2 text-start text-theme-sm">{player.playerBalance.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</TableCell>
                    <TableCell className="text-green-600">{player.depositAmount.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</TableCell>
                    <TableCell className="text-error-600">{player.withdrawalAmount.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</TableCell>
                    <TableCell className={(player.depositAmount - player.withdrawalAmount) >= 0 ? 'text-green-600' : 'text-error-600'}>
                        {(player.depositAmount - player.withdrawalAmount).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                    </TableCell>
                    <TableCell>{player.totalCasinoStakes.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</TableCell>
                    <TableCell>{player.totalCasinoWin.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</TableCell>
                    <TableCell className={player.totalCasinoGGR >= 0 ? 'text-green-600' : 'text-error-600'}>
                        {player.totalCasinoGGR.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                    </TableCell>
                    <TableCell>{player.lastLoginDate ? formatDateToDDMMYYYY(player.lastLoginDate) : '-'}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex items-center justify-end w-full px-4 py-2 space-x-3 border-t border-[#c8c9cb]">
         <div className="text-sm text-gray-700 dark:text-gray-300 px-2 border-r border-[#c8c9cb]">Showing {paginatedStats.length} of {displayedStats.length} players</div>
         <div className="flex items-center gap-2">
           <label htmlFor="rowsPerPage" className="text-sm text-gray-700 dark:text-gray-300">Rows per page:</label>
           <select id="rowsPerPage" value={rowsPerPage} onChange={handleRowsPerPageChange} className="text-sm rounded-md border border-gray-300 px-2 py-1 dark:bg-gray-700 dark:text-white ">{[25, 50, 75, 100].map((val) => <option key={val} value={val}>{val}</option>)}</select>
         </div>
         <span className="text-sm text-gray-700 dark:text-gray-300 px-2 border-l border-[#c8c9cb]">Page {currentPage} of {totalPages || 1}</span>
         <div className="flex items-center space-x-2">
           <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="text-sm px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 dark:text-white disabled:opacity-50">Previous</button>
           <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="text-sm px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 dark:text-white disabled:opacity-50">Next</button>
         </div>
       </div>
    </div>
  );
}