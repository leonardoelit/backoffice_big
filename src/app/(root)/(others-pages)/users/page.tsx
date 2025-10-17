"use client";

import React, { useState, useEffect, Fragment } from 'react';
import Link from 'next/link';
import { UserData } from '@/components/constants/types';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
// Assuming your api functions are in this file
import { getUsers, changeUsersPassword, changeUsersStatus, deleteUser } from '@/components/lib/api'; 
import { showToast } from '@/utils/toastUtil';
import { KeyRound, ToggleLeft, ToggleRight, Trash2, X } from 'lucide-react';

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
  const [loading, setLoading] = useState(true);
  
  // State to hold the master list of all users fetched from the API
  const [allUsers, setAllUsers] = useState<UserData[]>([]);
  
  // State for the users currently visible on the page (the paginated slice)
  const [paginatedUsers, setPaginatedUsers] = useState<UserData[]>([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  // Modal and action state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // 1. Effect to fetch ALL users from the API, but only ONCE.
  useEffect(() => {
    setLoading(true);
    getUsers()
      .then((data) => {
        if (!data.isSuccess) {
          showToast(data.message || "Error fetching user data", "error");
          return;
        }
        const mapped = data.data!.map(u => ({
          ...u,
          role: u.roles,
        }));
        setAllUsers(mapped);
      })
      .catch(err => {
        console.error(err);
        showToast("An unexpected error occurred", "error");
      })
      .finally(() => setLoading(false));
  }, []); // Empty dependency array ensures this runs only once on mount

  // 2. Effect to update the visible (paginated) users whenever the master list or pagination changes.
  useEffect(() => {
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    setPaginatedUsers(allUsers.slice(start, end));
  }, [allUsers, currentPage, rowsPerPage]);

  // Handler to change user status
  const handleStatusChange = async (user: UserData) => {
    if(isUpdating){
      showToast("Lütfen güncellemenin bitmesini bekleyiniz", "info")
      return;
    }
    setIsUpdating(true);
    const newStatus = !user.status;
    const originalStatus = user.status;

    // Optimistic UI update on the MASTER list for data consistency
    setAllUsers(currentUsers => currentUsers.map(u => u.id === user.id ? { ...u, status: newStatus } : u));

    const response = await changeUsersStatus({ userId: user.id, newStatus: newStatus });

    if (response.isSuccess) {
      showToast(`User status updated to ${newStatus ? 'Active' : 'Inactive'}`, "success");
    } else {
      showToast(response.message || "Failed to update status", "error");
      // Revert on failure on the MASTER list
      setAllUsers(currentUsers => currentUsers.map(u => u.id === user.id ? { ...u, status: originalStatus } : u));
    }
    setIsUpdating(false)
  };

   const handleDeleteUser = async (user: UserData) => {
    if (isDeleting) return;
    const confirmed = confirm(
      `Are you sure you want to delete user "${user.email}"?`
    );
    if (!confirmed) return;

    setIsDeleting(true);
    const response = await deleteUser(user.id);

    if (response.isSuccess) {
      showToast("User deleted successfully!", "success");
      // Remove from master list
      setAllUsers((prev) => prev.filter((u) => u.id !== user.id));
    } else {
      showToast(response.message || "Failed to delete user", "error");
    }
    setIsDeleting(false);
  };

  // Handler to change user password
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !newPassword) return;

    setIsSubmitting(true);
    const response = await changeUsersPassword({ userId: selectedUser.id, newPassword });

    if (response.isSuccess) {
      showToast("Password updated successfully!", "success");
      closeModal();
    } else {
      showToast(response.message || "Failed to update password", "error");
    }
    setIsSubmitting(false);
  };
  
  // Modal controls
  const openModal = (user: UserData) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setNewPassword('');
  };

  const totalPages = Math.ceil(allUsers.length / rowsPerPage);

  return (
    <Fragment>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-4">
        <h1 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Users</h1>

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
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Actions</TableCell>
                </TableRow>
              </TableHeader>

              <TableBody className={`divide-y divide-gray-100 dark:divide-white/[0.05] transition-opacity duration-300 ${loading ? 'opacity-50' : 'opacity-100'}`}>
                {loading
                  ? Array.from({ length: rowsPerPage }).map((_, i) => <SkeletonRow key={i} columns={6} />)
                  : paginatedUsers.map((user) => (
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
                         <TableCell className="px-5 py-4 text-theme-sm">
                           <div className="flex items-center gap-4">
                             <button onClick={() => handleStatusChange(user)} title={user.status ? 'Deactivate User' : 'Activate User'} className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition-colors">
                               {user.status 
                                 ? <ToggleRight size={22} className="text-green-500"/> 
                                 : <ToggleLeft size={22} className="text-red-500"/>
                               }
                             </button>
                             <button onClick={() => openModal(user)} title="Change Password" className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition-colors">
                               <KeyRound size={20} />
                             </button>
                             <button
                              onClick={() => handleDeleteUser(user)}
                              title="Delete User"
                              disabled={isDeleting}
                              className="text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors disabled:opacity-50"
                            >
                              <Trash2 size={20} />
                            </button>
                           </div>
                         </TableCell>
                      </TableRow>
                    ))
                }
              </TableBody>
            </Table>
          </div>
        </div>
        
        {/* Pagination Controls */}
        <div className="flex items-center justify-end w-full px-4 py-2 space-x-3 border-t border-gray-200 dark:border-white/[0.05] mt-4">
          <div className="text-sm text-gray-700 dark:text-gray-300 px-2 border-r border-[#c8c9cb]">
            Showing {paginatedUsers.length} of {allUsers.length} users
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
              disabled={currentPage === totalPages || totalPages === 0}
              className="text-sm px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 dark:text-white disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
            {/* Modal content is unchanged */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6 m-4 transform transition-all">
                <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Change Password</h3>
                    <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                        <X size={24} />
                    </button>
                </div>
                <div className="mt-4">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                        You are changing the password for <strong className="font-medium text-gray-800 dark:text-gray-100">{selectedUser.email}</strong>.
                    </p>
                    <form onSubmit={handlePasswordChange} className="mt-4 space-y-4">
                        <div>
                            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">New Password</label>
                            <input
                                type="password"
                                id="newPassword"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                required
                            />
                        </div>
                        <div className="flex items-center justify-end pt-4 border-t border-gray-200 dark:border-gray-700 space-x-3">
                            <button type="button" onClick={closeModal} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-transparent rounded-md hover:bg-gray-200 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">
                                Cancel
                            </button>
                            <button type="submit" disabled={isSubmitting || !newPassword} className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed">
                                {isSubmitting ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
      )}
    </Fragment>
  );
};

export default UsersPage;