"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useAuth } from "@/context/AuthContext";

type SortColumn =
  | "username"
  | "type"
  | "category"
  | "balanceBefore"
  | "amount"
  | "balanceAfter"
  | "adminName"
  | "updatedAt";

export default function BasicTableTransaction() {
  const { usersTransactions, getUserTransactions } = useAuth();
  const [sortColumn, setSortColumn] = useState<SortColumn>("updatedAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    getUserTransactions();
  }, []);

  function formatDateToDDMMYYYY(dateString: string): string {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  }

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const renderSortIcon = (key: string) => {
    if (sortColumn === key) {
      return sortDirection === "asc" ? "▲" : sortDirection === "desc" ? "▼" : "";
    }
    return "";
  };

  const sortedTransactions = [...(usersTransactions || [])].sort((a, b) => {
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];

    if (aValue == null) return 1;
    if (bValue == null) return -1;

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    }

    if (sortColumn === "updatedAt") {
      const dateA = new Date(aValue).getTime();
      const dateB = new Date(bValue).getTime();
      return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
    }

    const aStr = String(aValue).toLowerCase();
    const bStr = String(bValue).toLowerCase();
    return sortDirection === "asc"
      ? aStr.localeCompare(bStr)
      : bStr.localeCompare(aStr);
  });

  const SortableHeader = ({
    label,
    column,
  }: {
    label: string;
    column: SortColumn;
  }) => (
    <TableCell
      isHeader
      onClick={() => handleSort(column)}
      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer select-none"
    >
      <div className="flex items-center gap-1">
        {label}
        <span>{renderSortIcon(column)}</span>
      </div>
    </TableCell>
  );

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="w-full overflow-x-auto">
        <div className="min-w-[1102px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <SortableHeader label="Kullanıcı Adı" column="username" />
                <SortableHeader label="Tip" column="type" />
                <SortableHeader label="Kategori" column="category" />
                <SortableHeader label="İşlem Öncesi Bakiye" column="balanceBefore" />
                <SortableHeader label="İşlem Miktarı" column="amount" />
                <SortableHeader label="İşlem Sonrası Bakiye" column="balanceAfter" />
                <SortableHeader label="Yetkili" column="adminName" />
                <SortableHeader label="Tarih" column="updatedAt" />
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {sortedTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="flex items-center gap-3">
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {transaction.username}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell
                    className={`px-4 py-3 text-start text-theme-sm ${
                      transaction.type === "Balance Addition"
                        ? "text-success-500"
                        : "text-red-300"
                    }`}
                  >
                    {transaction.type === "Balance Addition" ? 'Bakiye Ekleme' : 'Bakiye Azaltma'}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-800 text-start text-theme-sm dark:text-gray-400">
                    {transaction.category === 'Monthly Payout' ? 'Aylık Ödeme' : transaction.category === 'Withdrawal' ? 'Çekim' : transaction.category === 'Withdrawal Rejected' ? 'Çekim Talebi Reddi' : transaction.category === 'Advance Payment' ? 'Avans' : transaction.category === 'Accounting' ? 'Muhasebe' : transaction.category }
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
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
