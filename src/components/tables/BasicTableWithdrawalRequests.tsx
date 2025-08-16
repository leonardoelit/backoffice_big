"use client"
import React, { startTransition, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useAuth, Withdrawal } from "@/context/AuthContext";
import { changeWithdrawalStatusById } from "@/server/userActions";
import Link from "next/link";

type SortKey = keyof Withdrawal;
type SortDirection = "asc" | "desc";

export default function BasicTableWithdrawalRequests({ status }: { status: string }) {
  const { allWithdrawalRequests, getAllWithdrawalsAdmin, userInfo } = useAuth();
  const [withdrawalsTrimmedByStatus, setWithdrawalsTrimmedByStatus] = useState<Withdrawal[]>([])

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [sortKey, setSortKey] = useState<SortKey>("updatedAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const totalPages = Math.ceil((withdrawalsTrimmedByStatus.length || 0) / rowsPerPage);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  function formatDateToDDMMYYYY(dateString: string): string {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
  }

  const sortedWithdrawals = [...withdrawalsTrimmedByStatus].sort((a, b) => {
    const aValue = a[sortKey];
    const bValue = b[sortKey];
    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    }
    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    return 0;
  });

  const paginatedTransactions = sortedWithdrawals.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  useEffect(() => {
    getAllWithdrawalsAdmin();
  }, []);

  useEffect(() => {
    if (allWithdrawalRequests && allWithdrawalRequests.length > 0) {
      startTransition(() => {
        const filtered = status === "pending"
          ? allWithdrawalRequests.filter(w => w.status === "pending")
          : allWithdrawalRequests.filter(w => w.status !== "pending");
        setWithdrawalsTrimmedByStatus(filtered);
        setIsLoading(false);
      });
    }
  }, [allWithdrawalRequests, status]);

  const SkeletonRow = ({ columns }: { columns: number }) => (
    <TableRow>
      {Array.from({ length: columns }).map((_, index) => (
        <TableCell key={index} className="px-5 py-4">
          <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
        </TableCell>
      ))}
    </TableRow>
  );

  const handleAccept = async (withdrawalId: number) => {
    setIsSubmitting(true);
    const token = localStorage.getItem("authToken");
    if (token && userInfo) {
      const response = await changeWithdrawalStatusById(token, withdrawalId, "accepted", userInfo.username);
      if (response.isSuccess) {
        getAllWithdrawalsAdmin();
      }
    }
    setIsSubmitting(false);
  };

  const handleReject = async (withdrawalId: number) => {
    setIsSubmitting(true);
    const token = localStorage.getItem("authToken");
    if (token && userInfo) {
      const response = await changeWithdrawalStatusById(token, withdrawalId, "rejected", userInfo.username);
      if (response.isSuccess) {
        getAllWithdrawalsAdmin();
      }
    }
    setIsSubmitting(false);
  };

  const renderHeaderCell = (label: string, key: SortKey) => (
    <TableCell
      isHeader
      onClick={() => handleSort(key)}
      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer select-none"
    >
      {label}
      {sortKey === key && (sortDirection === "asc" ? " ▲" : " ▼")}
    </TableCell>
  );

  return (
    <div className={`${status === 'pending' && withdrawalsTrimmedByStatus.length === 0 && 'hidden'}`}>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="flex justify-between items-center px-4 py-2 bg-gray-50 dark:bg-white/[0.02]">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Showing {paginatedTransactions.length} of {withdrawalsTrimmedByStatus.length} users
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="rowsPerPage" className="text-sm text-gray-700 dark:text-gray-300">Rows per page:</label>
            <select
              id="rowsPerPage"
              value={rowsPerPage}
              onChange={handleRowsPerPageChange}
              className="text-sm rounded-md border border-gray-300 px-2 py-1 dark:bg-gray-700 dark:text-white"
            >
              {[25, 50, 75, 100].map(val => (
                <option key={val} value={val}>{val}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <div className="min-w-[1102px] h-auto">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  {renderHeaderCell("ID", "id")}
                  {renderHeaderCell("Tarih", "updatedAt")}
                  {renderHeaderCell("Kullanıcı", "username")}
                  {renderHeaderCell("Çekim Yöntemi", "category")}
                  {renderHeaderCell("Hesap Numarası", "accNum")}
                  {renderHeaderCell("Miktar", "amount")}
                  {status !== "pending" && renderHeaderCell("Admin", "adminName")}
                  {renderHeaderCell("Durum", "status")}
                  {status === "pending" && (
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      İşlemler
                    </TableCell>
                  )}
                </TableRow>
              </TableHeader>

              <TableBody className={`divide-y divide-gray-100 dark:divide-white/[0.05] transition-opacity duration-300 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
                {isLoading ? (
                  <>
                    {Array.from({ length: rowsPerPage }).map((_, i) => (
                      <SkeletonRow key={i} columns={9} />
                    ))}
                  </>
                ) : (paginatedTransactions.map((withdrawal) => (
                  <TableRow key={withdrawal.id}>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {withdrawal.id}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-800 text-start text-theme-sm dark:text-gray-400">
                      {formatDateToDDMMYYYY(withdrawal.updatedAt)}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-800 text-start text-theme-sm dark:text-gray-400">
                      <Link href={`/admin/users/${withdrawal.username}`} className="hover:text-blue-800 dark:hover:text-blue-800 transition-colors">
                        {withdrawal.username}
                      </Link>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-800 text-start text-theme-sm dark:text-gray-400">
                      {withdrawal.category}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-800 text-start text-theme-sm dark:text-gray-400">
                      {withdrawal.accNum}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-800 text-start text-theme-sm dark:text-gray-400">
                      {withdrawal.amount}
                    </TableCell>
                    {status !== "pending" && (
                      <TableCell className="px-4 py-3 text-gray-800 text-start text-theme-sm dark:text-gray-400">
                        {withdrawal.adminName}
                      </TableCell>
                    )}
                    <TableCell className={`px-4 py-3 text-start text-theme-sm ${withdrawal.status === 'accepted' ? 'text-green-600' : withdrawal.status === 'rejected' ? 'text-red-600' : 'text-gray-400'}`}>
                      {withdrawal.status === 'accepted' ? 'Kabul edildi' : withdrawal.status === 'rejected' ? 'Reddedildi' : 'Beklemede'}
                    </TableCell>
                    {status === "pending" && (
                      <TableCell className="px-4 py-3 text-gray-900 text-start text-theme-sm dark:text-gray-400 space-x-2">
                        <button
                          onClick={() => handleAccept(withdrawal.id)}
                          title="Onayla"
                          className="inline-flex items-center justify-center text-green-600 font-semibold"
                          disabled={isSubmitting}
                        >
                          ✔
                        </button>
                        <button
                          onClick={() => handleReject(withdrawal.id)}
                          title="Reddet"
                          className="inline-flex items-center justify-center text-red-600 font-semibold"
                          disabled={isSubmitting}
                        >
                          ✖
                        </button>
                      </TableCell>
                    )}
                  </TableRow>
                )))}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="flex justify-between items-center px-4 py-3">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="text-sm px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 dark:text-white disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Page {currentPage} of {totalPages}
          </span>
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
  );
}
