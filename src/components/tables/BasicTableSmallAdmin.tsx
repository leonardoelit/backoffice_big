import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

import Image from "next/image";
import { AdminUserTableStats } from "@/app/admin/page";
import Link from "next/link";

export default function BasicTableSmallAdmin({ list, type }: { list:AdminUserTableStats[], type:string }) {

    const [currentList, setCurrentList] = useState<AdminUserTableStats[]>([])

    useEffect(() => {
        if(list){
            setCurrentList(list)
        }
    }, [list])
    

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
                  Kullanıcı
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
              {currentList.map((user) => (
                <TableRow key={user.id} className="h-16">
                  <TableCell className="px-5 py-4 sm:px-6 text-start align-middle">
                    <Link href={`/admin/users/${user.username}`}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 overflow-hidden rounded-full">
                          <Image
                            width={40}
                            height={40}
                            src={`https://api.dicebear.com/7.x/personas/png?seed=${encodeURIComponent(user.username)}`}
                            alt={user.username}
                            className="object-cover w-10 h-10"
                            />
                        </div>
                        <div>
                          <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                            {`${user.fullname} ${user.lastname}`}
                          </span>
                          <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                            {user.username}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell className="px-5 py-4 sm:px-6 text-start align-middle">
                    <div className="flex items-center gap-3">
                      <div>
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {type === 'deposit' ? parseFloat((Number(user.usersTotalDeposit)).toFixed(2)) : type === 'withdrawal' ? parseFloat(Number(user.usersTotalWithdrawal).toFixed(2)) : parseFloat(Number(user.usersTotalDeposit - user.usersTotalWithdrawal ).toFixed(2)) } TL
                        </span>
                        <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                          {type === 'deposit' ? `${user.depositCount} Yatırım` : type === 'withdrawal' ? `${user.withdrawalCount} Çekim` : user.usersTotalDeposit > 0 ? parseFloat((((user.usersTotalDeposit - user.usersTotalWithdrawal ) / user.usersTotalDeposit) * 100).toFixed(2)) : 0}{type === 'contribution' && '%'}
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
