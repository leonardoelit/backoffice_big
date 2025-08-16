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
  | "id"
  | "updatedAt"
  | "category"
  | "accNum"
  | "amount"
  | "status";

export default function BasicTableWithdrawal() {
  const { usersWithdrawals, getUsersWithdrawals } = useAuth();
  const [sortColumn, setSortColumn] = useState<SortColumn>("updatedAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getUsersWithdrawals()
  }, []);

  useEffect(() => {
  if (Array.isArray(usersWithdrawals)) {
    setIsLoading(false);
  }
}, [usersWithdrawals]);
  

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

  const sortedWithdrawals = [...(usersWithdrawals || [])].sort((a, b) => {
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
      <div className="w-full overflow-x-auto">
        <div className="min-w-[1102px]">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <SortableHeader label="ID" column="id" />
                <SortableHeader label="Tarih" column="updatedAt" />
                <SortableHeader label="Çekim Yöntemi" column="category" />
                <SortableHeader label="Hesap Numbarası" column="accNum" />
                <SortableHeader label="Çekim Miktarı" column="amount" />
                <SortableHeader label="Durum" column="status" />
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {!isLoading ? (
                sortedWithdrawals.map((withdrawal) => (
                  <TableRow key={withdrawal.id}>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <div className="flex items-center gap-3">
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {withdrawal.id}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-800 text-start text-theme-sm dark:text-gray-400">
                      {formatDateToDDMMYYYY(withdrawal.updatedAt)}
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
                    <TableCell className={`px-4 py-3 text-start text-theme-sm ${withdrawal.status === 'accepted' ? 'text-green-800' : withdrawal.status === 'rejected' ? 'text-red-800' : 'text-gray-800 dark:text-gray-400'}`}>
                      {withdrawal.status === 'accepted' ? 'Kabul Edildi' : withdrawal.status === 'rejected' ? 'Reddedildi' : withdrawal.status === 'pending' ? 'Onay Bekliyor' : withdrawal.status}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <SkeletonRow key={i} columns={6} />
                  ))}
                </>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
