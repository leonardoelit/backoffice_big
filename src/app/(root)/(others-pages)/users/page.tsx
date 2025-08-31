"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { UserData } from '@/components/constants/types';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import { getUsers } from '@/components/lib/api';

const SkeletonRow = ({ columns }: { columns: number }) => (
  <TableRow>
    {Array.from({ length: columns }).map((_, index) => (
      <TableCell key={index} className="px-5 py-4">
        <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
      </TableCell>
    ))}
  </TableRow>
);

const UsersPage = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [totalCount, setTotalCount] = useState(0);

useEffect(() => {
  setLoading(true);
  getUsers()
  .then((allUsers) => {
    const mapped = allUsers.map(u => ({
      ...u,
      role: u.roles, // map API Roles to frontend role
    }));
    setTotalCount(mapped.length);
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    setUsers(mapped.slice(start, end));
  })
    .catch(err => console.error(err))
    .finally(() => setLoading(false));
}, [currentPage, rowsPerPage]);

  const totalPages = Math.ceil(totalCount / rowsPerPage);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-4">
      <h1 className="text-2xl font-semibold mb-4">Users</h1>

      <div className="w-full overflow-x-auto">
        <div className="min-w-[800px] min-h-[400px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">ID</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Full Name</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Email</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Role</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Status</TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className={`divide-y divide-gray-100 dark:divide-white/[0.05] transition-opacity duration-300 ${loading ? 'opacity-50' : 'opacity-100'}`}>
              {loading
                ? Array.from({ length: rowsPerPage }).map((_, i) => <SkeletonRow key={i} columns={5} />)
                : users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="px-5 py-4 text-theme-sm">
                      <Link href={`/user/${user.id}`} className="text-blue-600 hover:underline">{user.id}</Link>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-theme-sm">{user.firstName} {user.lastName}</TableCell>
                    <TableCell className="px-5 py-4 text-theme-sm">{user.email}</TableCell>
                    <TableCell className="px-5 py-4 text-theme-sm">{user.role?.join(", ")}</TableCell>
                    <TableCell className="px-5 py-4 text-theme-sm">
                      <span className={`px-2 py-1 rounded-full text-white text-xs ${user.status ? 'bg-green-500' : 'bg-red-500'}`}>
                        {user.status ? 'Active' : 'Inactive'}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              }
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-end w-full px-4 py-2 space-x-3 border-t border-[#c8c9cb] mt-4">
        <div className="text-sm text-gray-700 dark:text-gray-300 px-2 border-r border-[#c8c9cb]">
          Showing {users.length} of {totalCount} users
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="rowsPerPage" className="text-sm text-gray-700 dark:text-gray-300">Rows per page:</label>
          <select
            id="rowsPerPage"
            value={rowsPerPage}
            onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }}
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
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="text-sm px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 dark:text-white disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="text-sm px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 dark:text-white disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
