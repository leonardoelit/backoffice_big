import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

import Image from "next/image";
import { EnrichedClientData } from "@/context/AuthContext";
import Link from "next/link";

export default function BsicTableSmall({ list, type }: { list: EnrichedClientData[]; type: string }) {
  const [currentList, setCurrentList] = useState<EnrichedClientData[]>([]);

  useEffect(() => {
    if (list) {
      setCurrentList(list);
    }
  }, [list]);

  function fixName(name: string): string {
    const parts = name.trim().split(/\s+/);
    if (parts.length < 2) return name;

    const lastName = parts[0];
    const firstAndMiddle = parts.slice(1).join(" ");
    return `${firstAndMiddle} ${lastName}`;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="w-full overflow-x-auto">
        <div className="w-auto">
          <Table className="w-full">
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow className="h-12">
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Oyuncu
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Bilgi
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {currentList.map((player) => (
                <TableRow key={player.ClientId} className="h-16">
                  <TableCell className="px-5 py-2 sm:px-6 text-start align-middle">
                    <Link href={`/player/${player.ClientId}`}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 overflow-hidden rounded-full">
                          <Image
                            width={40}
                            height={40}
                            src={`https://api.dicebear.com/7.x/personas/png?seed=${encodeURIComponent(player.Login)}`}
                            alt={player.Login}
                            className="object-cover w-10 h-10"
                          />
                        </div>
                        <div>
                          <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                            {fixName(String(player.Name))}
                          </span>
                          <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                            {player.Login}
                            <br />
                            {player.ClientId}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell className="px-5 py-2 sm:px-6 text-start align-middle">
                    <div className="flex items-center gap-3">
                      <div>
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {type === "deposit"
                            ? player.DepositAmount
                            : type === "withdrawal"
                            ? player.WithdrawalAmount
                            : player.DepositAmount - player.WithdrawalAmount}{" "}
                          TL
                        </span>
                        <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                          {type === "deposit"
                            ? `${player.DepositCount} Yatırım`
                            : type === "withdrawal"
                            ? `${player.WithdrawalCount} Çekim`
                            : player.DepositAmount > 0
                            ? parseFloat(
                                (
                                  ((player.DepositAmount - player.WithdrawalAmount) /
                                    player.DepositAmount) *
                                  100
                                ).toFixed(2)
                              )
                            : 0}
                          {type === "contribution" && "%"}
                        </span>
                      </div>
                    </div>
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
