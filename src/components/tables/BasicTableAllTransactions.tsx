"use client";
import React, { startTransition, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

type SortKey =
  | "username"
  | "type"
  | "category"
  | "balanceBefore"
  | "amount"
  | "balanceAfter"
  | "adminName"
  | "updatedAt";

type SortOrder = "asc" | "desc";

export default function BasicTableAllTransactions() {
  const { allTransactionsList, getAllTransactionsAdmin } = useAuth();

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [isLoading, setIsLoading] = useState(true);
  const [sortKey, setSortKey] = useState<SortKey>("updatedAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const totalPages = Math.ceil((allTransactionsList ? allTransactionsList.length : 0) / rowsPerPage);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  function formatDateToDDMMYYYY(dateString: string): string {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  }

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const sortedTransactions = [...(allTransactionsList || [])].sort((a, b) => {
    const valA = a[sortKey];
    const valB = b[sortKey];

    if (sortKey === "updatedAt") {
      return sortOrder === "asc"
        ? new Date(valA).getTime() - new Date(valB).getTime()
        : new Date(valB).getTime() - new Date(valA).getTime();
    }

    if (typeof valA === "number" && typeof valB === "number") {
      return sortOrder === "asc" ? valA - valB : valB - valA;
    }

    return sortOrder === "asc"
      ? String(valA).localeCompare(String(valB))
      : String(valB).localeCompare(String(valA));
  });

  const paginatedTransactions = sortedTransactions.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  useEffect(() => {
    getAllTransactionsAdmin();
  }, []);

  useEffect(() => {
    if (allTransactionsList && allTransactionsList.length > 0) {
      startTransition(() => setIsLoading(false));
    }
  }, [allTransactionsList]);

  const renderSortIcon = (key: string) => {
    if (sortKey === key) {
      return sortOrder=== "asc" ? "▲" : sortOrder === "desc" ? "▼" : "";
    }
    return "";
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

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="flex justify-between items-center px-4 py-2 bg-gray-50 dark:bg-white/[0.02]">
        <div className="text-sm text-gray-700 dark:text-gray-300">
          Showing {paginatedTransactions.length} of {allTransactionsList?.length || 0} users
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="rowsPerPage" className="text-sm text-gray-700 dark:text-gray-300">Rows per page:</label>
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
                {[
                  { label: "Kullanıcı", key: "username" },
                  { label: "Tip", key: "type" },
                  { label: "Kategori", key: "category" },
                  { label: "Eski Bakiye", key: "balanceBefore" },
                  { label: "Miktar", key: "amount" },
                  { label: "Yeni Bakiye", key: "balanceAfter" },
                  { label: "Admin", key: "adminName" },
                  { label: "Tarih", key: "updatedAt" },
                ].map(({ label, key }) => (
                  <TableCell
                    key={key}
                    onClick={() => handleSort(key as SortKey)}
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer select-none"
                  >
                    {label}
                    {renderSortIcon(key as SortKey)}
                  </TableCell>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody className={`divide-y divide-gray-100 dark:divide-white/[0.05] transition-opacity duration-300 ${isLoading ? "opacity-50" : "opacity-100"}`}>
              {isLoading ? (
                Array.from({ length: rowsPerPage }).map((_, i) => (
                  <SkeletonRow key={i} columns={8} />
                ))
              ) : (
                paginatedTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <div className="flex items-center gap-3">
                        <Link href={`/admin/users/${transaction.username}`}>
                          <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90 hover:text-blue-800 dark:hover:text-blue-800 transition-colors">
                            {transaction.username}
                          </span>
                        </Link>
                      </div>
                    </TableCell>
                    <TableCell className={`px-4 py-3 text-start text-theme-sm ${transaction.type === "Balance Addition" ? "text-success-500" : "text-red-300"}`}>
                      {transaction.type}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-800 text-start text-theme-sm dark:text-gray-400">
                      {transaction.category}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-800 text-start text-theme-sm dark:text-gray-400">
                      {transaction.balanceBefore}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-800 text-start text-theme-sm dark:text-gray-400">
                      {transaction.amount}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-800 text-start text-theme-sm dark:text-gray-400">
                      {transaction.balanceAfter}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-800 text-start text-theme-sm dark:text-gray-400">
                      {transaction.adminName}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-800 text-start text-theme-sm dark:text-gray-400">
                      {formatDateToDDMMYYYY(transaction.updatedAt)}
                    </TableCell>
                  </TableRow>
                ))
              )}
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
  );
}
