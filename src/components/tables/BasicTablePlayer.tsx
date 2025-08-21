import React, { useState, useEffect, useRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { Player, PlayerFilter } from "../constants/types";
import { usePlayers } from "../hooks/usePlayers";
import "react-datepicker/dist/react-datepicker.css";
import DateRangePicker from "../DateRangePicker";
import { formatDateToDDMMYYYY } from "@/utils/utils";

type SortColumn = keyof Player | "registrationDateTime";

export default function PlayerTable({ contentType }: { contentType: string }) {
  const { token } = useAuth(); 

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [sortColumn, setSortColumn] = useState<SortColumn | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Filter Use States
  // New useState hooks at the top of your component
  const [playerIdInput, setPlayerIdInput] = useState("");
  const [usernameInput, setUsernameInput] = useState("");
  const [promoCodeInput, setPromoCodeInput] = useState("");

  const [registrationDateFrom, setRegistrationDateFrom] = useState<string | undefined>(undefined);
  const [registrationDateTo, setRegistrationDateTo] = useState<string | undefined>(undefined);

  const [firstDepositDateFrom, setFirstDepositDateFrom] = useState<string | undefined>(undefined);
  const [firstDepositDateTo, setFirstDepositDateTo] = useState<string | undefined>(undefined);
  const [lastDepositDateFrom, setLastDepositDateFrom] = useState<string | undefined>(undefined);
  const [lastDepositDateTo, setLastDepositDateTo] = useState<string | undefined>(undefined);

  const [firstWithdrawalDateFrom, setFirstWithdrawalDateFrom] = useState<string | undefined>(undefined);
  const [firstWithdrawalDateTo, setFirstWithdrawalDateTo] = useState<string | undefined>(undefined);
  const [lastWithdrawalDateFrom, setLastWithdrawalDateFrom] = useState<string | undefined>(undefined);
  const [lastWithdrawalDateTo, setLastWithdrawalDateTo] = useState<string | undefined>(undefined);

  const [hasWithdrawal, setHasWithdrawal] = useState<boolean | undefined>(undefined);
  const [hasDeposit, setHasDeposit] = useState<boolean | undefined>(undefined);

  const [documentNumber, setDocumentNumber] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [isFilterOn, setIsFilterOn] = useState(false);

  const [modifiedDates, setModifiedDates] = useState({
    registration: false,
    firstDeposit: false,
    lastDeposit: false,
    firstWithdrawal: false,
    lastWithdrawal: false
  });
  
  // Use the usePlayers hook with filters based on contentType
  const { players, loading, error, pagination, filter, setFilter } = usePlayers(
    token!,
    {
      pageNumber: currentPage,
      pageSize: rowsPerPage
    }
  );

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
    pageNumber: 1, // Reset to first page when sorting
  }));
};

  const handleRefetch = () => {
  setCurrentPage(1);
  
  const newFilter:PlayerFilter  = {
    pageNumber: 1,
    pageSize: rowsPerPage,
    playerId: playerIdInput ? Number(playerIdInput) : undefined,
    username: usernameInput || undefined,
    promoCode: promoCodeInput || undefined,
    hasWithdrawal,
    hasDeposit,
    documentNumber: documentNumber || undefined,
    mobileNumber: mobileNumber || undefined,
    email: email || undefined,
    firstName: firstName || undefined,
    lastName: lastName || undefined,
  };

  // Only include dates that were modified
  if (modifiedDates.registration) {
    newFilter.registrationDateFrom = registrationDateFrom;
    newFilter.registrationDateTo = registrationDateTo;
  }
  if (modifiedDates.firstDeposit) {
    newFilter.firstDepositDateFrom = firstDepositDateFrom;
    newFilter.firstDepositDateTo = firstDepositDateTo;
  }
  if (modifiedDates.lastDeposit) {
    newFilter.lastDepositDateFrom = lastDepositDateFrom;
    newFilter.lastDepositDateTo = lastDepositDateTo;
  }
  if (modifiedDates.firstWithdrawal) {
    newFilter.firstWithdrawalDateFrom = firstWithdrawalDateFrom;
    newFilter.firstWithdrawalDateTo = firstWithdrawalDateTo;
  }
  if (modifiedDates.lastWithdrawal) {
    newFilter.lastWithdrawalDateFrom = lastWithdrawalDateFrom;
    newFilter.lastWithdrawalDateTo = lastWithdrawalDateTo;
  }

  const isAnyFilterActive = 
    Boolean(playerIdInput) ||
    Boolean(usernameInput) ||
    Boolean(promoCodeInput) ||
    hasWithdrawal !== undefined ||
    hasDeposit !== undefined ||
    Boolean(documentNumber) ||
    Boolean(mobileNumber) ||
    Boolean(email) ||
    Boolean(firstName) ||
    Boolean(lastName) ||
    modifiedDates.registration ||
    modifiedDates.firstDeposit ||
    modifiedDates.lastDeposit ||
    modifiedDates.firstWithdrawal ||
    modifiedDates.lastWithdrawal;

  setIsFilterOn(isAnyFilterActive);

  setFilter(newFilter);
};

const removeFilter = () => {
  // Reset all input states
  setPlayerIdInput("");
  setUsernameInput("");
  setPromoCodeInput("");
  
  // Reset date states
  setRegistrationDateFrom(undefined);
  setRegistrationDateTo(undefined);
  setFirstDepositDateFrom(undefined);
  setFirstDepositDateTo(undefined);
  setLastDepositDateFrom(undefined);
  setLastDepositDateTo(undefined);
  setFirstWithdrawalDateFrom(undefined);
  setFirstWithdrawalDateTo(undefined);
  setLastWithdrawalDateFrom(undefined);
  setLastWithdrawalDateTo(undefined);
  
  // Reset boolean filters
  setHasWithdrawal(undefined);
  setHasDeposit(undefined);
  
  // Reset personal info filters
  setDocumentNumber("");
  setMobileNumber("");
  setEmail("");
  setFirstName("");
  setLastName("");
  
  // Reset modification tracking
  setModifiedDates({
    registration: false,
    firstDeposit: false,
    lastDeposit: false,
    firstWithdrawal: false,
    lastWithdrawal: false
  });
  
  // Reset to first page
  setCurrentPage(1);
  
  // Create default filter with only contentType-specific filters
  const defaultFilter = {
    pageNumber: 1,
    pageSize: rowsPerPage
  };
  
  // Apply the default filter
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
        <div className="absolute mt-2 w-full md:w-[90vw] max-w-6xl right-0 md:right-10 md:top-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 p-4">
          {/* Filter groups container */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* === Group 1: Basic Info === */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3">
              <h3 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-2">Basit Bilgiler</h3>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Player ID"
                  value={playerIdInput}
                  onChange={(e) => setPlayerIdInput(e.target.value)}
                  className="w-full border px-3 py-2 rounded text-sm dark:bg-gray-700 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="Username"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  className="w-full border px-3 py-2 rounded text-sm dark:bg-gray-700 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="BTag"
                  value={promoCodeInput}
                  onChange={(e) => setPromoCodeInput(e.target.value)}
                  className="w-full border px-3 py-2 rounded text-sm dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            {/* === Group 2: Account Status === */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3">
              <h3 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-2">Hesap Durumu</h3>
              <div className="space-y-3">
                <select
                  value={hasDeposit === undefined ? "" : hasDeposit ? "yes" : "no"}
                  onChange={(e) => setHasDeposit(e.target.value === "" ? undefined : e.target.value === "yes")}
                  className="w-full border px-3 py-2 rounded text-sm dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Yatırım Var Mı?</option>
                  <option value="yes">Evet</option>
                  <option value="no">Hayır</option>
                </select>
                <select
                  value={hasWithdrawal === undefined ? "" : hasWithdrawal ? "yes" : "no"}
                  onChange={(e) => setHasWithdrawal(e.target.value === "" ? undefined : e.target.value === "yes")}
                  className="w-full border px-3 py-2 rounded text-sm dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Çekim Var Mı?</option>
                  <option value="yes">Evet</option>
                  <option value="no">Hayır</option>
                </select>
              </div>
            </div>

            {/* === Group 3: Personal Info === */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3">
              <h3 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-2">Kişisel Bilgiler</h3>
              <div className="grid grid-cols-2 gap-3">
                <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="col-span-2 w-full border px-3 py-2 rounded text-sm dark:bg-gray-700 dark:text-white" />
                <input type="text" placeholder="İsim" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full border px-3 py-2 rounded text-sm dark:bg-gray-700 dark:text-white" />
                <input type="text" placeholder="Soyisim" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full border px-3 py-2 rounded text-sm dark:bg-gray-700 dark:text-white" />
                <input type="text" placeholder="Tel No" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} className="w-full border px-3 py-2 rounded text-sm dark:bg-gray-700 dark:text-white" />
                <input type="text" placeholder="TCID" value={documentNumber} onChange={(e) => setDocumentNumber(e.target.value)} className="w-full border px-3 py-2 rounded text-sm dark:bg-gray-700 dark:text-white" />
              </div>
            </div>

            {/* === Group 4: Date Ranges === */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3">
              <h3 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-2">Tarih Aralıkları</h3>
              <div className="space-y-3">
                {[
                  { label: 'Kayıt Tarihi', key: 'registration', setFrom: setRegistrationDateFrom, setTo: setRegistrationDateTo },
                  { label: 'İlk Yatırım', key: 'firstDeposit', setFrom: setFirstDepositDateFrom, setTo: setFirstDepositDateTo },
                  { label: 'Son Yatırım', key: 'lastDeposit', setFrom: setLastDepositDateFrom, setTo: setLastDepositDateTo },
                  { label: 'İlk Çekim', key: 'firstWithdrawal', setFrom: setFirstWithdrawalDateFrom, setTo: setFirstWithdrawalDateTo },
                  { label: 'Son Çekim', key: 'lastWithdrawal', setFrom: setLastWithdrawalDateFrom, setTo: setLastWithdrawalDateTo }
                ].map(({ label, key, setFrom, setTo }) => (
                  <div key={key}>
                    <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">{label}</label>
                    <DateRangePicker
                      onChange={({ MinCreatedLocal, MaxCreatedLocal }) => {
                        setFrom(MinCreatedLocal)
                        setTo(MaxCreatedLocal)
                      }}
                      onModifiedChange={(modified) =>
                        setModifiedDates((prev: any) => ({ ...prev, [key]: modified }))
                      }
                      isChanged={modifiedDates[key]}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end gap-3">
            {isFilterOn && (
              <button
                onClick={removeFilter}
                className="px-4 py-2 bg-error-600 text-white text-sm rounded hover:bg-error-700 flex items-center"
              >
                Filtreleri Kaldır
              </button>
            )}
            <button
              onClick={() => {
                handleRefetch()
                setOpen(false)
              }}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 flex items-center"
            >
              Filtreleri Uygula
            </button>
          </div>
        </div>
      )}
    </div>


      <div className="flex justify-between items-center px-4 py-2 bg-gray-50 dark:bg-white/[0.02]">
        <div className="text-sm text-gray-700 dark:text-gray-300">
          Showing {players.length} of {pagination.totalCount} players
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
            {[25, 50, 75, 100].map((val) => (
              <option key={val} value={val}>{val}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <div className="min-w-[1102px] min-h-[600px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell 
                  isHeader 
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer" 
                  onClick={() => handleSort("playerId")}
                >
                  ID{sortColumn === "playerId" && (sortDirection === "asc" ? " 🔼" : " 🔽")}
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Oyuncu
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Email
                </TableCell>
                {contentType !== 'GGA' && (
                  <TableCell 
                    isHeader 
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer" 
                    onClick={() => handleSort("balance")}
                  >
                    Bakiye{sortColumn === "balance" && (sortDirection === "asc" ? " 🔼" : " 🔽")}
                  </TableCell>
                )}
                <TableCell 
                  isHeader 
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer" 
                  onClick={() => handleSort("totalDepositAmount")}
                >
                  Yatırım Miktarı{sortColumn === "totalDepositAmount" && (sortDirection === "asc" ? " 🔼" : " 🔽")}
                </TableCell>
                <TableCell 
                  isHeader 
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer" 
                  onClick={() => handleSort("totalWithdrawalAmount")}
                >
                  Çekim Miktarı{sortColumn === "totalWithdrawalAmount" && (sortDirection === "asc" ? " 🔼" : " 🔽")}
                </TableCell>
                  <TableCell 
                    isHeader 
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer" 
                  >
                    Net Kazanç
                  </TableCell>
                  <TableCell 
                    isHeader 
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer" 
                    onClick={() => handleSort("lastDepositDate")}
                  >
                    Son Yatırım
                  </TableCell>
                  <TableCell 
                    isHeader 
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer" 
                    onClick={() => handleSort("lastDepositDate")}
                  >
                    Son Cekim
                  </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer">
                  Son Giriş
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer">
                  BTag
                </TableCell>
                {/* <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer">
                  Risk
                </TableCell> */}
              </TableRow>
            </TableHeader>

            <TableBody className={`divide-y divide-gray-100 dark:divide-white/[0.05] transition-opacity duration-300 ${loading ? 'opacity-50' : 'opacity-100'}`}>
              {loading ? (
                <>
                  {Array.from({ length: rowsPerPage }).map((_, i) => (
                    <SkeletonRow key={i} columns={11} />
                  ))}
                </>
              ) : (
                players.map((player) => (
                  <TableRow key={player.playerId}>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <div>
                        <Link href={`/player/${player.playerId}`}>
                          <span className="cursor-pointer block font-medium text-blue-900 hover:underline text-theme-sm dark:text-white/90">
                            {player.playerId}
                          </span>
                        </Link>
                        <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                          {player.registrationDateTime && formatDateToDDMMYYYY(player.registrationDateTime)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-700 text-start text-theme-sm dark:text-gray-400">
                      <Link href={`/player/${player.playerId}`} className="cursor-pointer hover:text-gray-900">
                        {player.username}
                      </Link>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-900 text-start text-theme-sm dark:text-gray-400">
                      {player.email}
                    </TableCell>
                    {contentType !== 'GGA' && (
                      <TableCell className="px-4 py-3 text-gray-900 text-start text-theme-sm dark:text-gray-400">
                        {player.balance} TL
                      </TableCell>
                    )}
                    <TableCell className="px-4 py-2 text-start text-theme-sm">
                      <div className="flex flex-row items-center justify-between gap-2">
                        <div className="flex items-baseline min-w-0"> {/* Add min-w-0 and items-baseline */}
                          <span className="text-green-600 truncate"> {/* Add truncate */}
                            {player.totalDepositAmount.toLocaleString()}
                          </span>
                          <span className="text-green-600 whitespace-nowrap ml-1">TL</span> {/* Add whitespace-nowrap */}
                        </div>
                        <div className="flex-shrink-0 w-[20px] flex items-center justify-center text-white dark:text-gray-900 bg-green-600 rounded-md py-[2px] px-[8px]">
                          {player.depositCount}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-2 text-start text-theme-sm">
                      <div className="flex flex-row items-center justify-between">
                        <div className="flex items-baseline min-w-0"> {/* Add min-w-0 and items-baseline */}
                          <span className="text-error-600 text-sm truncate"> {/* Add truncate */}
                            {player.totalWithdrawalAmount.toLocaleString()}
                          </span>
                          <span className="text-error-600 whitespace-nowrap ml-1">TL</span> {/* Add whitespace-nowrap */}
                        </div>
                        <div className="flex-shrink-0 w-[20px] flex items-center justify-center text-white dark:text-gray-900 bg-error-600 rounded-md py-[2px] px-[8px]">
                          {player.withdrawalCount}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {(player.totalDepositAmount - player.totalWithdrawalAmount)} TL
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start text-theme-sm">
                      <div className="flex flex-col items-start gap-1">
                        <span className="text-gray-900 dark:text-gray-300 font-medium">
                          {player.lastDepositAmount ? `${player.lastDepositAmount.toLocaleString()} TL` : '-'}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {player.lastDepositDate ? formatDateToDDMMYYYY(player.lastDepositDate) : '-'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start text-theme-sm">
                      <div className="flex flex-col items-start gap-1">
                        <span className="text-gray-900 dark:text-gray-300 font-medium">
                          {player.lastWithdrawalAmount ? `${player.lastWithdrawalAmount.toLocaleString()} TL` : '-'}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {player.lastWithdrawalDate ? formatDateToDDMMYYYY(player.lastWithdrawalDate) : '-'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {player.lastLoginDateTime ? formatDateToDDMMYYYY(player.lastLoginDateTime) : '-'}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {player.promoCode ? player.promoCode : '-'}
                    </TableCell>
                    {/* <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <button
                        title="Risk Analysis"
                        className="inline-flex items-center justify-center text-purple-500"
                        onClick={() => {}}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-lightning w-6 h-6 hover:fill-yellow-600"
                        >
                          <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                        </svg>
                      </button>
                    </TableCell> */}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center px-4 py-3">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="text-sm px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 dark:text-white disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-sm text-gray-700 dark:text-gray-300">
          Page {currentPage} of {pagination.totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === pagination.totalPages}
          className="text-sm px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 dark:text-white disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}