import React, { startTransition, useEffect, useRef, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useAuth } from "@/context/AuthContext";
import { deleteUser } from "@/server/userActions";
import { showToast } from "@/utils/toastUtil";

// Utility: Sorting function
const sortData = (data: any[], column: string, direction: "asc" | "desc") => {
  return [...data].sort((a, b) => {
    const aValue = a[column];
    const bValue = b[column];

    if (aValue === null || aValue === undefined) return 1;
    if (bValue === null || bValue === undefined) return -1;

    if (typeof aValue === "number" && typeof bValue === "number") {
      return direction === "asc" ? aValue - bValue : bValue - aValue;
    }

    return direction === "asc"
      ? String(aValue).localeCompare(String(bValue))
      : String(bValue).localeCompare(String(aValue));
  });
};

export default function BasicTablePendingUser() {
  const { allUsersList, token, getAllUsersAdmin, changeUserCredentialsAdmin } = useAuth();

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [isLoading, setIsLoading] = useState(true);
  const [openPopover, setOpenPopover] = useState<{ userId: number | null; field: 'pct' | 'btag' | null }>({ userId: null, field: null });
  const [pctValues, setPctValues] = useState<Record<number, number>>({});
  const [btagValues, setBtagValues] = useState<Record<string, string>>({});
  const [isButtonPressed, setisButtonPressed] = useState(false);
  const [isChangingPct, setIsChangingPct] = useState(false);
  const [isChangingBtag, setIsChangingBtag] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [changingUsername, setChangingUsername] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" | null }>({ key: "", direction: null });

  const popoverRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    getAllUsersAdmin();
  }, [token]);

  useEffect(() => {
    if (allUsersList && allUsersList.length > 0) {
        console.log(allUsersList)
      startTransition(() => {
        setIsLoading(false);
        setIsChangingPct(false);
        setIsChangingBtag(false);
      });
    }
  }, [allUsersList]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setOpenPopover({ userId: null, field: null });
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleSort = (key: string) => {
    setSortConfig(prev => {
      if (prev.key === key) {
        if (prev.direction === "asc") return { key, direction: "desc" };
        if (prev.direction === "desc") return { key: "", direction: null };
      }
      return { key, direction: "asc" };
    });
  };

  function formatDateToDDMMYYYY(dateString: string): string {
    const date = new Date(dateString);
    return `${String(date.getDate()).padStart(2, "0")}.${String(date.getMonth() + 1).padStart(2, "0")}.${date.getFullYear()}`;
  }

  const sortedUsers = sortConfig.key && sortConfig.direction
    ? sortData(allUsersList, sortConfig.key, sortConfig.direction)
    : allUsersList;

  const totalPages = Math.ceil((sortedUsers?.length || 0) / rowsPerPage);

  const paginatedUsers = sortedUsers.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
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

  const handlePctChange = (username: string, pct: string | number) => {
    setChangingUsername(username);
    setIsChangingPct(true);
    changeUserCredentialsAdmin(username, null, Number(pct), null, null);
    getAllUsersAdmin();
  };

  const handleBtagChange = (username: string, btag: string) => {
    setChangingUsername(username);
    setIsChangingBtag(true);
    changeUserCredentialsAdmin(username, btag, null, null, null);
    getAllUsersAdmin();
  };

  const handleApprove = (username: string) => {
    changeUserCredentialsAdmin(username, null, null, null, true);
    getAllUsersAdmin();
  };

  const handleDeleteUser = async (username: string) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setisButtonPressed(true);
      const response = await deleteUser(token, username);
      if (response.isSuccess) getAllUsersAdmin();
      showToast(response.isSuccess ? 'New User Register request rejected and user deleted.' : response.message, response.isSuccess ? 'info' : 'error')
      setisButtonPressed(false);
    }
  };

  const getSortArrow = (key: string) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "asc" ? "▲" : sortConfig.direction === "desc" ? "▼" : "";
    }
    return "";
  };
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="flex justify-between items-center px-4 py-2 bg-gray-50 dark:bg-white/[0.02]">
        <div className="text-sm text-gray-700 dark:text-gray-300">
          Onay Bekleyen Kullanıcılar
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
        <div className="min-w-[1102px] h-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer" onClick={() => handleSort("id")}>ID {getSortArrow("id")}</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Kullanıcı adı</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer">İsim</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer">Email</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer">BTag</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer" onClick={() => handleSort("role")}>Rol {getSortArrow("role")}</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer" onClick={() => handleSort("balance")}>Bakiye {getSortArrow("balance")}</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer" onClick={() => handleSort("pct")}>Oran {getSortArrow("pct")}</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer" onClick={() => handleSort("createdAt")}>Tarih {getSortArrow("createdAt")}</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer" >Onay</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer">
                    İşlemler
                </TableCell>

              </TableRow>
            </TableHeader>

            <TableBody className={`divide-y divide-gray-100 dark:divide-white/[0.05] transition-opacity duration-300 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
              {isLoading ? (
                <>
                  {Array.from({ length: rowsPerPage }).map((_, i) => (
                    <SkeletonRow key={i} columns={11} />
                  ))}
                </>
              ) : (paginatedUsers.map((user) => {
                if(user.approved) return;
                return (
                  <TableRow key={user.id}>
                    <TableCell className="px-4 py-3 text-gray-900 text-start text-theme-sm dark:text-gray-400">{user.id}</TableCell>
                    <TableCell className="px-4 py-3 text-gray-900 text-start text-theme-sm dark:text-gray-400">{user.username}</TableCell>
                    <TableCell className="px-4 py-3 text-gray-900 text-start text-theme-sm dark:text-gray-400">{`${user.fullname} ${user.lastname}`}</TableCell>
                    <TableCell className="px-4 py-3 text-gray-900 text-start text-theme-sm dark:text-gray-400">{user.email}</TableCell>
                    {isChangingBtag && changingUsername === user.username ? (
                      <TableCell className="px-5 py-4">
                            <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
                        </TableCell>
                    ): (
                    <TableCell className="relative px-4 py-3 text-blue-900 text-start text-theme-sm dark:text-gray-400">
                        <span
                            onClick={() => {
                            setOpenPopover({ userId: user.id, field: 'btag' });
                            setBtagValues((prev) => ({ ...prev, [user.id]: user.btag }));
                            }}
                            className="cursor-pointer hover:underline"
                        >
                            {user.btag}
                        </span>

                        {openPopover.userId === user.id && openPopover.field === 'btag' && (
                            <div
                            ref={popoverRef}
                            className="absolute z-50 bg-white dark:bg-gray-800 shadow-lg border rounded-xl p-3 top-full left-1/2 -translate-x-1/2 mt-2 w-40"
                            >
                            <input
                                type="text"
                                value={btagValues[user.id] ?? ''}
                                onChange={(e) =>
                                setBtagValues((prev) => ({
                                    ...prev,
                                    [user.id]: e.target.value,
                                }))
                                }
                                className="w-full text-sm px-2 py-1 border rounded-md mb-2 dark:bg-gray-700 dark:text-white"
                            />
                            <button
                                onClick={() => {
                                console.log(`Apply BTAG ${btagValues[user.id]} for user ${user.id}`);
                                handleBtagChange(user.username, btagValues[user.id]);
                                setOpenPopover({ userId: null, field: null });
                                }}
                                className="w-full bg-green-600 hover:bg-green-700 text-white text-xs py-1 rounded-md"
                            >
                                Uygula
                            </button>
                            </div>
                        )}
                    </TableCell>
                    )}
                    <TableCell className="px-4 py-3 text-gray-900 text-start text-theme-sm dark:text-gray-400">{user.role}</TableCell>
                    <TableCell className="px-4 py-3 text-gray-900 text-start text-theme-sm dark:text-gray-400">{user.balance}</TableCell>
                      {isChangingPct && changingUsername === user.username ? (
                        <TableCell className="px-5 py-4">
                            <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
                        </TableCell>
                      ) : (
                    <TableCell className="relative px-4 py-3 text-blue-900 text-start text-theme-sm dark:text-gray-400">
                        <span
                            onClick={() => {
                            setOpenPopover({ userId: user.id, field: 'pct' });
                            setPctValues((prev) => ({ ...prev, [user.id]: user.pct }));
                            }}
                            className="cursor-pointer hover:underline"
                        >
                            {user.pct}%
                        </span>

                        {openPopover.userId === user.id && openPopover.field === 'pct' && (
                            <div
                            ref={popoverRef}
                            className="absolute z-50 bg-white dark:bg-gray-800 shadow-lg border rounded-xl p-3 top-full left-1/2 -translate-x-1/2 mt-2 w-40"
                            >
                            <input
                                type="number"
                                value={pctValues[user.id] ?? ''}
                                onChange={(e) =>
                                setPctValues((prev) => ({
                                    ...prev,
                                    [user.id]: Number(e.target.value),
                                }))
                                }
                                className="w-full text-sm px-2 py-1 border rounded-md mb-2 dark:bg-gray-700 dark:text-white"
                                min={0}
                                max={100}
                            />
                            <button
                                onClick={() => {
                                    console.log(`Apply PCT ${pctValues[user.id]} for user ${user.id}`);
                                    handlePctChange(user.username, pctValues[user.id])
                                    setOpenPopover({ userId: null, field: null });
                                }}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs py-1 rounded-md"
                            >
                                Uygula
                            </button>
                            </div>
                        )}
                    </TableCell>
                      )}
                    <TableCell className="px-4 py-3 text-gray-900 text-start text-theme-sm dark:text-gray-400">{formatDateToDDMMYYYY(user.createdAt)}</TableCell>
                    <TableCell className="px-5 py-3 text-gray-900 text-center text-theme-sm dark:text-gray-400">{user.approved ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-badge-check-icon lucide-badge-check w-6 h-6 fill-green-600 text-white"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><path d="m9 12 2 2 4-4"/></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-dashed-icon lucide-circle-dashed"><path d="M10.1 2.182a10 10 0 0 1 3.8 0"/><path d="M13.9 21.818a10 10 0 0 1-3.8 0"/><path d="M17.609 3.721a10 10 0 0 1 2.69 2.7"/><path d="M2.182 13.9a10 10 0 0 1 0-3.8"/><path d="M20.279 17.609a10 10 0 0 1-2.7 2.69"/><path d="M21.818 10.1a10 10 0 0 1 0 3.8"/><path d="M3.721 6.391a10 10 0 0 1 2.7-2.69"/><path d="M6.391 20.279a10 10 0 0 1-2.69-2.7"/></svg>
                    )}</TableCell>
                    <TableCell className="flex gap-4 px-4 py-3 text-gray-900 text-start text-theme-sm dark:text-gray-400 space-x-2">
                        {/* Login Icon */}
                        <button
                            onClick={() => handleApprove(user.username)}
                            title="Approve user"
                            className="inline-flex items-center justify-center font-semibold text-lg text-green-600 hover:text-green-800"
                            disabled={isButtonPressed}
                        >
                            ✔
                        </button>

                        {/* Delete Icon */}
                        <button
                            onClick={() => {
                              setUserToDelete(user.username);
                              setShowDeleteModal(true);
                            }}
                            title="Reject user"
                            className="inline-flex items-center justify-center font-semibold text-lg text-red-600 hover:text-red-800"
                            disabled={isButtonPressed}
                        >
                            ✖
                        </button>
                    </TableCell>
                  </TableRow>
                );
              }))}
            </TableBody>
          </Table>
          {showDeleteModal && userToDelete && (
            <div className="fixed inset-0 z-999999 flex items-center justify-center bg-black/50">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Kullanıcı reddetmeyi onayla</h2>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-6">
                  <span className="font-medium">{userToDelete}</span> isimli kullanıcının kayıt olma isteğini reddetmek istediğinize emin misiniz ? Bu işlem geri alınamaz.
                </p>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setUserToDelete(null);
                    }}
                    className="px-4 py-1 text-sm rounded bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                    disabled={isButtonPressed}
                  >
                    İptal
                  </button>
                  <button
                    onClick={async () => {
                      await handleDeleteUser(userToDelete);
                      setShowDeleteModal(false);
                      setUserToDelete(null);
                    }}
                    className="px-4 py-1 text-sm rounded bg-red-600 hover:bg-red-700 text-white"
                    disabled={isButtonPressed}
                  >
                    Reddet
                  </button>
                </div>
              </div>
            </div>
          )}
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
